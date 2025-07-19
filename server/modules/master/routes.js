import express from "express";
import Controller from "./controller.js";
import validator from "./validator.js";
import { celebrate } from "celebrate";
import { CAPABILITY, isAuthenticated } from "@ecom/utils";
import { ROLES_NAME } from "@ecom/utils/Constants.js";

export default express
  .Router({ mergeParams: true })
  .get(
    "/",
    isAuthenticated,
    CAPABILITY([ROLES_NAME.SUPER_ADMIN, ROLES_NAME.ADMIN]),
    Controller.getAllUsersList.bind(Controller),
  )
  .get(
    "/user-id/:id",
    isAuthenticated,
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    celebrate(validator.getUserByID()),
    Controller.getUserById.bind(Controller),
  )
  .get(
    "/roles",
    isAuthenticated,
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    Controller.getAllRoles.bind(Controller),
  )
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
