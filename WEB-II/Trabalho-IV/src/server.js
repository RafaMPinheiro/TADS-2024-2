import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trabalho IV",
      version: "0.0.1-SNAPSHOT",
    },
  },
  apis: ["./src/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3000");
});
