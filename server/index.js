import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";
import path from "path";
import { fileURLToPath } from "url";
import _ from "util";
import { errors } from "celebrate";
import {
  coorelation,
  logger as logs,
  ENVIRONMENT,
  interceptBody,
  RESPONSE_STATUS,
  interceptResponse,
} from "@ecom/utils";
import cors from "cors";
import { CONSTANTS } from "@ecom/utils";
import httpErrors from "http-errors";
import appRoutes from "./routes.js";

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

app.use(express.json());
app.use(coorelation);
app.use(cors("*"));
app.use(interceptBody);
app.use(interceptResponse);

app.use((req, res, next) => {
  const regex = /^\/api\/(master|product|location|entity)(?:\/.*)?$/;
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
      message: "This record already exists.",
      status: CONSTANTS.STATUS.FAILURE,
    });
  }
  logger.error(`GLOBAL ERROR HANDLER::\n ${_.inspect(err, { depth: 6 })}`);

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
  res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500).send(error);
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
