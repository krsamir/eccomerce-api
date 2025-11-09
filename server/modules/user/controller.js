import {
  // checkIsAuthenticatedHandler,
  CONSTANTS,
  ENVIRONMENT,
  logger as logs,
  RESPONSE_STATUS,
  // TRANSFORMERS,
  // transformText,
} from "@ecom/utils";
import { UserService } from "@ecom/datasource";
import { inspect } from "util";
import { handlers } from "@ecom/mail";
import knex from "@ecom/datasource";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class UserController {
  async registerUser(req, res) {
    const user = req.body;
    const trx = await knex.transaction();
    try {
      logger.info(`UserController.registerUser called :`);
      const now = new Date();
      const token = crypto?.randomUUID()?.slice(0, 6);
      const valid_till = new Date(
        now.getTime() +
          CONSTANTS.AUTHENTICATION.TOKEN_VALIDITY_IN_MINS * 60 * 1000,
      );
      const [data] = await UserService.registerUser({
        ...user,
        id: crypto.randomUUID(),
        token,
        valid_till,
        is_active: false,
        password: null,
        tenant_type: CONSTANTS.TENANT_TYPE.APP,
        trx,
      });

      if (ENVIRONMENT.SEND_EMAILS === "Y") {
        await handlers.forgotPasswordMailHandler({
          to: user.email,
          subject: "Verify your account",
          payload: {
            code: token,
            timestamp: valid_till,
            link: `${ENVIRONMENT.CLIENT_URL}/verification?email=${user.email}&token=${token}`,
          },
        });
      }
      if (data.affectedRows > 0) {
        trx.commit();
        return res.status(RESPONSE_STATUS.OK_200).send({
          message:
            "OTP has been sent to your email. Please verify before it expires",
          status: CONSTANTS.STATUS.SUCCESS,
        });
      } else {
        trx.rollback();
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "Something went wrong",
          status: CONSTANTS.STATUS.FAILURE,
        });
      }
    } catch (error) {
      logger.error(`
        UserController.registerUser: Error occurred : ${inspect(error)}`);
      trx.rollback();
      throw error;
    }
  }

  async confirmToken(req, res) {
    const { email, token } = req.body;
    try {
      logger.info(`UserController.confirmToken called :`);
      const data = await UserService.confirmAccount({
        email,
        token,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        data: !!data,
        message: data
          ? "Account confirmed, proceed setting up password"
          : "Incorrect data.",
        status: data ? CONSTANTS.STATUS.SUCCESS : CONSTANTS.STATUS.FAILURE,
      });
    } catch (error) {
      logger.error(`
        UserController.confirmToken: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async setPassword(req, res) {
    const { email, password, token } = req.body;
    try {
      logger.info(`UserController.setPassword called :`);
      var salt = genSaltSync(CONSTANTS.AUTHENTICATION.BCRYPT_SALT);
      var hashedPassword = hashSync(password, salt);

      const data = await UserService.setPassword({
        email,
        password: hashedPassword,
        token,
      });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data
          ? "Password set successfully. Proceed with login"
          : "Unable to set password.",
        status: data ? CONSTANTS.STATUS.SUCCESS : CONSTANTS.STATUS.FAILURE,
      });
    } catch (error) {
      logger.error(`
        UserController.setPassword: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      logger.info(`UserController.login called :`);
      const data = await UserService.login({ email, password });
      if (data) {
        if (data?.invalid_logins <= 0) {
          return res.status(RESPONSE_STATUS.OK_200).send({
            message:
              "Maximum password attempt exceeded. Please reverify yourself.",
            status: CONSTANTS.STATUS.FAILURE,
          });
        }
        const hashedPassword = data.password;
        const ismatched = compareSync(
          password,
          hashedPassword ? hashedPassword : "",
        );
        if (ismatched) {
          await UserService.setLoginDetails({
            payload: {
              last_login: knex.raw(`NOW()`),
              invalid_logins:
                CONSTANTS.AUTHENTICATION.NO_OF_INVALID_LOGINS_COUNT,
            },
            condition: { id: data?.id },
          });
          const jwtToken = jwt.sign(
            {
              id: data.id,
              email: data.email,
              user_name: data.user_name,
            },
            ENVIRONMENT.JWT_SECRET,
            {
              expiresIn: ENVIRONMENT.JWT_EXPIRATION_TIME,
            },
          );

          return res.status(RESPONSE_STATUS.OK_200).send({
            message: "Logged in.",
            status: CONSTANTS.STATUS.SUCCESS,
            token: jwtToken,
          });
        }
        await UserService.setLoginDetails({
          payload: {
            invalid_logins: knex.raw("?? - 1", ["invalid_logins"]),
          },
          condition: { id: data?.id },
        });
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "Wrong Credentials",
          status: CONSTANTS.STATUS.FAILURE,
        });
      } else {
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "Wrong Credentials",
          status: CONSTANTS.STATUS.FAILURE,
        });
      }
    } catch (error) {
      logger.error(`
        UserController.login: Error occurred : ${inspect(error)}`);
      throw error;
    }
  }

  async forgotPassword(req, res) {
    const { email = "" } = req.body;
    const trx = await knex.transaction();
    try {
      logger.info(`UserController.forgotPassword called :`);
      if (!email) {
        return res.status(RESPONSE_STATUS.BAD_REQUEST_400).send({
          message: "Invalid Payload.",
          status: CONSTANTS.STATUS.FAILURE,
        });
      }

      const now = new Date();
      const valid_till = new Date(
        now.getTime() +
          CONSTANTS.AUTHENTICATION.TOKEN_VALIDITY_IN_MINS * 60 * 1000,
      );
      const token = crypto?.randomUUID()?.slice(0, 6);
      const payload = {
        valid_till,
        token,
        is_active: false,
        password: null,
      };
      const data = await UserService.setTokenForEmailAndValidity({
        email,
        payload,
        trx,
      });
      if (ENVIRONMENT.SEND_EMAILS === "Y") {
        await handlers.forgotPasswordMailHandler({
          to: email,
          subject: "Verify your account",
          payload: {
            code: token,
            timestamp: valid_till,
            link: `${ENVIRONMENT.CLIENT_URL}/verification?email=${email}&token=${token}`,
          },
        });
      }
      if (data === 1) {
        trx.commit();
        return res.status(RESPONSE_STATUS.OK_200).send({
          message:
            "OTP has been sent to your email. Please verify before it expires",
          status: CONSTANTS.STATUS.SUCCESS,
        });
      } else {
        trx.rollback();
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "Something went wrong",
          status: CONSTANTS.STATUS.FAILURE,
        });
      }
    } catch (error) {
      logger.error(
        `UserController.forgotPassword: Error occurred : ${inspect(error)}`,
      );
      trx.rollback();
      throw error;
    }
  }
}

export default new UserController();
