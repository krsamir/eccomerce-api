import express from "express";
import MasterRoutes from "./modules/master/routes.js";
import LocationRoutes from "./modules/location/routes.js";
import EntitiesRoutes from "./modules/entities/routes.js";

export default express
  .Router()
  .use("/master", MasterRoutes)
  .use("/location", LocationRoutes)
  .use("/entity", EntitiesRoutes);
