class Base_Cost {
  #id = null;
  #min_qty = 0;
  #max_qty = 0;
  #purchase_cost = 0;
  #cost_for_sell = 0;
  #actual_cost = 0;
  #currency = "INR";
  #valid_from = "";
  #valid_to = "";
  #version = 1;
  #product_id = null;
  #created_by = null;

  constructor({
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
  }) {
    this.#id = id;
    this.#min_qty = min_qty;
    this.#max_qty = max_qty;
    this.#purchase_cost = purchase_cost;
    this.#cost_for_sell = cost_for_sell;
    this.#actual_cost = actual_cost;
    this.#currency = currency;
    this.#valid_from = valid_from;
    this.#valid_to = valid_to;
    this.#version = version;
    this.#product_id = product_id;
    this.#created_by = created_by;
  }

  create({
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
  }) {
    return new Base_Cost({
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

  get() {
    return {
      id: this.#id,
      min_qty: this.#min_qty,
      max_qty: this.#max_qty,
      purchase_cost: this.#purchase_cost,
      cost_for_sell: this.#cost_for_sell,
      actual_cost: this.#actual_cost,
      currency: this.#currency,
      valid_from: this.#valid_from,
      valid_to: this.#valid_to,
      version: this.#version,
      created_by: this.#created_by,
      product_id: this.#product_id,
    };
  }
}

export default Base_Cost;
