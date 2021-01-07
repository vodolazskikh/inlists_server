const express = require("express");
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const app = express();

app.use(cors());

app
  .get("/", (req, res) => res.send("Апи работает корректно жи есть"))
  .get("/token", (req, res) => {
    const code = req.query.code;
    res.send(`Ты четко отработал, code=${code}`);
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
