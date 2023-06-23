import path from "path";
import swaggerJSDoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "REST API for Swagger Documentation",
      version: "1.0",
    },
    schemes: ["http"],
    servers: [{ url: "http://localhost:3001/api/" }],
  },
  apis: [path.join(__dirname, "../swagger/docs/*.ts")],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
