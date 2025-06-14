import express from "express";
import Controller from "./controller.js";

export default express.Router().get("/all", Controller.getAll.bind(Controller));
