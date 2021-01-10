const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const vkAuth = require("./config");
const mockLists = require("./mocks/lists");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());

app
  .get("/", (_req, res) => res.send("Апи работает"))
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
  // Инфа о юзере
  .get("/userInfo", (req, res) => {
    const { userId, token } = req.query;

    fetch(
      `${vkAuth.methodsApiUrl}users.get?user_ids=${userId}&fields=photo_100&access_token=${token}&v=5.126`
    )
      .then((data) => data.json())
      .then((json) => res.json(json.response[0]));
  })

  // Получение списка по id
  .get("/listById", (req, res) => {
    const { id } = req.query;
    res.json({
      id,
      title: "Что посмотреть",
      description: "Список фильмов для вечера пятницы",
      rating: 4.1,
      emoji: "🎬",
      list: [
        "Пираты карибского моря и грязный Виктор",
        "Замерзшая в Суздали",
        "Отстойники 3",
      ],
    });
  })
  // Получение списков для конкретного города
  .get("/listByCity", (req, res) => {
    // const { cd } = req.query;
    res.json(mockLists);
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
