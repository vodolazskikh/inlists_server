const mockLists = require("../mocks/lists");

module.exports = function (app, client) {
  const bodyParser = require("body-parser");
  // for parsing application/json
  app.use(bodyParser.json());

  app
    // Получение списка по id
    .get("/listById", (req, res) => {
      const { id } = req.query;
      const ObjectID = require("mongodb").ObjectID;
      const _id = new ObjectID(id);

      client.connect((err) => {
        const collection = client.db("inlists").collection("lists");

        collection.findOne({ _id }, function (err, result) {
          if (err) {
            res.json({ error: "An error has occurred" });
          } else {
            res.json(result);
          }
        });
      });
    })
    // Получение списков для конкретного города
    .get("/listByCity", (req, res) => {
      client.connect((err) => {
        const collection = client.db("inlists").collection("lists");
        const finded = collection.find({ city: "Новосибирск" });

        finded.toArray(function (err, results) {
          if (err) {
            res.json({ error: "An error has occurred" });
          } else {
            res.json(results);
          }
        });
      });
    })
    // Добавление нового списка
    .post("/list", (req, res) => {
      client.connect((err) => {
        const collection = client.db("inlists").collection("lists");
        const newList = req.body;
        const userId = String(req.body.authorId);

        collection.insertOne(newList, (err, result) => {
          if (err) {
            res.json({ error: "An error has occurred" });
          } else {
            console.log(typeof userId);
            // Добавим новый список и к юзеру
            client
              .db("inlists")
              .collection("users")
              .findOneAndUpdate(
                { userId },
                { $push: { lists: newList } },
                (err, result) => {
                  console.log(result);
                }
              );

            res.json(result.ops[0]);
          }
        });
      });
    });
};
