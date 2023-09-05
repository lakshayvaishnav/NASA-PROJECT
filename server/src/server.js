const http = require("http");
const app = require("./app");
const { mongoConnect } = require("./services/mongo");

const { loadPlanets } = require("./model/planets.model.js");
const { loadLaunchData } = require("./model/launches.model");
require('dotenv').config()

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect(); //you need to set these parameters in order to use latest mongo features...
  await loadPlanets();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}

startServer();
