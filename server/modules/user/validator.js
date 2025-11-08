import { Joi, Segments } from "celebrate";

class SchemaValidator {
  registerUser() {
    return {
      [Segments.BODY]: Joi.object({
        email: Joi.string().required(),
        userName: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        mobile: Joi.string().required(),
      }),
    };
  }
  confirmAccount() {
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
        token: Joi.string().required(),
        password: Joi.string().required(),
      }),
    };
  }
  login() {
    return {
      [Segments.BODY]: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    };
  }
  forgotPassword() {
    return {
      [Segments.BODY]: Joi.object({
        email: Joi.string().required(),
      }),
    };
  }
}

export default new SchemaValidator();
