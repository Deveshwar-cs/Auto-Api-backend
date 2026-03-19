const schemaGeneratorSwagger = (fields) => {
  const properties = {};
  const required = [];

  fields.forEach((field) => {
    let type = field.type;

    if (type === "String") type = "string";
    if (type === "Number") type = "number";
    if (type === "Boolean") type = "boolean";

    properties[field.name] = {type};

    if (field.required) {
      required.push(field.name);
    }
  });

  return {
    type: "object",
    required,
    properties,
  };
};

export default schemaGeneratorSwagger;
