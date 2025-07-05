import express from "express";
import Controller from "./controller.js";
import validator from "./validator.js";
import { celebrate } from "celebrate";
import { CAPABILITY, isAuthenticated } from "@ecom/utils";
import { ROLES_NAME } from "@ecom/utils/Constants.js";

export default express
  .Router({ mergeParams: true })
  .use(isAuthenticated)
  .get(
    "/",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    Controller.getAllLocations.bind(Controller),
  )
  .post(
    "/",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    celebrate(validator.createLocation()),
    Controller.createLocation.bind(Controller),
  )
  .patch(
    "/",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    celebrate(validator.updateLocation()),
    Controller.updateLocation.bind(Controller),
  )
  .delete(
    "/",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    celebrate(validator.deleteLocation()),
    Controller.deleteLocation.bind(Controller),
  );
