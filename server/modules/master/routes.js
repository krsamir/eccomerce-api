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
  );
