class DataSourceUtilities {
  rawInsertQuery({ tableName = "", payload = "", trx = null, knex = null }) {
    if (tableName.length === 0) throw Error("Provide table name");
    if (trx === null && knex === null)
      throw Error("Provide either knex instance or transaction instance.");

    const obj = Object.entries(payload);

    const placeholders = obj.reduce((acc, obj) => {
      return acc + obj[0] + ",";
    }, "");
    const placeholderSymbol = obj.reduce((acc) => {
      return acc + "?,";
    }, "");
    const values = obj.map((val) => val[1]);
    console.log("🚀 ~ DataSourceUtilities ~ rawInsertQuery ~ values:", values);

    if (trx) {
      return trx.raw(
        `INSERT INTO ${tableName} (${placeholders.slice(0, -1)}) VALUES (${placeholderSymbol.slice(0, -1)})`,
        values,
      );
    } else {
      return knex.raw(
        `INSERT INTO ${tableName} (${placeholders.slice(0, -1)}) VALUES (${placeholderSymbol.slice(0, -1)})`,
        values,
      );
    }
  }
}

export default new DataSourceUtilities();
