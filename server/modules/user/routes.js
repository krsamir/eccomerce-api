import express from "express";
import Controller from "./controller.js";
import { celebrate } from "celebrate";
import validator from "./validator.js";
import { interceptPayloadRequest, isAuthenticated } from "@ecom/utils";

export default express
  .Router({ mergeParams: true })
  .get("/me", isAuthenticated, Controller.getLoggedInUser.bind(Controller))
  .post(
    "/create",
    celebrate(validator.registerUser()),
    interceptPayloadRequest,
    Controller.registerUser.bind(Controller),
  )
  .post(
    "/confirm",
    celebrate(validator.confirmAccount()),
    interceptPayloadRequest,
    Controller.confirmToken.bind(Controller),
  )
  .post(
    "/set-password",
    celebrate(validator.setPassword()),
    interceptPayloadRequest,
    Controller.setPassword.bind(Controller),
  )
  .post(
    "/login",
    celebrate(validator.login()),
    interceptPayloadRequest,
    Controller.login.bind(Controller),
  )
  .post(
    "/reset",
    celebrate(validator.forgotPassword()),
    interceptPayloadRequest,
    Controller.forgotPassword.bind(Controller),
  );
