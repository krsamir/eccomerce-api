import express from "express";
import Controller from "./controller.js";
import validator from "./validator.js";
import { celebrate } from "celebrate";

export default express
  .Router({ mergeParams: true })
  .post(
    "/forgot-password",
    celebrate(validator.forgotPassword()),
    Controller.forgotPassword.bind(Controller),
  )
  .post(
    "/verification",
    celebrate(validator.verification()),
    Controller.verification.bind(Controller),
  )
  .post(
    "/set-password",
    celebrate(validator.setPassword()),
    Controller.setPassword.bind(Controller),
  )
  .post(
    "/login",
    celebrate(validator.authenticate()),
    Controller.authenticate.bind(Controller),
  );
