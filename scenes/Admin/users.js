const {Scenes,Markup} = require("telegraf");
const axios = require("../../axios");
const usersScene = new Scenes.WizardScene(
	"usersScene",
async ctx => {
ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{});
if(!ctx.callbackQuery) return;
	
let users = await axios.get("/users");
	users = users.data.users;
ctx.wizard.state.count = 0;
const txt = `${ctx.i18n.t("usersList.users")}: ${ctx.wizard.state.count+1}/${users.length}\n
${ctx.i18n.t("usersList.user")}: ${users[ctx.wizard.state.count].first_name}\n
${ctx.i18n.t("usersList.username")}: ${users[ctx.wizard.state.count].username == "@undefined" ? 
ctx.i18n.t("usersList.undefined") : users[ctx.wizard.state.count].username}\n
${ctx.i18n.t("usersList.phone")}: ${users[ctx.wizard.state.count].phone}\n
 
 `;

const keyboard = Markup.inlineKeyboard([
	Markup.button.callback("◀️","back"),
	Markup.button.callback("➡️","next"),
	Markup.button.callback(`${ctx.i18n.t("common.keyboard.back")}` ,"adminHome")	
],{columns:2})
		
await	ctx.reply(txt,keyboard);
return ctx.wizard.next();
	
}
	
);

usersScene.action("next", async ctx => {
ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{}); 
if(!ctx.callbackQuery) return;
let users = await axios.get("/users");
	
if(ctx.callbackQuery.data == "next") {
	users = users.data.users;
ctx.wizard.state.count++;

if(ctx.wizard.state.count > users.length-1) {
ctx.wizard.state.count = 0;
}
	
const txt = `${ctx.i18n.t("usersList.users")}: ${ctx.wizard.state.count+1}/${users.length}\n
${ctx.i18n.t("usersList.user")}: ${users[ctx.wizard.state.count].first_name}\n
${ctx.i18n.t("usersList.username")}: ${users[ctx.wizard.state.count].username == "@undefined" ? 
ctx.i18n.t("usersList.undefined") : users[ctx.wizard.state.count].username}\n
${ctx.i18n.t("usersList.phone")}: ${users[ctx.wizard.state.count].phone}\n
 
 `;

const keyboard = Markup.inlineKeyboard([
	Markup.button.callback("◀️","back"),
	Markup.button.callback("➡️","next"),
	Markup.button.callback(`${ctx.i18n.t("common.keyboard.back")}` ,"adminHome")	
	
],{columns:2})
		
await	ctx.reply(txt,keyboard);

}

});


usersScene.action("back",async ctx => {
ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{}); 
if(!ctx.callbackQuery) return;
	
let users = await axios.get("/users");
	
if(ctx.callbackQuery.data == "back") {
	users = users.data.users;
ctx.wizard.state.count--;

if(ctx.wizard.state.count < 0) {
ctx.wizard.state.count = users.length-1;
}

const txt = `${ctx.i18n.t("usersList.users")}: ${ctx.wizard.state.count+1}/${users.length}\n
${ctx.i18n.t("usersList.user")}: ${users[ctx.wizard.state.count].first_name}\n
${ctx.i18n.t("usersList.username")}: ${users[ctx.wizard.state.count].username == "@undefined" ? 
ctx.i18n.t("usersList.undefined") : users[ctx.wizard.state.count].username}\n
${ctx.i18n.t("usersList.phone")}: ${users[ctx.wizard.state.count].phone}\n
 
 `;

const keyboard = Markup.inlineKeyboard([
	Markup.button.callback("◀️","back"),
	Markup.button.callback("➡️","next"),
	Markup.button.callback(`${ctx.i18n.t("common.keyboard.back")}` ,"adminHome")	
	
],{columns:2})
		
await	ctx.reply(txt,keyboard);

}


});

usersScene.action("adminHome", ctx => {
ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{}); 
if(!ctx.callbackQuery) return;

return ctx.scene.enter("adminHome");
});

module.exports = usersScene;