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
}

export default new SchemaValidator();
