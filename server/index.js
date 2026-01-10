import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";
import path from "path";
import { fileURLToPath } from "url";
import _ from "util";
import { errors } from "celebrate";
import multer from "multer";
import {
  coorelation,
  logger as logs,
  ENVIRONMENT,
  interceptBody,
  RESPONSE_STATUS,
  interceptResponse,
  CONSTANTS,
} from "@ecom/utils";
import cors from "cors";
import httpErrors from "http-errors";
import appRoutes from "./routes.js";
import { RedisService } from "@ecom/datasource";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let logger = logs(__filename);

const file = fs.readFileSync(
  path.join(__dirname, "../swagger/swagger.yml"),
  "utf8",
);
const swaggerDocument = YAML.parse(file);

const app = express();

if (ENVIRONMENT.NODE_ENV === "development") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

if (ENVIRONMENT.IS_REDIS_AVAILABLE === "Y") {
  console.info(
    "*********************** REDIS ACTIVATED ***********************",
  );
  RedisService.getInstance();
}

app.use(express.json());
app.use(coorelation);
app.use(cors("*"));
app.use(multer().single("media"));
app.use(interceptBody);
app.use(interceptResponse);

app.use((req, res, next) => {
  const regex =
    /^\/api\/(master|product|location|entity|product|workflow)(?:\/.*)?$/;
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

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(RESPONSE_STATUS.OK_200).send({
      message: "Duplicate entry.",
      status: CONSTANTS.STATUS.FAILURE,
    });
  }
  if (!err.isAxiosError) {
    logger.error(`GLOBAL ERROR HANDLER::\n ${_.inspect(err, { depth: 6 })}`);
  }

  const error =
    ENVIRONMENT.NODE_ENV === CONSTANTS.ENVIRONMENT.DEVELOPMENT
      ? {
          warning:
            ENVIRONMENT.NODE_ENV === "development"
              ? "⚠️ DO NOT RELY OR ADD ANY ERROR HANDLING ON error OBJECT AS IT WILL NOT BE AVAILABLE IN ANY OTHER ENVIRONMENT OTHER THAN DEVELOPMENT!. message FIELD CAN BE USED FOR ERROR HANDLING."
              : undefined,
          error: {
            err,
            name: err.name,
            message: err.message,
            stack: err.stack,
          },
          status: CONSTANTS.STATUS.FAILURE,
          message: "Internal server error.",
        }
      : { message: "Internal server error.", status: CONSTANTS.STATUS.FAILURE };

  const STATUS = err.isAxiosError
    ? err.status
    : err.name === "NotFoundError"
      ? RESPONSE_STATUS.NOT_FOUND_404
      : RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500;
  res.status(STATUS).send(error);
});

// app.use(cors({ exposedHeaders: [CONSTANTS.HEADERS.COORELATION_ID] }));
// app.use(express.static(path.join(__dirname, "../public")));
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public", "index.html"));
// });

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
