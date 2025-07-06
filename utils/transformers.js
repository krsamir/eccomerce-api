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

export default TRANSFORMERS;
