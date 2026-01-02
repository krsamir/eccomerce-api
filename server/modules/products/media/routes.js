import express from "express";
import Controller from "./controller.js";
import { interceptPayloadRequest, isAuthenticated } from "@ecom/utils";
import validator from "./validator.js";
import { celebrate } from "celebrate";

export default express
  .Router({ mergeParams: true })
  .use(isAuthenticated)
  .post("/", Controller.postMedia.bind(Controller))
  .patch(
    "/order",
    celebrate(validator.orderProducts()),
    interceptPayloadRequest,
    Controller.updateSequenceofImages.bind(Controller),
  )
  .get(
    "/list/:productId",
    celebrate(validator.getListByProductId()),
    Controller.getListByProductId.bind(Controller),
  )
  .delete("/:id", Controller.deleteMedia.bind(Controller));
