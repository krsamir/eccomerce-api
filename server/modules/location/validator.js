import { Joi, Segments } from "celebrate";

class SchemaValidator {
  createLocation() {
    return {
      [Segments.BODY]: Joi.object({
        name: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        country: Joi.string().required(),
      }),
    };
  }
}

export default new SchemaValidator();
