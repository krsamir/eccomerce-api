const CONSTANTS = Object.freeze({
  CREATE_TIMESTAMP: "YYYY-MM-DD HH:mm:ss",
  AUTHORIZATION: "Authorization",
  HEADERS: {
    COORELATION_ID: "x-correlation-id",
  },
  ENVIRONMENT: {
    DEVELOPMENT: "development",
    PRODUCTION: "production",
  },
  STATUS: {
    SUCCESS: 1,
    FAILURE: 0,
  },

  ERROR_MESSAGE: {
    SERVER_ERROR: "Caught into some issue",
    INVALID_DATA: "Invalid data provided",
    DUPLICATE_DATA: "Duplicate Data",
  },
  ACTION: {
    CREATE: "CREATE",
    DELETE: "DELETE",
    DELETE_ALL: "DELETE_ALL",
  },
});

const RESPONSE_STATUS = Object.freeze({
  OK_200: 200,
  CREATED_201: 201,
  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  FORBIDDEN_403: 403,
  NOT_FOUND_404: 404,
  INTERNAL_SERVER_ERROR_500: 500,
});
const errorHandler = (error) => {
  switch (error?.name) {
    case "SequelizeForeignKeyConstraintError":
      return {
        code: RESPONSE_STATUS.OK_200,
        message: CONSTANTS.ERROR_MESSAGE.INVALID_DATA,
      };
    case "SequelizeUniqueConstraintError":
      return {
        code: RESPONSE_STATUS.OK_200,
        message: CONSTANTS.ERROR_MESSAGE.DUPLICATE_DATA,
      };
    default:
      console.log(error);
      return {
        code: RESPONSE_STATUS.INTERNAL_SERVER_ERROR_500,
        message: CONSTANTS.ERROR_MESSAGE.SERVER_ERROR,
      };
  }
};
export { CONSTANTS, RESPONSE_STATUS, errorHandler };
