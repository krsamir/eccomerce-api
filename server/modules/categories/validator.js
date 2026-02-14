import { Joi, Segments } from "celebrate";

class SchemaValidator {
  createCategory() {
    return {
      [Segments.BODY]: Joi.object({
        name: Joi.string().required(),
        parentId: Joi.number().optional().allow(null),
        rank: Joi.number().optional(),
        isActive: Joi.boolean().optional(),
        isFavourite: Joi.boolean().optional(),
      }),
    };
  }
  getCategoryById() {
    return {
      [Segments.PARAMS]: Joi.object({
        id: Joi.number().required(),
      }),
    };
  }

  updateCategory() {
    return {
      [Segments.BODY]: Joi.object({
        name: Joi.string().optional(),
        parentId: Joi.number().optional().allow(null),
        rank: Joi.number().optional(),
        isActive: Joi.boolean().optional(),
        isFavourite: Joi.boolean().optional(),
      }),
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required(),
      }),
    };
  }
  uploadMedia() {
    return {
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required(),
      }),
    };
  }
  deleteMedia() {
    return {
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required(),
      }),
    };
  }
}

export default new SchemaValidator();
