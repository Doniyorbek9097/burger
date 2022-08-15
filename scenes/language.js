const { Scenes, Markup} = require("telegraf");
const axios = require("../axios");
const { languageInlineKeyboard } = require("../utils/keyboards")
const path = require("path");


const languageScene = new Scenes.WizardScene(
    'languageScene',
    (ctx) => {
        const keyboard = languageInlineKeyboard();
        ctx.replyWithHTML(
            `🇺🇿 Tilni tanlang\n🇷🇺 Выберите язык\n🇺🇸 Select language`,
            keyboard
        );
        return ctx.wizard.next();
    },
    async (ctx) => {
ctx.deleteMessage().catch(()=>{});
        if(!ctx.callbackQuery) {
            return ctx.scene.reenter();
        }
        let lang = ctx.callbackQuery.data;
        if (!['uz','ru','en'].includes(lang)) {
            return ctx.scene.reenter();
        }
        ctx.i18n.locale(lang);
        
        return ctx.scene.enter('authScene');
    }
);

module.exports = languageScene;

// startScene.leavle( ctx => ctx.scene.enter("authScene"));

// Agar foydalanuvchi xom xabarni kiritgan bo'lsa yoki boshqa variantni tanlagan bo'lsa nima qilish kerak?
// startScene.use((ctx) => ctx.reply("iltimos tugmalardan foydalaning"));


