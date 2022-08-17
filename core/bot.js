const { Telegraf, session, Markup } = require("telegraf");
const axios = require("../axios");
const TelegrafI18n = require("telegraf-i18n");
const rateLimit = require('telegraf-ratelimit');
const path = require("path");
const stage = require("../scenes");

const i18n = new TelegrafI18n({
    defaultLanguage:"uz",
    directory:path.resolve(__dirname, "../locales"),
    useSession:true
})

const bot = new Telegraf(process.env.BOT_TOKEN);
// Set limit to 1 message per 3 seconds
const limitConfig = {
  window: 1000,
  limit: 1,
  onLimitExceeded: (ctx, next) => {}
}
bot.use(rateLimit(limitConfig))
bot.use(session());
bot.use((ctx, next) => { ctx.session = ctx.session ?? {}; next()});
// bot.use((ctx, next) => {ctx.deleteMessage().catch(()=>{}); next()})

bot.use(i18n.middleware());
bot.use(stage.middleware());
bot.use((ctx,next) => {ctx.replyWithChatAction("typing");return next()})

bot.start(async (ctx) => {
	
  const resp = await axios.get("/users/" + ctx.from.id);
   const {status, user} = resp.data;
  if (status == 200){
    ctx.i18n.locale(user.lang);
      if(user.isAdmin) return ctx.scene.enter("adminHome");
      return ctx.scene.enter("start");
    }

        return ctx.scene.enter('authScene');

});


bot.action("adminOrders",(ctx) => {
  ctx.deleteMessage().catch(()=>{});
 return ctx.scene.enter("adminOrders")
})


bot.command("/help",async ctx => {
  ctx.deleteMessage().catch(()=>{});	
await ctx.replyWithHTML(ctx.i18n.t("common.message.help"), {
	...Markup.inlineKeyboard([
		Markup.button.callback(ctx.i18n.t("common.keyboard.back"),"menu")
	])
})
})

bot.action("menu", ctx => {
  ctx.deleteMessage().catch(()=>{});	
	return ctx.scene.enter("start")
})

bot.launch();