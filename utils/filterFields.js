export const filterFields = (fields) => {
  if (!Array.isArray(fields)) return [];

  const allowedTypes = [
    "String",
    "Number",
    "Boolean",
    "Date",
    "ObjectId",
    "Array",
  ];

  return fields
    .map((field) => {
      // ❌ skip invalid field
      if (!field.name || !field.type) return null;

      // ✅ clean field name (no spaces, camelCase)
      const cleanName = field.name
        .replace(/\s+/g, "")
        .replace(/^\w/, (c) => c.toLowerCase());

      // ❌ invalid type
      if (!allowedTypes.includes(field.type)) return null;

      const filteredField = {
        name: cleanName,
        type: field.type,
        required: Boolean(field.required),
      };

      // ✅ handle enum
      if (field.enum && Array.isArray(field.enum)) {
        filteredField.enum = field.enum;
      }

      // ✅ handle ObjectId ref
      if (field.type === "ObjectId" && field.ref) {
        filteredField.ref = field.ref;
      }

      // ✅ handle Array type
      if (field.type === "Array" && field.itemsType) {
        filteredField.itemsType = field.itemsType;
      }

      // ✅ default value
      if (field.default !== undefined) {
        filteredField.default = field.default;
      }

      return filteredField;
    })
    .filter(Boolean); // remove nulls
};
