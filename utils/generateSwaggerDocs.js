import schemaGeneratorSwagger from "./schemaGeneratorSwagger.js";
import yaml from "js-yaml";

const formatSchemaForSwagger = (yamlStr, baseSpaces = 13) => {
  return yamlStr
    .trim()
    .split("\n")
    .map((line) => ` * ${" ".repeat(baseSpaces)}${line}`)
    .join("\n");
};

export const generateSwaggerDocs = (collectionName, fields) => {
  const schemaObj = schemaGeneratorSwagger(fields);

  const schemaYaml = yaml.dump(schemaObj, {
    indent: 2,
    noRefs: true,
  });

  const formattedSchema = formatSchemaForSwagger(schemaYaml);

  return `
/**
 * @swagger
 * /api/${collectionName}:
 *   post:
 *     summary: Create ${collectionName}
 *     tags: [${collectionName}]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
${formattedSchema}
 *     responses:
 *       201:
 *         description: ${collectionName} created successfully
 */

/**
 * @swagger
 * /api/${collectionName}:
 *   get:
 *     summary: Get all ${collectionName}
 *     tags: [${collectionName}]
 *     responses:
 *       200:
 *         description: List of ${collectionName}
 */

/**
 * @swagger
 * /api/${collectionName}/{id}:
 *   get:
 *     summary: Get ${collectionName} by ID
 *     tags: [${collectionName}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ${collectionName} ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ${collectionName} found
 */

/**
 * @swagger
 * /api/${collectionName}/{id}:
 *   put:
 *     summary: Update ${collectionName}
 *     tags: [${collectionName}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ${collectionName} ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
${formattedSchema}
 *     responses:
 *       200:
 *         description: ${collectionName} updated successfully
 */

/**
 * @swagger
 * /api/${collectionName}/{id}:
 *   delete:
 *     summary: Delete ${collectionName}
 *     tags: [${collectionName}]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ${collectionName} ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ${collectionName} deleted successfully
 */
`;
};
