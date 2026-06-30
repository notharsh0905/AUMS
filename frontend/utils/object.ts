export function isObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item);
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key as unknown as keyof typeof result];
  });
  return result as Omit<T, K>;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' || Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0;
  return false;
}

export function camelToSnake(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  }
  if (obj instanceof Date) return obj;
  if (typeof obj === 'object') {
    const newObj: Record<string, unknown> = {};
    const castedObj = obj as Record<string, unknown>;
    Object.keys(castedObj).forEach((key) => {
      const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      newObj[snakeKey] = camelToSnake(castedObj[key]);
    });
    return newObj;
  }
  return obj;
}

export function snakeToCamel(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }
  if (obj instanceof Date) return obj;
  if (typeof obj === 'object') {
    const newObj: Record<string, unknown> = {};
    const castedObj = obj as Record<string, unknown>;
    Object.keys(castedObj).forEach((key) => {
      const camelKey = key.replace(/(_\w)/g, (m) => m[1].toUpperCase());
      newObj[camelKey] = snakeToCamel(castedObj[key]);
    });
    return newObj;
  }
  return obj;
}
