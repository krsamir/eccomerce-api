export const transformText = (str) => (str ? str?.replace("_", " ") : "");

export const transformStringToSnakeCase = (str) =>
  str ? str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`) : "";

// Convert camelCase to snake_case
export const toSnakeCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  if (obj instanceof Date) {
    return obj;
  }
  if (typeof obj === "string") {
    return obj.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      acc[snakeKey] = toSnakeCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

// Convert snake_case to camelCase
export const toCamelCase = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  if (obj instanceof Date) {
    return obj;
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

/**
 * keepSnakeCase: true,
 * keep keepSnakeCase: true if you don't want to run function on the response
 */
export const interceptResponse = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    const camelCaseData = toCamelCase(data);
    if (!camelCaseData.keepSnakeCase) {
      delete camelCaseData.keepSnakeCase;
      return originalJson.call(this, camelCaseData);
    } else {
      delete camelCaseData.keepSnakeCase;
      return originalJson.call(this, data);
    }
  };
  next();
};

export const interceptPayloadRequest = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = toSnakeCase(req.body);
  }
  next();
};
