const { Scenes, Markup} = require("telegraf");
const axios = require("../axios")
const { languageInlineKeyboard } = require("../utils/keyboards")
const path = require("path");


const settingsScene = new Scenes.WizardScene(
    'settingsScene',
async (ctx) => {
await ctx.replyWithChatAction("typing");
    const keyboard = languageInlineKeyboard();
        ctx.replyWithHTML(
            `🇺🇿 Tilni tanlang\n🇷🇺 Выберите язык\n🇺🇸 Select language`,
            keyboard
        );
        return ctx.wizard.next();
    },
async (ctx) => {
await ctx.replyWithChatAction("typing");
        if(!ctx.callbackQuery) {
            return ctx.scene.reenter();
        }
        let lang = ctx.callbackQuery.data;
        if (!['uz','ru','en'].includes(lang)) {
            return ctx.scene.reenter();
        }
	
  const resp = await axios.get("/users/" + ctx.from.id);
   const {status, user} = resp.data;
	  const updated  = await axios.put("/users/" + user._id,{lang});
	const userLang = updated.data.data.lang;
    ctx.session.language = userLang;
    ctx.i18n.locale(userLang);
        await ctx.answerCbQuery("Bot tili alashtirildi boshidan /start bosing❗️",{show_alert:true});
      if(user.isAdmin) {
	     return ctx.scene.leave();	
			}
	     return ctx.scene.leave();
    }
);

settingsScene.use((ctx,next) => {ctx.deleteMessage().catch(()=>{}); next()})
module.exports = settingsScene;

// startScene.leavle( ctx => ctx.scene.enter("authScene"));

// Agar foydalanuvchi xom xabarni kiritgan bo'lsa yoki boshqa variantni tanlagan bo'lsa nima qilish kerak?
// startScene.use((ctx) => ctx.reply("iltimos tugmalardan foydalaning"));


