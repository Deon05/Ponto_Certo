export function toCamelcase(str) {
  return str.replace(/_(\w+)/g, (char) => char[1].toUpperCase());
}
export function toSnakecase(str) {
  return str.replace(/([A-Z])/g, (char) => "_" + char.toLowerCase());
}
export function toCamelcaseObject(obj) {
  const newObj = {};
  Object.keys(obj).forEach((key) => (newObj[toCamelcase(key)] = obj[key]));
  return newObj;
}
export function toSnakecaseObject(obj) {
  const newObj = {};
  Object.keys(obj).forEach((key) => (newObj[toSnakecase(key)] = obj[key]));
  return newObj;
}
