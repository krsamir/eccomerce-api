const TRANSFORMERS = {};

TRANSFORMERS.entityLocationTransformers = (result) => {
  if (result) {
    const { location_id, location_name, city, state, country, ...entityData } =
      result;
    return {
      ...entityData,
      location: {
        id: location_id,
        name: location_name,
        city,
        state,
        country,
      },
    };
  }
  throw Error("data not found");
};

TRANSFORMERS.masterRoleTransformers = (result) => {
  if (result) {
    const { role_id, role_name, password, ...entityData } = result;
    return {
      ...entityData,
      password: undefined,
      role: {
        id: role_id,
        name: role_name,
      },
    };
  }
  throw Error("data not found");
};

export default TRANSFORMERS;
