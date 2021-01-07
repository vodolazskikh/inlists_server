import express from "express";

const app = express();
const cors = require("cors");
app.use(cors());

const port = 3001;
app.get("/", (req, res) => {
  res.send("The sedulous hyena ate the antelope!");
});

app.get("/token", (req, res, next) => {
  const code = req.query.code;
  console.log(req.query);
  res.send(code);
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
