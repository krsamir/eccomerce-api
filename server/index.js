import express from "express";
import { coorelation, logger, ENVIRONMENT } from "@ecom/utils";
import cors from "cors";
import { CONSTANTS } from "@ecom/utils";

const app = express();

app.use(express.json());
app.use(coorelation);
app.use(cors("*"));

app.use((req, res, next) => {
  const regex = /^\/api\/(user|product)(?:\/.*)?$/;
  if (regex.test(req.path)) {
    logger.info(CONSTANTS.ROUTE_LOGS);
  }
  next();
});
// app.use(cors({ exposedHeaders: [CONSTANTS.HEADERS.COORELATION_ID] }));

app.get("/api/user", (req, res) => {
  logger.info("APP");
  res.send("API Working!!");
});

app.listen(ENVIRONMENT.PORT, () =>
  logger.info(
    `SERVER STARTED ON PORT ${
      ENVIRONMENT.PORT
    } AT ${new Date().toLocaleString()}`,
  ),
);
