import { Joi, Segments } from "celebrate";

class SchemaValidator {
  forgotPassword() {
    return {
      [Segments.BODY]: Joi.object({
        email: Joi.string().required(),
      }),
    };
  }
}

export default new SchemaValidator();
