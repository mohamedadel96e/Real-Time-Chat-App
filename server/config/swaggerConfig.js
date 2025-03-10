import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const options = {
  definition: {
      openapi: "3.0.0",
      info: {
          title: "Real-Time Chat API",
          version: "1.0.0",
          description: "API documentation for the Real-Time Chat Application"
      },
      servers: [{ url: "http://localhost:5010" }]
  },
  apis: ["./routes/*.js"]  
};


const specs = swaggerJsDoc(options);
export { specs, swaggerUi };
