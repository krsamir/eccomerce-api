import { CONSTANTS } from "./Constants.js";
import correlationId from "correlation-id";
import asyncLocalStorage from "./context.js";

const coorelation = async (req, res, next) => {
  const correlator = () => {
    const corId = correlationId.getId();
    asyncLocalStorage.run(
      {
        correlationId: corId,
        path: req?.path,
        method: req?.method,
      },
      () => {
        req.headers[CONSTANTS.HEADERS.COORELATION_ID] = corId;
        res.set(CONSTANTS.HEADERS.COORELATION_ID, corId);
        next();
      },
    );
  };
  const id = req?.get(CONSTANTS.HEADERS.COORELATION_ID);
  if (id) {
    correlationId.withId(id, correlator);
  } else {
    correlationId.withId(correlator);
  }
};

export default coorelation;
