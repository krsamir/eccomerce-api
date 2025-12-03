import Base_Stock from "./base/base_stock.js";

class Stock extends Base_Stock {
  constructor({
    id = null,
    quantity_available = 0,
    reorder_level = 0,
    supplier_name = "",
    source = "",
    product_id = null,
    created_by = null,
  }) {
    super({
      id,
      quantity_available,
      reorder_level,
      supplier_name,
      source,
      product_id,
      created_by,
    });
  }
}

export default Stock;
