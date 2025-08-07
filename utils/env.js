export function getOrThrow(key, callback) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable "${key}" is required but was not provided.`);
  }
  return callback ? callback(value) : value;
}
