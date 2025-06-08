import nodemailer from "nodemailer";
import { ENVIRONMENT } from "@ecom/utils";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: ENVIRONMENT.SENDER,
    pass: ENVIRONMENT.MAIL_PASSWORD,
  },
});

export default transporter;
