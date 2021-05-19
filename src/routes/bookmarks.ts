import { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import { ObjectID } from "mongodb";
const express = require("express");

export function bookmarksRoute(app: Express, client: MongoClient) {
  app.post("/bookmark", (req, res) => {
    app.use(
      express.urlencoded({
        extended: true,
      })
    );

    app.use(express.json());

    client.connect((err) => {
      const collection = client.db("inlists").collection("user");
      const newBookmark = {
        image: req.body.image,
        title: req.body.title,
        description: req.body.description,
        entityId: req.body.entityId,
        coordinates: req.body.coordinates,
      };
      const userId = String(req.body.userId);

      collection.insertOne(newBookmark, (err, result) => {
        if (err) {
          res.json({ error: "An error has occurred" });
        } else {
          // Добавим новый список и к юзеру
          client
            .db("inlists")
            .collection("users")
            .findOneAndUpdate(
              { userId },
              { $push: { bookmarks: newBookmark } },
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
