const { Scenes, Markup } = require("telegraf");
const axios = require("../axios");
const { cartKeyboard } = require("../utils/keyboards")
const path = require("path");

const cartScene = new Scenes.WizardScene(
  "cartScene",

async (ctx) => {
await  ctx.replyWithChatAction("typing");
if(!ctx.callbackQuery) return;
	const user = await axios.get("/users/"+ctx.from.id);
    const myCart = await axios.get("/cart/" + user.data.user._id);
    const { cart } = myCart.data;
  
    if (cart === null) {
    const text = `<b>${ctx.from.first_name}</b>

☹️<i>${ctx.i18n.t("cart.message.emptyCart")} !</i>
`;
        return ctx.replyWithHTML(text, {
            ...Markup.inlineKeyboard([
                Markup.button.callback(ctx.i18n.t("main.keyboard.menu"), "menu")
            ])
        })
    }
    
    let text = `<i>${ctx.i18n.t("cart.message.username")}: <b>${cart.user.first_name}</b></i>

<i>${ctx.i18n.t("cart.message.userPhone")}: <b>${cart.user.phone}</b>
——————————————————
${ctx.i18n.t("cart.message.cartAbout")} 
</i>`;
    
cart.products.map((item, index) => {
        text += `
<i>${index + 1}. <b>${item.name}</b>  <b>${item.price}</b> x <b>${item.quantity}</b> = <b>${parseInt(item.quantity) * parseInt(item.price)}</b> .so'm</i>
`;
 })

 const totalPrice =  cart.products.reduce((sum, {price, quantity}) => sum + parseInt(price) * parseInt(quantity) ,0);
text += `------------------------------------------
<i><b>${ctx.i18n.t("cart.message.totalPrice")}:</b> ${totalPrice} .so'm</i> 💰
---------------------------------------------------`;

    let buttons = cart.products.map((button, num) => Markup.button.callback(`${num + 1}.${button.name}  ❌`, button._id));
    let half = Math.ceil(buttons.length / 2);

    let keyboard = Markup.inlineKeyboard([
        [Markup.button.callback(ctx.i18n.t("cart.keyboard.orderPush"), "orderPush")],
        buttons.slice(0, half),
        buttons.slice(half, buttons.length),
        [Markup.button.callback(ctx.i18n.t("cart.keyboard.clear"), "clear"),
        Markup.button.callback(ctx.i18n.t("cart.keyboard.menu"), "menu")]

    ]);

  await ctx.replyWithHTML(text, keyboard);
  return ctx.wizard.next();
  
},

async (ctx) => {
await ctx.replyWithChatAction("typing");
if(!ctx.callbackQuery) return;
  const productID = ctx.callbackQuery.data;
	const user = await axios.get("/users/"+ctx.from.id);
    const cart = await axios.get("/cart/" + user.data.user._id);
    const cartProductId = cart.data.cart.products.map(item => item._id);

    if (cartProductId.includes(productID)) {
        ctx.deleteMessage().catch(()=>{}); 
        await ctx.answerCbQuery("Mahsulot karzinkadan o'chirildi ❗️",{show_alert:true});
        const delProduct = await axios.get(`/cart/delete-product/${user.data.user._id}/${productID}`);
        if (delProduct.data.status === 200) return ctx.scene.reenter();
    }
      return ctx.wizard.next();
    
},
  



);

cartScene.action("menu", ctx => ctx.scene.enter("menuScene"));
cartScene.action("orderPush", ctx => ctx.scene.enter("orderScene"));

cartScene.action("clear", async ctx => {
await ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{});
if(!ctx.callbackQuery) return;  
	const user = await axios.get("/users/"+ctx.from.id);
await ctx.answerCbQuery("Karzinka tozalandi 🗑",{show_alert:true});
        const clear = await axios.get(`/cart/clear-product/${user.data.user._id}`);
        if (clear.data.status === 200) return ctx.scene.enter("start");

});


// Agar foydalanuvchi xom xabarni kiritgan bo'lsa yoki boshqa variantni tanlagan bo'lsa nima qilish kerak?
// startScene.use((ctx) => ctx.reply("iltimos tugmalardan foydalaning"));

cartScene.use((ctx,next) => {ctx.deleteMessage().catch(()=>{}); next()})
cartScene.command('start', ctx => ctx.scene.enter('start'));



module.exports = cartScene;