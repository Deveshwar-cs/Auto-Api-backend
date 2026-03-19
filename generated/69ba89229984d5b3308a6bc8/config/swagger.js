
        import swaggerJSDoc from "swagger-jsdoc";

        const options = {
        definition: {
            openapi: "3.0.0",
            info: {
            title: "Auto API Generator",
            version: "1.0.0",
            description: "API documentation for Auto API Generator project",
            },
            servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
                description: "Local server",
            },
            ],

            // 🔐 Add JWT Auth support (IMPORTANT)
            components: {
            securitySchemes: {
                bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                },
            },
            },

            // Apply auth globally (optional but useful)
            security: [
            {
                bearerAuth: [],
            },
            ],
        },

        // 👇 This tells Swagger where to find your route files
        apis: ["./routes/*.js"],
        };

        export const swaggerSpec = swaggerJSDoc(options);
        