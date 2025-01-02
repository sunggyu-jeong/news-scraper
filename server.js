const express = require("express");
const apiRouter = require("./src/renderer/router/apiRoutes");

const app = express();
const port = 3001;

app.use(express.json());

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
