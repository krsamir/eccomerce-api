import knex from "./knexClient.js";
import {
  MasterService,
  LocationService,
  EntitiesService,
} from "./services/index.js";

export default knex;

export { knex, MasterService, LocationService, EntitiesService };
