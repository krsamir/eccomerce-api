import express from "express";
import Controller from "./controller.js";
import validator from "./validator.js";
import { celebrate } from "celebrate";

export default express
  .Router({ mergeParams: true })
  .get("/", Controller.getAllLocations.bind(Controller))
  .post(
    "/",
    celebrate(validator.createLocation()),
    Controller.createLocation.bind(Controller),
  );
