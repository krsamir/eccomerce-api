import Base_Product from "./base/base_product.js";

class Product extends Base_Product {
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
    super({
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
}

export default Product;
