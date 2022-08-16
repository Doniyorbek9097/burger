const {Scenes,Markup} = require("telegraf");
const axios = require("../../axios");
const addProduct = new Scenes.WizardScene(
  "addProduct",
  async (ctx) => {
ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{});
const txt = `${ctx.i18n.t("addProduct.productName")}`;
   await ctx.replyWithHTML(txt);
    return ctx.wizard.next();
  },

async (ctx) => {
if(ctx.callbackQuery) return;
ctx.replyWithChatAction("typing");
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id-1).catch(()=>{});
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id).catch(()=>{});
ctx.wizard.state.product = {};
const title = ctx.message.text;
ctx.wizard.state.product.name = title;
const category = await axios.post("/category",{title});

if(category.data.status == 200){
ctx.replyWithChatAction("typing");
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id-1).catch(()=>{});
const txt = `<b>${title}</b> ${ctx.i18n.t("addProduct.haveProduct")}`;
	ctx.replyWithHTML(txt);
	return ctx.wizard.next();
}

if(category.data.status == 201){
ctx.replyWithChatAction("typing");
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id-1).catch(()=>{});
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id).catch(()=>{});
const txt = `<b>${title}</b> ${ctx.i18n.t("addProduct.productPrice")}`;
	ctx.replyWithHTML(txt);
	return ctx.wizard.next();
}
	
},

async (ctx) => {
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id-1).catch(()=>{});
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id).catch(()=>{});
if(ctx.callbackQuery) return;
ctx.wizard.state.product.price = ctx.message.text;
const keyboard = Markup.inlineKeyboard([
	Markup.button.callback(ctx.i18n.t("addProduct.keyboard.yes"),"yes"),
	Markup.button.callback(ctx.i18n.t("addProduct.keyboard.no"),"no")
])
ctx.reply(ctx.i18n.t("addProduct.question"),keyboard)
	
}

  
);

addProduct.command("start", ctx => ctx.scene.enter("adminHome"))

addProduct.action("yes", async ctx => {
	ctx.replyWithChatAction("typing");
  ctx.deleteMessage().catch(()=>{});
const {product} = ctx.wizard.state;
const newProduct = await axios.post("/product",product)
await ctx.answerCbQuery(ctx.i18n.t("addProduct.addedProduct"),{show_alert:true});
 return ctx.scene.enter("adminHome");
})

addProduct.action("no", ctx => ctx.scene.enter("adminHome"))

module.exports = addProduct;