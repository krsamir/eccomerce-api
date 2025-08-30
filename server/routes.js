import express from "express";
import MasterRoutes from "./modules/master/routes.js";
import LocationRoutes from "./modules/location/routes.js";
import EntitiesRoutes from "./modules/entities/routes.js";
import UserRoutes from "./modules/user/routes.js";

export default express
  .Router()
  .use("/master", MasterRoutes)
  .use("/user", UserRoutes)
  .use("/location", LocationRoutes)
  .use("/entity", EntitiesRoutes);
