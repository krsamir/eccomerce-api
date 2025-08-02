import { Joi, Segments } from "celebrate";

class SchemaValidator {
  forgotPassword() {
    return {
      [Segments.BODY]: Joi.object({
        email: Joi.string().required(),
      }),
    };
  }
  verification() {
    return {
      [Segments.BODY]: Joi.object({
        email: Joi.string().required(),
        token: Joi.string().required(),
      }),
    };
  }
  setPassword() {
    return {
      [Segments.BODY]: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    };
  }
  authenticate() {
    return {
      [Segments.BODY]: Joi.object({
        email: Joi.string().optional().allow(null).allow(""),
        userName: Joi.string().optional().allow(null).allow(""),
        password: Joi.string().required(),
      }),
    };
  }
  getUserByID() {
    return {
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required(),
      }),
    };
  }
  checkIfExists() {
    return {
      [Segments.BODY]: Joi.object({
        type: Joi.string().required().allow("email").allow("userName"),
        value: Joi.string().required().disallow(""),
      }),
    };
  }

  createMasterUser() {
    return {
      [Segments.BODY]: Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        mobile: Joi.string().optional().allow("").allow(null),
        roles: Joi.string().optional(),
        isActive: Joi.number().required(),
        isDeleted: Joi.number().required(),
        entityId: Joi.string().required(),
      }),
    };
  }

  updateMasterUser() {
    return {
      [Segments.BODY]: Joi.object({
        id: Joi.string().required(),
        userName: Joi.string().optional().allow("").allow(null),
        email: Joi.string().optional().allow("").allow(null),
        firstName: Joi.string().optional().allow("").allow(null),
        lastName: Joi.string().optional().allow("").allow(null),
        mobile: Joi.string().optional().allow("").allow(null),
        roles: Joi.string().optional().allow("").allow(null),
        isActive: Joi.number().optional().allow(null),
        isDeleted: Joi.number().optional().allow(null),
        entityId: Joi.string().optional(),
      }),
    };
  }
}

export default new SchemaValidator();
