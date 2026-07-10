
export const deepMerge = (target: Record<string, any>, source: Record<string, any>): Record<string, any> => {
  if (!target || !source)
    return target ?? source ?? {};
  const result: Record<string, any> = { ...target };
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
const isObject = (obj: unknown) => obj !== null && typeof obj === 'object' && !Array.isArray(obj);
const isArray = (obj: unknown) => Array.isArray(obj);

export default deepMerge