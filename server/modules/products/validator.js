import { Joi, Segments } from "celebrate";

class SchemaValidator {
  optionalStockSchema = {
    reorderLevel: Joi.number().optional(),
    supplierName: Joi.string().optional(),
    source: Joi.string().optional(),
  };

  createStockSchema = Joi.object({
    quantityAvailable: Joi.number().required(),
    ...this.optionalStockSchema,
  });

  updateStockSchema = Joi.object({
    quantityAvailable: Joi.number().optional(),
    ...this.optionalStockSchema,
  });

  optionalCostSchema = {
    minQty: Joi.number().optional(),
    maxQty: Joi.number().optional(),
    actualCost: Joi.number().optional(),
    validFrom: Joi.string().allow("").isoDate().optional(),
    validTo: Joi.string().allow("").isoDate().optional(),
  };

  createCostSchema = Joi.object({
    purchaseCost: Joi.number().required(),
    costForSell: Joi.number().required(),
    currency: Joi.string().required(),
    ...this.optionalCostSchema,
  });

  updateCostSchema = {
    purchaseCost: Joi.number().optional(),
    costForSell: Joi.number().optional(),
    currency: Joi.string().optional(),
    id: Joi.string().optional().allow(""),
    ...this.optionalCostSchema,
  };

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
        costs: Joi.array().items(this.createCostSchema).min(1).required(),
        stock: this.createStockSchema.required(),
      }),
    };
  }

  updateProduct() {
    return {
      [Segments.BODY]: Joi.object({
        barcode: Joi.string().optional(),
        id: Joi.string().required(),
        description: Joi.string().allow("").optional(),
        hsnId: Joi.string().guid({ version: "uuidv4" }).optional(),
        isActive: Joi.boolean().optional(),
        isDeleted: Joi.boolean().optional(),
        name: Joi.string().optional(),
        unit: Joi.number().optional(),
        unitType: Joi.string().guid({ version: "uuidv4" }).optional(),
        hindiName: Joi.string().optional(),
        costs: Joi.array().items(this.updateCostSchema).min(1).optional(),
        stock: this.updateStockSchema.optional(),
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
