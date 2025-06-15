import { CONSTANTS, logger, RESPONSE_STATUS } from "@ecom/utils";
import { MasterService } from "@ecom/datasource";
import { inspect } from "util";

class MasterController {
  async forgotPassword(req, res) {
    const { email = "" } = req.body;
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

      const payload = {
        valid_till,
        token: crypto?.randomUUID()?.slice(0, 6),
        is_active: false,
        password: null,
      };

      const data = await MasterService.setTokenForEmailAndValidity({
        email,
        payload,
      });

      if (data === 1) {
        return res.status(RESPONSE_STATUS.OK_200).send({
          message: "Token sent to your email. Please verify before it expires",
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
        `MasterController.forgotPassword: Error occurred : ${inspect(error)}`,
      );
      throw error;
    }
  }
}

export default new MasterController();
