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
}

export default new SchemaValidator();
