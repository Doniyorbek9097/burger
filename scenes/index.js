const {Scenes} = require("telegraf");

const stage = new Scenes.Stage([
    require("./start"),
    require("./language"),
    require("./auth"),
    require("./settings"),
    require("./menu"),
    require("./cart"),
    require("./order"),
  // admin panel Scenes
  require("./Admin/adminHome"),
  require("./Admin/adminOrders"),
  require("./Admin/addProduct"),
	require("./Admin/delProduct"),
	require("./Admin/users")
]);

module.exports = stage;