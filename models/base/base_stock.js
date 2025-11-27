class Base_Stock {
  #id = null;
  #quantity_available = 0;
  #reorder_level = 0;
  #supplier_name = "";
  #source = "";
  #product_id = null;
  #created_by = null;

  constructor({
    id = null,
    quantity_available = 0,
    reorder_level = 0,
    supplier_name = "",
    source = "",
    product_id = null,
    created_by = null,
  }) {
    this.#id = id;
    this.#quantity_available = quantity_available;
    this.#reorder_level = reorder_level;
    this.#supplier_name = supplier_name;
    this.#source = source;
    this.#product_id = product_id;
    this.#created_by = created_by;
  }

  create({
    id = null,
    quantity_available = 0,
    reorder_level = 0,
    supplier_name = "",
    source = "",
    product_id = null,
    created_by = null,
  }) {
    return new Base_Stock({
      id,
      quantity_available,
      reorder_level,
      supplier_name,
      source,
      product_id,
      created_by,
    });
  }

  get() {
    return {
      id: this.#id,
      quantity_available: this.#quantity_available,
      reorder_level: this.#reorder_level,
      supplier_name: this.#supplier_name,
      source: this.#source,
      product_id: this.#product_id,
      created_by: this.#created_by,
    };
  }
}

export default Base_Stock;
