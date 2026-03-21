
export const deepMerge = (target: Object, source: Object) => {
  if (!target || !source)
    return target ?? source ?? {};
  const result = { ...target };
  for (const [key, value] of Object.entries(source)) {
    const targetValue = target[key];
    if (targetValue instanceof Date || typeof targetValue === 'function') {
      result[key] = targetValue;
    }
    else if (value instanceof Date || typeof value === 'function') {
      result[key] = value;
    }
    else if (isObject(targetValue) && isObject(value)) {
      result[key] = deepMerge(targetValue, value);
    }
    else if (isArray(targetValue) && isArray(value)) {
      result[key] = value;
    }
    else {
      result[key] = value !== undefined ? value : targetValue;
    }
  }
  return result;
};
const isObject = (obj: Object) => obj !== null && typeof obj === 'object' && !Array.isArray(obj);
const isArray = (obj: Object) => Array.isArray(obj);

export default deepMerge