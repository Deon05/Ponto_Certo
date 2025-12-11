export function createError(name) {
  return (message) => {
    const err = new Error(message);
    err.name = name;
    return err;
  };
}
