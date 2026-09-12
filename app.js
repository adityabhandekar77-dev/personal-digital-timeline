const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapiSpecification = require("./docs/openapi");

const timelineRoutes = require("./routes/timelineRoutes");
const authRoutes = require("./routes/authRoutes");
const tagRoutes = require("./routes/tagRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use("/api/timeline", timelineRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tags", tagRoutes);

app.get("/", (req, res) => {
    res.send("Personal Digital Timeline API");
});

app.use(errorHandler);

module.exports = app;