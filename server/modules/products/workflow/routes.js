import express from "express";
import Controller from "./controller.js";
import { interceptPayloadRequest, isAuthenticated } from "@ecom/utils";
import { celebrate } from "celebrate";
import validator from "./validator.js";

export default express
  .Router({ mergeParams: true })
  .use(isAuthenticated)
  .get(
    "/status",
    celebrate(validator.getProductById()),
    interceptPayloadRequest,
    Controller.getProductStatus.bind(Controller),
  )
  .post(
    "/publish",
    celebrate(validator.publishProducts()),
    interceptPayloadRequest,
    Controller.addProductToPublishQueue.bind(Controller),
  );
