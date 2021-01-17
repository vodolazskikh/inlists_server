const vkAuth = require("../config");
const fetch = require("node-fetch");
const cors = require("cors");

module.exports = function (app, client) {
  const bodyParser = require("body-parser");
  // for parsing application/json
  app.use(bodyParser.json());

  app.use(cors());

  app
    // Инфа о юзере
    .get("/userInfo", (req, res) => {
      const { userId, token } = req.query;

      fetch(
        `${vkAuth.methodsApiUrl}users.get?user_ids=${userId}&fields=photo_100&access_token=${token}&v=5.126`
      )
        .then((data) => data.json())
        .then((json) => res.json(json.response[0]));
    })
    // Получение списков для конкретного юзера
    .get("/userLists", (req, res) => {
      client.connect((err) => {
        const { userId } = req.query;
        const collection = client.db("inlists").collection("users");

        collection.findOne({ userId }, function (err, result) {
          if (err) {
            res.json({ error: "An error has occurred" });
          } else {
            if (!!result && "lists" in result) {
              res.json(result.lists);
            } else {
              res.json([]);
            }
          }
        });
      });
    });
};
