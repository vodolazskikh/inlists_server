import { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import { ObjectID } from "mongodb";

export function listsRoute(app: Express, client: MongoClient) {
  // for parsing application/json
  app.use(bodyParser.json());

  app
    // Получение списка по id
    .get("/listById", (req, res) => {
      const { id } = req.query;
      const _id = new ObjectID(id as string);

      client.connect((_err) => {
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
    .get("/listByCity", (_req: Request, res: Response) => {
      client.connect((_err) => {
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
                (_err, result) => {
                  console.log(result);
                }
              );

            res.json(result.ops[0]);
          }
        });
      });
    });
}
