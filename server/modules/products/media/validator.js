import { Joi, Segments } from "celebrate";

class SchemaValidator {
  getListByProductId() {
    return {
      [Segments.PARAMS]: Joi.object({
        productId: Joi.string().required(),
      }),
    };
  }
  orderProducts() {
    return {
      [Segments.BODY]: Joi.array().items(
        Joi.object({
          id: Joi.string().required(),
          sequence: Joi.number().required(),
        }),
      ),
      [Segments.PARAMS]: Joi.object({
        productId: Joi.string().required(),
      }),
    };
  }
}

export default new SchemaValidator();
