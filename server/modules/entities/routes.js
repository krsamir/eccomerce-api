import express from "express";
import Controller from "./controller.js";
import validator from "./validator.js";
import { celebrate } from "celebrate";
import { CAPABILITY, isAuthenticated } from "@ecom/utils";
import { ROLES_NAME } from "@ecom/utils/Constants.js";

export default express
  .Router({ mergeParams: true })
  .use(isAuthenticated)
  .post(
    "/",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    celebrate(validator.createEntity()),
    Controller.createEntity.bind(Controller),
  )
  .get("/", Controller.getAllEntitiesList.bind(Controller))
  .patch(
    "/:id",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    celebrate(validator.updateEntity()),
    Controller.updateEntity.bind(Controller),
  )
  .delete(
    "/:id",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    celebrate(validator.deleteEntity()),
    Controller.deleteEntity.bind(Controller),
  )
  .get(
    "/:id",
    celebrate(validator.getEntityByID()),
    Controller.getEntityByID.bind(Controller),
  )
  .get(
    "/location/:id",
    celebrate(validator.getEntityByID()),
    Controller.getEntityByLocationId.bind(Controller),
  );
