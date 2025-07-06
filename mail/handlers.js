import { ENVIRONMENT, logger } from "@ecom/utils";
import transporter from "./transporter.js";
import { inspect } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const handlers = {};

const checkValidOptions = ({ to = "", subject = "" }) => {
  if (!to) {
    throw Error("to cannot be null/undefined");
  }
  if (!subject) {
    throw Error("subject cannot be null/undefined");
  }
  if (typeof subject === "string" && to?.length <= 0) {
    throw Error("subject cannot be empty string");
  }
  if (Array.isArray(to) && to?.length <= 0) {
    throw Error("to cannot be empty list");
  }
  if (typeof to === "string" && to?.length <= 0) {
    throw Error("to cannot be empty string");
  }
};
handlers.forgotPasswordMailHandler = ({
  to = "",
  subject = "",
  payload: { code, timestamp, link },
}) =>
  new Promise(async (resolve, reject) => {
    logger(__filename).info("handlers.forgrtPasswordMailHandler...");
    try {
      checkValidOptions({ to, subject });
      const info = await transporter.sendMail({
        to,
        from: ENVIRONMENT.SENDER,
        subject,
        html: `
           <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Reset Password</title>
              </head>
              <body>
                  <div style="line-height: 1.5rem;">
                      <div style="font-size: 18px; font-weight: 600;">Greetings!</div><br>
                      <div><span>Your secret code ${code}.</span>This code is valid till ${timestamp?.toLocaleString()}.</div>
                      <a href=${link}>${link}</a><br>
                      <div>Please verify before link/code expires.</div>
                      <div>Happy to see you!</div><br>
                      <div>Kind Regards</div>
                      <div>Product Team.</div>
                  </div>
              </body>
          </html>
          `,
      });
      logger(__filename).info(`Email sent! ${inspect(info)}`);
      resolve(info);
    } catch (error) {
      logger(__filename).error(`Email Failed ${inspect(error)}`);
      reject(error);
    }
  });

export default handlers;
