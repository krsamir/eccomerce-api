import { CONSTANTS, ENVIRONMENT, logger, RESPONSE_STATUS } from "@ecom/utils";
import { MasterService } from "@ecom/datasource";
import { inspect } from "util";
import { handlers } from "@ecom/mail";
import knex from "@ecom/datasource";

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
      const valid_till = new Date(now.getTime() + 10 * 60 * 1000);
      const token = crypto?.randomUUID()?.slice(0, 6);
      const payload = {
        valid_till,
        token,
        is_active: false,
        password: null,
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
          message: "Token sent to your email. Please verify before it expires",
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
          message: "Something went wrong",
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
}

export default new MasterController();
