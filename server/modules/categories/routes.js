import express from "express";
import Controller from "./controller.js";
import validator from "./validator.js";
import { celebrate } from "celebrate";
import {
  CAPABILITY,
  interceptPayloadRequest,
  isAuthenticated,
} from "@ecom/utils";
import { ROLES_NAME } from "@ecom/utils/Constants.js";

export default express
  .Router({ mergeParams: true })
  .use(isAuthenticated)
  .get("/", Controller.getAllCategoriesList.bind(Controller))
  .post(
    "/",
    celebrate(validator.createCategory()),
    interceptPayloadRequest,
    Controller.createCategory.bind(Controller),
  )
  .post(
    "/sync",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    Controller.syncCategories.bind(Controller),
  )
  .get(
    "/:id",
    celebrate(validator.createCategory()),
    Controller.getCategoryById.bind(Controller),
  )
  .patch(
    "/:id",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    celebrate(validator.updateCategory()),
    interceptPayloadRequest,
    Controller.updateCategory.bind(Controller),
  )
  .post(
    "/media/:id",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    celebrate(validator.uploadMedia()),
    interceptPayloadRequest,
    Controller.uploadMedia.bind(Controller),
  )
  .delete(
    "/media/:id",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN]),
    celebrate(validator.deleteMedia()),
    interceptPayloadRequest,
    Controller.deleteMedia.bind(Controller),
  );
