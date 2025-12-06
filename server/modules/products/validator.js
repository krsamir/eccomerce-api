import { Joi, Segments } from "celebrate";

class SchemaValidator {
  stockSchema = Joi.object({
    quantityAvailable: Joi.number().required(),
    reorderLevel: Joi.number().optional(),
    supplierName: Joi.string().optional(),
    source: Joi.string().optional(),
  });
  costSchema = Joi.object({
    minQty: Joi.number().optional(),
    maxQty: Joi.number().optional(),
    purchaseCost: Joi.number().required(),
    costForSell: Joi.number().required(),
    actualCost: Joi.number().optional(),
    currency: Joi.string().required(),
    validFrom: Joi.string().allow("").isoDate().optional(),
    validTo: Joi.string().allow("").isoDate().optional(),
  });
  createProduct() {
    return {
      [Segments.BODY]: Joi.object({
        barcode: Joi.string().optional(),
        description: Joi.string().allow("").optional(),
        hsnId: Joi.string().guid({ version: "uuidv4" }).optional(),
        isActive: Joi.boolean().optional(),
        isDeleted: Joi.boolean().optional(),
        name: Joi.string().required(),
        unit: Joi.number().optional(),
        unitType: Joi.string().guid({ version: "uuidv4" }).optional(),
        hindiName: Joi.string().optional(),
        costs: Joi.array().items(this.costSchema).min(1).required(),
        stock: this.stockSchema.required(),
      }),
    };
  }

  getProductById() {
    return {
      [Segments.PARAMS]: Joi.object({
        id: Joi.string().required(),
      }),
    };
  }

  getAllProducts() {
    return {
      [Segments.QUERY]: Joi.object({
        page: Joi.number().optional().min(1).default(1),
      }),
      [Segments.BODY]: Joi.object({
        filter: Joi.any().optional(),
      }),
    };
  }
}

export default new SchemaValidator();
