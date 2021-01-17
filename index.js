const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "";

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(DB_URL, { useNewUrlParser: true });

const app = express();

app.use(cors());

require("./routes/lists")(app, client);
require("./routes/user")(app, client);

app
  .get("/", (_req, res) => {
    res.send("Апи работает");
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`));
