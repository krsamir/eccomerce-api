import express from "express";
import Controller from "./controller.js";
import { celebrate } from "celebrate";
import validator from "./validator.js";
import { interceptPayloadRequest, isAuthenticated } from "@ecom/utils";

export default express
  .Router({ mergeParams: true })
  .use(isAuthenticated)
  .get("/", interceptPayloadRequest, Controller.getAll.bind(Controller));
