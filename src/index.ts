import express, { Request, Response } from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { listsRoute } from "./routes/lists";
import { userRoutes } from "./routes/user";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "";
const client = new MongoClient(DB_URL, { useNewUrlParser: true });

const app = express();

app.use(cors());

listsRoute(app, client);
userRoutes(app, client);

app
  .get("/", (_req: Request, res: Response) => {
    res.send("Апи работает окей - на ts");
  })

  .listen(PORT, () => console.log(`Listening on ${PORT}`));
