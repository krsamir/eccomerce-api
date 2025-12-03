import Base_Cost from "./base/base_cost.js";

class Cost extends Base_Cost {
  constructor(
    id = null,
    min_qty = 0,
    max_qty = 0,
    purchase_cost = 0,
    cost_for_sell = 0,
    actual_cost = 0,
    currency = "INR",
    valid_from = "",
    valid_to = "",
    version = 1,
    product_id = null,
    created_by = null,
  ) {
    super({
      id,
      min_qty,
      max_qty,
      purchase_cost,
      cost_for_sell,
      actual_cost,
      currency,
      valid_from,
      valid_to,
      version,
      product_id,
      created_by,
    });
  }
}

export default Cost;
