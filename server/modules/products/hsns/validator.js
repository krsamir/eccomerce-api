import { Joi, Segments } from "celebrate";

class SchemaValidator {
  getHsnByNameAndCode() {
    return {
      [Segments.QUERY]: Joi.object({
        name: Joi.string().required(),
      }),
    };
  }
}

export default new SchemaValidator();
