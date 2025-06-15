import express from "express";
import _ from "util";
import { errors } from "celebrate";
import { coorelation, logger, ENVIRONMENT } from "@ecom/utils";
import cors from "cors";
import { CONSTANTS } from "@ecom/utils";
import httpErrors from "http-errors";
import appRoutes from "./routes.js";

const app = express();

app.use(express.json());
app.use(coorelation);
app.use(cors("*"));

app.use((req, res, next) => {
  const regex = /^\/api\/(master|product)(?:\/.*)?$/;
  if (regex.test(req.path)) {
    logger.info(CONSTANTS.ROUTE_LOGS);
  }
  next();
});

// routes here
app.use("/api", appRoutes);
app.use(errors());

app.use((req, res, next) => {
  next(httpErrors(404));
});

app.use((err, req, res) => {
  logger.error(`GLOBAL ERROR HANDLER::\n ${_.inspect(err, { depth: 6 })}`);

  const error =
    ENVIRONMENT.NODE_ENV === "development"
      ? { error: err }
      : { error: "Internal server error." };

  res.status(500).json(error);
});

// app.use(cors({ exposedHeaders: [CONSTANTS.HEADERS.COORELATION_ID] }));

if (ENVIRONMENT.NODE_ENV !== CONSTANTS.ENVIRONMENT.DEVELOPMENT) {
  app.listen(ENVIRONMENT.PORT, () =>
    logger.info(
      `SERVER STARTED ON PORT ${
        ENVIRONMENT.PORT
      } AT ${new Date().toLocaleString()}`,
    ),
  );
} else {
  app.listen(ENVIRONMENT.PORT, ENVIRONMENT.NODE_HOST_NAME, () =>
    logger.info(
      `SERVER STARTED ON PORT ${
        ENVIRONMENT.PORT
      } AT ${new Date().toLocaleString()}\nhttp://${ENVIRONMENT.NODE_HOST_NAME}:${ENVIRONMENT.PORT}`,
    ),
  );
}
