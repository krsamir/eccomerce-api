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
  ROUTE_LOGS: "ROUTE_LOGS",
  TABLES: {
    ENTITY: "entity",
    LOCATION: "location",
    MASTER: "master",
    MASTER_ENTITY_MAPPER: "master_entity_mapper",
    ROLE: "role",
    USER: "user",
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

export { CONSTANTS, RESPONSE_STATUS };
