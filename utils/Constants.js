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
  AUTHENTICATION: {
    TOKEN_VALIDITY_IN_MINS: 10,
    BCRYPT_SALT: 10,
    NO_OF_INVALID_LOGINS_COUNT: 10,
    PASSWORD_CHANGE_TOKEN: "PCW",
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

const ROLES = [
  {
    id: "91b5a4d7-4187-4864-88fa-a1f4207199df",
    name: "SUPER_ADMIN",
  },
  {
    id: "071e921d-d08f-4d7f-84a9-c00d4409d774",
    name: "ADMIN",
  },
  {
    id: "7feb7cb4-23d6-453b-b7b5-7a18c6f79b72",
    name: "MANAGER",
  },
  {
    id: "cf727bcc-4f2c-4661-ab58-a7b4b4f6e905",
    name: "DELIVERY_PARTNER",
  },
];

const ROLES_NAME = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  DELIVERY_PARTNER: "DELIVERY_PARTNER",
  USER: "USER",
};

export { CONSTANTS, RESPONSE_STATUS, ROLES_NAME, ROLES };
