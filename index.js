const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const vkAuth = require("./config");
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
  // Получение токена ВК
  .get("/token", (req, res) => {
    const code = req.query.code;

    fetch(
      `${vkAuth.url}access_token?client_id=${vkAuth.client_id}&client_secret=${process.env.VK_SECRET}&redirect_uri=${vkAuth.redirect_uri}&code=${code}`
    )
      .then((data) => data.json())
      .then((json) =>
        res.json({ access_token: json.access_token, user_id: json.user_id })
      );
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`));
