export const cleanseObjectByRemovingFalseValues = (data) => {
  const validObj = [];
  Object.entries(data)?.forEach(
    ([key, value]) =>
      value !== undefined && value !== null && validObj.push([key, value]),
  );
  return Object.fromEntries(validObj);
};
