import express from "express";
import Controller from "./controller.js";
import { celebrate } from "celebrate";
import validator from "./validator.js";
import {
  CAPABILITY,
  interceptPayloadRequest,
  isAuthenticated,
  ROLES_NAME,
} from "@ecom/utils";
import hsnRoutes from "./hsns/routes.js";
import unitRoutes from "./units/routes.js";
import templatesRoutes from "./templates/routes.js";

export default express
  .Router({ mergeParams: true })
  .use(isAuthenticated)
  .use("/hsn", hsnRoutes)
  .use("/units", unitRoutes)
  .use("/templates", templatesRoutes)
  .get(
    "/meta",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN, ROLES_NAME.ADMIN, ROLES_NAME.MANAGER]),
    interceptPayloadRequest,
    Controller.getAllProductMetaData.bind(Controller),
  )
  .post(
    "/all",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN, ROLES_NAME.ADMIN, ROLES_NAME.MANAGER]),
    celebrate(validator.getAllProducts()),
    Controller.getAllProducts.bind(Controller),
  )
  .post(
    "/",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN, ROLES_NAME.ADMIN, ROLES_NAME.MANAGER]),
    celebrate(validator.createProduct()),
    interceptPayloadRequest,
    Controller.createProduct.bind(Controller),
  )
  .get(
    "/stocks-metadata",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN, ROLES_NAME.ADMIN]),
    interceptPayloadRequest,
    Controller.getStocksMetadata.bind(Controller),
  )
  .get(
    "/:id",
    CAPABILITY([ROLES_NAME.SUPER_ADMIN, ROLES_NAME.ADMIN, ROLES_NAME.MANAGER]),
    celebrate(validator.getProductById()),
    interceptPayloadRequest,
    Controller.getProductById.bind(Controller),
  );
