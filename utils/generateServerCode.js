export const generateServerCode = () => {
  return `
    import app from "./app.js";
    import connectDB from "./config/db.js";
    import {swaggerSpec} from "./config/swagger.js";
    import swaggerUi from "swagger-ui-express";

    const PORT = process.env.PORT || 5000;

    connectDB();
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    
    app.listen(PORT,()=>{
        console.log(\`Server running on port \${PORT}\`);
        });
    `;
};
