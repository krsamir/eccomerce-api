import express from "express";
import Controller from "./controller.js";
import { isAuthenticated } from "@ecom/utils";

export default express
  .Router({ mergeParams: true })
  .use(isAuthenticated)
  .post("/", Controller.postMedia.bind(Controller))
  .get("/list/:productId", Controller.getListByProductId.bind(Controller));
