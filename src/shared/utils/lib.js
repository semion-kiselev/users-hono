export const omit = (entity, attrs) =>
  Object.fromEntries(Object.entries(entity).filter(([key]) => !attrs.includes(key)));

const capitalize = (value) => `${value[0].toUpperCase()}${value.slice(1)}`;

const valueToCamelCase = (value) => {
  if (!value.includes("_")) return value;
  const valueArray = value.split("_");
  const capitalizedValueArray = valueArray.map((v, index) => {
    if (index === 0) return v;
    return capitalize(v);
  });
  return capitalizedValueArray.join("");
};

export const toCamelCase = (entity) =>
  Object.fromEntries(Object.entries(entity).map(([key, value]) => [valueToCamelCase(key), value]));
