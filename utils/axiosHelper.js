import axios from "axios";
import { RESPONSE_STATUS } from "./Constants.js";
import ENVIRONMENT from "./environment.js";
import { fileURLToPath } from "url";
import logs from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
let logger = logs(__filename);

const { MEDIA_SERVER_HOST, MEDIA_SERVICE_TOKEN } = ENVIRONMENT;

const axiosInstance = axios.create({
  baseURL: MEDIA_SERVER_HOST,
  timeout: 3000,
  headers: {
    Authorization: MEDIA_SERVICE_TOKEN,
  },
});

axiosInstance.interceptors.response.use(
  function (response) {
    const { status, data, statusText } = response;
    logger.info(
      `SUCCESS -> [STATUS] : [${status}], [statusText]: ${statusText}, [DATA] : ${JSON.stringify(
        data,
        null,
        2,
      )}`,
    );
    return response;
  },
  function (error) {
    logger.info(
      "<<<<<<<<<<<<<<<<<<<<<<<<<<<< MICROSERVICE ERROR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
    );
    error?.code === "ECONNREFUSED" &&
      logger.error(`MEDIA SERVICE DOWN - ${new Date().toLocaleString()}`);
    error?.code === "ECONNABORTED" &&
      logger.info(
        `MEDIA SERVICE (REQUEST TIMEDOUT) - ${new Date().toLocaleString()}`,
      );
    if (error.response) {
      const { data = {}, status } = error.response;
      //   logger.error(
      //     `ERROR -> [STATUS] : [${status}], [DATA] : ${JSON.stringify(
      //       data,
      //       null,
      //       2,
      //     )} [ERROR]: ${error.response.data}`,
      //   );
      //   return Promise.reject([
      //     parseInt(status / 100) === 4
      //       ? RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500
      //       : status,
      //     {
      //       isMicroserviceError: true,
      //       ...data,
      //       error,
      //     },
      //   ]);
      return Promise.reject({
        isAxiosError: true,
        status,
        payload: {
          isMicroserviceError: true,
          ...data,
          error,
        },
      });
    }
    // return Promise.reject([
    //   RESPONSE_STATUS.OK_200,
    //   {
    //     isMicroserviceError: true,
    //     error: error?.code === "ECONNREFUSED" ? {} : error,
    //     status: 0,
    //     message:
    //       error?.code === "ECONNABORTED"
    //         ? "service timeout"
    //         : "Media service down.",
    //   },
    // ]);
    return Promise.reject({
      isAxiosError: true,
      status: RESPONSE_STATUS.OK_200,
      payload: {
        isMicroserviceError: true,
        error: error?.code === "ECONNREFUSED" ? {} : error,
        status: 0,
        message:
          error?.code === "ECONNABORTED"
            ? "service timeout"
            : "Media service down.",
      },
    });
  },
);
export default axiosInstance;
