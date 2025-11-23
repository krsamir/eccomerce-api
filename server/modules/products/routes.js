import express from "express";
import Controller from "./controller.js";
import { celebrate } from "celebrate";
import validator from "./validator.js";
import { interceptPayloadRequest, isAuthenticated } from "@ecom/utils";
import hsnRoutes from "./hsns/routes.js";
import unitRoutes from "./units/routes.js";

export default express
  .Router({ mergeParams: true })
  .use(isAuthenticated)
  .use("/hsn", hsnRoutes)
  .use("/units", unitRoutes);
