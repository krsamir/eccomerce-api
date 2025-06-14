import express from "express";
import MasterRoutes from "./modules/master/routes.js";

export default express.Router().use("/master", MasterRoutes);
