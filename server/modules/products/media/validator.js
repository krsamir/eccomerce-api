import { Joi, Segments } from "celebrate";

class SchemaValidator {
  getListByProductId() {
    return {
      [Segments.PARAMS]: Joi.object({
        productId: Joi.string().required(),
      }),
    };
  }
}

export default new SchemaValidator();
