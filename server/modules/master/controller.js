import {
  checkIsAuthenticatedHandler,
  CONSTANTS,
  ENVIRONMENT,
  logger as logs,
  RESPONSE_STATUS,
  TRANSFORMERS,
  transformText,
} from "@ecom/utils";
import { MasterService } from "@ecom/datasource";
import { inspect } from "util";
import { handlers } from "@ecom/mail";
import knex from "@ecom/datasource";
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

class MasterController {
  async forgotPassword(req, res) {
    const { email = "" } = req.body;
    const trx = await knex.transaction();
    try {
      logger.info(`MasterController.forgotPassword called :`);
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
        is_deleted: false,
      };
      const data = await MasterService.setTokenForEmailAndValidity({
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
        `MasterController.forgotPassword: Error occurred : ${inspect(error)}`,
      );
      trx.rollback();
      throw error;
    }
  }

  async verification(req, res) {
    const { email = "", token } = req.body;
    try {
      if (!email || !token) {
        return res.status(RESPONSE_STATUS.BAD_REQUEST_400).send({
          message: "Invalid Payload.",
          status: CONSTANTS.STATUS.FAILURE,
        });
      }
      const data = await MasterService.verifyEmailAndToken({ email, token });
      if (data === 1) {
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "verified Successfully",
          status: CONSTANTS.STATUS.SUCCESS,
        });
      } else {
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "Token expired/Something went wrong",
          status: CONSTANTS.STATUS.FAILURE,
        });
      }
    } catch (error) {
      logger.error(
        `MasterController.verification: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }
  /**
   * Check is already logged In email & password is sufficient for reset password.
   * If unauthenticated user changing password check for token & valid till fields
   */
  async setPassword(req, res) {
    const { email, password } = req.body;
    try {
      logger.info(`MasterController.setPassword called :`);
      var salt = genSaltSync(CONSTANTS.AUTHENTICATION.BCRYPT_SALT);
      var hashedPassword = hashSync(password, salt);
      if (checkIsAuthenticatedHandler(req)) {
        const data = await MasterService.setPasswordWithLogin({
          email,
          password: hashedPassword,
        });

        if (data === 1) {
          return res.status(RESPONSE_STATUS.OK_200).send({
            message: "Password set Successfully.",
            status: CONSTANTS.STATUS.SUCCESS,
          });
        } else {
          return res.status(RESPONSE_STATUS.OK_200).send({
            message: "something went wrong. Try again.",
            status: CONSTANTS.STATUS.FAILURE,
          });
        }
      } else {
        const data = await MasterService.setPasswordWithoutLogin({
          email,
          password: hashedPassword,
        });

        if (data === 1) {
          return res.status(RESPONSE_STATUS.OK_200).send({
            message: "Password set Successfully.",
            status: CONSTANTS.STATUS.SUCCESS,
          });
        } else {
          return res.status(RESPONSE_STATUS.OK_200).send({
            message:
              "Token expired/password was not set withing stipulated time/something went wrong. Try again.",
            status: CONSTANTS.STATUS.FAILURE,
          });
        }
      }
    } catch (error) {
      logger.error(
        `MasterController.setPassword: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async authenticate(req, res) {
    const { email, password, userName: user_name } = req.body;
    try {
      logger.info(`MasterController.authenticate called :`);
      const data = await MasterService.getUserByEmail({ email, user_name });
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
          await MasterService.setLoginDetails({
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
              role_id: data?.role_id,
              role: data?.role_name,
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
            role: data?.role_id,
          });
        }
        await MasterService.setLoginDetails({
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
      logger.error(
        `MasterController.authenticate: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async getAllUsersList(req, res) {
    const { role } = req;
    try {
      logger.info(`MasterController.getAllUsersList called :`);
      const data = await MasterService.getAllUsersList({
        role,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data: data.map(TRANSFORMERS.masterRoleTransformers),
        // keepSnakeCase: true,
      });
    } catch (error) {
      logger.error(
        `MasterController.getAllUsersList: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async getUserById(req, res) {
    const { role } = req;
    try {
      logger.info(`MasterController.getUserById called :`);
      const data = await MasterService.getUserById({
        role: role,
        id: req?.params?.id,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data: data ? TRANSFORMERS.masterRoleTransformers(data) : {},
      });
    } catch (error) {
      logger.error(
        `MasterController.getUserById: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }
  async getAllRoles(req, res) {
    const { role } = req;
    try {
      logger.info(`MasterController.getAllRoles called :`);
      const data = await MasterService.getAllRoles({
        role,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data: data.map((val) => ({ ...val, name: transformText(val.name) })),
      });
    } catch (error) {
      logger.error(
        `MasterController.getAllRoles: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async checkIfvalueExists(req, res) {
    const { type, value } = req.body;
    try {
      logger.info(`MasterController.checkIfvalueExists called :`);
      const data = await MasterService.checkIfvalueExists({ type, value });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "",
        status: CONSTANTS.STATUS.SUCCESS,
        data: { isExisting: data?.length > 0 },
      });
    } catch (error) {
      logger.error(
        `MasterController.checkIfvalueExists: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async createMasterUser(req, res) {
    const { ...userDetail } = req.body;
    try {
      logger.info(`MasterController.createMasterUser called :`);
      const id = crypto.randomUUID();
      await MasterService.createMasterUser({
        ...userDetail,
        id,
        created_by: req?.id,
      });
      return res.status(RESPONSE_STATUS.OK_200).send({
        message: "User Created",
        status: CONSTANTS.STATUS.SUCCESS,
        data: { id },
      });
    } catch (error) {
      logger.error(
        `MasterController.createMasterUser: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }

  async updateMasterUser(req, res) {
    const { ...userDetail } = req.body;
    try {
      logger.info(`MasterController.updateMasterUser called :`);
      const data = await MasterService.updateMasterUser({
        ...userDetail,
        role_id: userDetail.roles,
      });

      return res.status(RESPONSE_STATUS.OK_200).send({
        message: data === 1 ? "User Updated" : "Unable to update user",
        status: CONSTANTS.STATUS.SUCCESS,
      });
    } catch (error) {
      logger.error(
        `MasterController.updateMasterUser: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new MasterController();
