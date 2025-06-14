import { Joi, Segments } from "celebrate";

class SchemaValidator {
  getById() {
    return {
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().uuid().required(),
      }),
    };
  }
}

export default new SchemaValidator();
