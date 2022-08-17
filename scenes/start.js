const { Scenes } = require("telegraf");
const { mainKeyboard } = require("../utils/keyboards")
const path = require("path");

const startScene = new Scenes.BaseScene("start");

startScene.enter(async(ctx) => {
  await ctx.replyWithChatAction("upload_photo");
    const keyboard = mainKeyboard(ctx);
    ctx.replyWithPhoto({source:path.join(__dirname, "../images/logo.jpg")}, {
     parse_mode:"HTML",
     caption:ctx.i18n.t("main.welcome"),
     ...keyboard
    });
})

startScene.action("menu", ctx => ctx.scene.enter("menuScene"));
startScene.action("settings", ctx => ctx.scene.enter("settingsScene"))
startScene.action("cart", ctx => ctx.scene.enter("cartScene"))
// Agar foydalanuvchi xom xabarni kiritgan bo'lsa yoki boshqa variantni tanlagan bo'lsa nima qilish kerak?
// startScene.use((ctx) => ctx.reply("iltimos tugmalardan foydalaning"));



module.exports = startScene;