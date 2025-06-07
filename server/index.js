import express from "express";
import { coorelation, logger, ENVIRONMENT } from "@ecom/utils";
const app = express();

app.use(express.json());
app.use(coorelation);

app.listen(ENVIRONMENT.PORT, () =>
  logger.info(
    `SERVER STARTED ON PORT ${
      ENVIRONMENT.PORT
    } AT ${new Date().toLocaleString()}`
  )
);
