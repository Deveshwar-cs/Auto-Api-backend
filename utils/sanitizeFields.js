const ALLOWED_TYPES = [
  "String",
  "Number",
  "Boolean",
  "Date",
  "ObjectId",
  "Array",
  "Object",
];

const isValidEnumValue = (value, type) => {
  switch (type) {
    case "String":
      return typeof value === "string";
    case "Number":
      return typeof value === "number";
    case "Boolean":
      return typeof value === "boolean";
    case "Date":
      return value instanceof Date || !isNaN(Date.parse(value));
    default:
      return true;
  }
};

export const sanitizeFields = (fields) => {
  return fields.map((field) => {
    if (!field.name || typeof field.name !== "string") {
      throw new Error("Invalid field name");
    }

    if (!ALLOWED_TYPES.includes(field.type)) {
      throw new Error(`Invalid field type for ${field.name}`);
    }

    const cleanField = {
      name: field.name.trim(),
      type: field.type,
      required: Boolean(field.required),
    };

    if (field.type === "String" && Array.isArray(field.enum)) {
      cleanField.enum = field.enum;
    }

    if (field.type === "ObjectId") {
      if (!field.ref) {
        throw new Error(`ObjectId field '${field.name}' must have ref`);
      }
      cleanField.ref = field.ref;
    }

    if (field.type === "Array") {
      if (!field.itemsType || !ALLOWED_TYPES.includes(field.itemsType)) {
        throw new Error(
          `Array field '${field.name}' must have valid itemsType`,
        );
      }

      cleanField.itemsType = field.itemsType;

      if (field.itemsType === "ObjectId") {
        if (!field.ref) {
          throw new Error(`Array ObjectId field '${field.name}' must have ref`);
        }
        cleanField.ref = field.ref;
      }
    }

    if (field.default !== undefined) {
      cleanField.default = field.default;
    }

    return cleanField;
  });
};
