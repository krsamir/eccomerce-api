import { Joi, Segments } from "celebrate";

class SchemaValidator {
  publishProducts() {
    return {
      [Segments.BODY]: Joi.object({
        id: Joi.string().required(),
      }),
    };
  }
  getProductById() {
    return {
      [Segments.QUERY]: Joi.object({
        id: Joi.string().required(),
      }),
    };
  }
}

export default new SchemaValidator();
