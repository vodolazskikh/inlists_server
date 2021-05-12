import { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import { config } from "../config";
import fetch from "node-fetch";
import cors from "cors";

export function userRoutes(app: Express, client: MongoClient) {
  const bodyParser = require("body-parser");
  // for parsing application/json
  app.use(bodyParser.json());

  app.use(cors());

  app
    // Инфа о юзере
    .get("/userInfo", (req: Request, res: Response) => {
      const { userId, token } = req.query;

      fetch(
        `${config.methodsApiUrl}users.get?user_ids=${userId}&fields=photo_100&access_token=${token}&v=5.126`
      )
        .then((data: any) => data.json())
        .then((json: any) => res.json(json.response[0]));
    })

    // Юзерские закладки
    .get("/userBookmarks", (req: Request, res: Response) => {
      const { userId } = req.query;

      client.connect((_err) => {
        const collection = client.db("inlists").collection("users");

        collection.findOne({ userId }, function (err, result) {
          if (err) {
            res.json({ error: "An error has occurred" });
          } else {
            if (!!result && "bookmarks" in result) {
              res.json(result.bookmarks);
            } else {
              res.json([]);
            }
          }
        });
      });
    })
    // Получение списков для конкретного юзера
    .get("/userLists", (req, res) => {
      client.connect((_err) => {
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
    })
    // Получение токена ВК
    .get("/token", (req, res) => {
      const code = req.query.code;

      fetch(
        `${config.url}access_token?client_id=${config.client_id}&client_secret=${process.env.VK_SECRET}&redirect_uri=${config.redirect_uri}&code=${code}`
      )
        .then((data: any) => data.json())
        .then((json: any) => {
          client.connect((err) => {
            const collection = client.db("inlists").collection("users");
            const userId = String(json.user_id);
            collection.findOne({ userId }, function (err, result) {
              if (err) {
                console.log("An error has occurred");
              } else {
                if (!result) {
                  collection.insertOne({ userId, lists: [] });
                }
              }
            });
          });

          res.json({ access_token: json.access_token, user_id: json.user_id });
        });
    });
}
