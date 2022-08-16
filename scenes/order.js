const {Scenes,Markup} = require("telegraf");
const path = require("path");
const axios = require("../axios");
const orderScene = new Scenes.BaseScene("orderScene");

orderScene.enter(async ctx => {
ctx.deleteMessage().catch(()=>{});
await  ctx.replyWithChatAction("typing");
if(!ctx.callbackQuery) return; 
    const user = await axios.get("/users/" + ctx.from.id);
    const myCart = await axios.get("/cart/" + user.data.user._id);
     const txt = `<i>${ctx.i18n.t("order.message.isEmptyCart")}</i>
`;
    if(myCart.data.cart.products.length === 0) {
     return ctx.replyWithHTML(txt,{
      ...Markup.inlineKeyboard([
          Markup.button.callback(ctx.i18n.t("main.keyboard.menu"),"menu")
      ])
    })
         
    } 
   
  
  
const text = `<b>${ctx.from.first_name}</b> <i>${ctx.i18n.t("order.message.location")}</i>
`;  
    await ctx.replyWithHTML(text, {
        ...Markup.keyboard([
            Markup.button.locationRequest(ctx.i18n.t("order.keyboard.location"))
        ]).resize().oneTime()
    })
})

orderScene.on("location",async(ctx)=>{
await  ctx.replyWithChatAction("typing");
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id-1).catch(()=>{});
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id).catch(()=>{});
  await ctx.reply(ctx.i18n.t("order.message.waiting"),{reply_markup: { remove_keyboard: true }})
    const user = await axios.get("/users/" + ctx.from.id);
    const myCart = await axios.get("/cart/" + user.data.user._id);
    const order = await axios.post("/order", {
        cart: myCart.data.cart,
        location: ctx.message.location
    })


    if (order.data.status === 201) {
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id-1).catch(()=>{});
      const admins = await axios.get("/users/admin");
       if(admins.data.users.lenth !== 0){
        const txt = `<i>Sizda <b>${ctx.from.username ? `@${ctx.from.username}`:ctx.from.first_name}</b> yangi buyutmachi bor❗🍔</i>`
      admins.data.users.map(admin => ctx.telegram.sendMessage(admin.user_id,txt,{
        parse_mode:"HTML",
        disable_notification:false,
        ...Markup.inlineKeyboard([Markup.button.callback("Buyurtmalarga o'tish","adminOrders")])
      }))         
       } 

			
     const user = await axios.get("/users/" + ctx.from.id);
			
      await axios.get(`/cart/clear-product/${user.data.user._id}`);
        
        const text = `<i>${ctx.i18n.t("order.message.success")}</i>`;
        await ctx.replyWithPhoto({source:path.join(__dirname, "../images/paket.jpg")}, {
            parse_mode:"HTML",
            caption:text,
            ...Markup.inlineKeyboard([
                Markup.button.callback(ctx.i18n.t("main.keyboard.menu"), "menu")
            ])
        })
    }

  
})

orderScene.use((ctx,next) => {ctx.deleteMessage().catch(()=>{}); next()})
orderScene.action("menu",async(ctx)=>{
return ctx.scene.enter("start");
})
	
module.exports = orderScene;