const express = require("express");
const PORT = process.env.PORT || 5000;

express()
  .get("/", (req, res) => res.send("Апи работает корректно"))
  .get("/token", (req, res) => {
    const code = req.query.code;
    res.send(`Ты четко отработал, code=${code}`);
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
