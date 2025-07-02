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
  updateLocation() {
    return {
      [Segments.BODY]: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        country: Joi.string().optional(),
        delete: Joi.boolean().optional().allow(false).disallow(true),
      }),
    };
  }
  deleteLocation() {
    return {
      [Segments.QUERY]: Joi.object({
        id: Joi.string().required(),
      }),
    };
  }
}

export default new SchemaValidator();
