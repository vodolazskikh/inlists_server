const mockLists = require("../mocks/lists");

module.exports = function (app, db) {
  app
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
    // Добавление нового списка
    .post("/list", (req, res) => {
      // const { cd } = req.query;
      res.json(mockLists);
    });
};
