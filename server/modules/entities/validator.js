import { Joi, Segments } from "celebrate";

class SchemaValidator {
  createEntity() {
    return {
      [Segments.BODY]: Joi.object({
        name: Joi.string().required(),
        gst: Joi.string().optional(),
        address: Joi.string().required(),
        location_id: Joi.string().required(),
        proprietor_name: Joi.string().optional(),
        categories: Joi.any().optional(),
      }),
    };
  }
  updateEntity() {
    return {
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required(),
      }),
      [Segments.BODY]: Joi.object({
        name: Joi.string().optional().allow("").allow(null),
        gst: Joi.string().optional().allow("").allow(null),
        address: Joi.string().optional().allow("").allow(null),
        location_id: Joi.string().optional().allow("").allow(null),
        proprietor_name: Joi.string().optional().allow("").allow(null),
        categories: Joi.any().optional().allow("").allow(null),
        delete: Joi.boolean().optional().allow(false).disallow(true),
        is_active: Joi.boolean().optional(),
        max_admin: Joi.number().optional(),
        max_manager: Joi.number().optional(),
      }),
    };
  }
  deleteEntity() {
    return {
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required(),
      }),
    };
  }
  getEntityByID() {
    return {
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required(),
      }),
    };
  }
}

export default new SchemaValidator();
