const {Scenes, Markup} = require("telegraf");
const axios = require("../../axios");
const {adminHomeKeyboard} = require("../../utils/keyboards")
const adminHome = new Scenes.BaseScene("adminHome");


  
adminHome.enter(async ctx => {
	await ctx.replyWithChatAction("typing");
const keyboard = adminHomeKeyboard(ctx);
const text = `<i>${ctx.from.first_name} ${ctx.i18n.t("adminHome.message")}</i>`;
return  ctx.replyWithHTML(text,keyboard)

})
adminHome.action("addProduct", ctx => ctx.scene.enter("addProduct"));
adminHome.action("delProduct", ctx => ctx.scene.enter("delProduct"));
adminHome.action("users", ctx => ctx.scene.enter("usersScene"))
adminHome.action("settings", ctx => ctx.scene.enter("settingsScene"))
// adminHome.action("users",async ctx => {})

adminHome.action("adminOrders", async ctx => {
await  ctx.replyWithChatAction("typing");
if(!ctx.callbackQuery) return;
  const orders = await axios.get("/order");
 if(orders.data.orders.length === 0) {
    ctx.answerCbQuery(ctx.i18n.t("adminHome.alert.isEmptyOrders"),{show_alert:true});
    return;
  }
return ctx.scene.enter("adminOrders")
})

adminHome.command('start', ctx => ctx.scene.reenter());

adminHome.use((ctx, next) => {ctx.deleteMessage().catch(()=>{});next()});



module.exports = adminHome;