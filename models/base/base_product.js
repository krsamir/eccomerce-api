class Base_Product {
  #id = null;
  #uuid = null;
  #name = "";
  #hindi_name = "";
  #description = "";
  #barcode = "";
  #unit = "";
  #hsn_id = null;
  #unit_type = null;
  #entity_id = null;
  #created_by = null;
  #updated_by = null;
  #is_active = false;
  #is_deleted = false;

  constructor({
    id = null,
    uuid = null,
    name = "",
    hindi_name = "",
    description = "",
    barcode = "",
    unit = "",
    hsn_id = null,
    unit_type = null,
    entity_id = null,
    created_by = null,
    updated_by = null,
    is_active = false,
    is_deleted = false,
  }) {
    this.#id = id;
    this.#uuid = uuid;
    this.#name = name;
    this.#hindi_name = hindi_name;
    this.#description = description;
    this.#barcode = barcode;
    this.#unit = unit;
    this.#hsn_id = hsn_id;
    this.#unit_type = unit_type;
    this.#entity_id = entity_id;
    this.#created_by = created_by;
    this.#updated_by = updated_by;
    this.#is_active = is_active;
    this.#is_deleted = is_deleted;
  }

  create({
    id = null,
    uuid = null,
    name = "",
    hindi_name = "",
    description = "",
    barcode = "",
    unit = "",
    hsn_id = null,
    unit_type = null,
    entity_id = null,
    created_by = null,
    updated_by = null,
    is_active = false,
    is_deleted = false,
  }) {
    return new Base_Product({
      id,
      uuid,
      name,
      hindi_name,
      description,
      barcode,
      unit,
      hsn_id,
      unit_type,
      entity_id,
      created_by,
      updated_by,
      is_active,
      is_deleted,
    });
  }

  get() {
    return {
      id: this.#id,
      uuid: this.#uuid,
      name: this.#name,
      hindi_name: this.#hindi_name,
      description: this.#description,
      barcode: this.#barcode,
      unit: this.#unit,
      hsn_id: this.#hsn_id,
      unit_type: this.#unit_type,
      entity_id: this.#entity_id,
      created_by: this.#created_by,
      updated_by: this.#updated_by,
      is_active: this.#is_active,
      is_deleted: this.#is_deleted,
    };
  }
}

export default Base_Product;
