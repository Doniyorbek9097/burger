const {Scenes, Markup} = require("telegraf");
const axios = require("../../axios");
const adminOrders = new Scenes.WizardScene(
"adminOrders",
async (ctx) => {
ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{}); 
if(!ctx.callbackQuery) return;

 let orders = await axios.get("/order");
	
orders = orders.data.orders;
	
orders.map((item,index) => {
let txt = `
<b>${ctx.i18n.t("adminOrder.name")}</b>: ${item.cart.user.first_name}\n
<b>${ctx.i18n.t("adminOrder.username")}</b>: ${item.cart.username}\n
<b>${ctx.i18n.t("adminOrder.phone")}</b>: ${item.cart.user.phone}\n
--------------------------------------
      <i>${ctx.i18n.t("adminOrder.text")}</i>
--------------------------------------
 `;

item.cart.products.map((product,index) => {
txt +=`<b>${product.name}</b> ${product.quantity} x ${product.price} = ${product.quantity * parseInt(product.price)}\n
`;

 const totalPrice = item.cart.products.reduce((sum, {price, quantity}) => sum + parseInt(price) * parseInt(quantity) ,0);
txt += `------------------------------------------
<i><b>${ctx.i18n.t("adminOrder.totalPrice")}:</b> ${totalPrice} .so'm</i> 💰
---------------------------------------------------`;

const {latitude, longitude} = item.location;
	
const keyboard = Markup.inlineKeyboard([
	Markup.button.callback(`📍${ctx.i18n.t("adminOrder.keyboard.location")}`,JSON.stringify({latitude,longitude})),
	Markup.button.callback(`❌ ${ctx.i18n.t("adminOrder.keyboard.delete")}`,item._id),
	Markup.button.callback(`🔙 ${ctx.i18n.t("adminOrder.keyboard.back")}`,"adminHome")
	
],{columns:2});

ctx.replyWithHTML(txt,keyboard);


	
})

	
});

return ctx.wizard.next();

},

async (ctx) => {
ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{}); 
if(!ctx.callbackQuery) return;
const data = ctx.callbackQuery.data;

const orders = await axios.get("/order");
const ordersId = orders.data.orders.map(order => order._id);

	// delete order 
	if(ordersId.includes(data)){
	const delOrder = await axios.delete("/order/"+data);
		ctx.answerCbQuery("Buyurtma o'childi!",{show_alert:true});
		return ctx.scene.enter("adminHome");
	}

 // get location

function isJSON(data) {
	try{
		JSON.parse(data)
	}catch(e) {
		return false;
	}
	return true;
}

if(isJSON(data)){
	const { latitude, longitude } = JSON.parse(data);
 ctx.telegram.sendLocation(ctx.chat.id,latitude,longitude); 
	return ctx.scene.enter("adminHome");

}else{
	return;
}
	 	
}
	
);

adminOrders.action("adminHome", ctx => {
ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{}); 
return	ctx.scene.enter("adminHome")
})



adminOrders.command("/start", ctx =>  ctx.scene.enter("adminHome"))


module.exports = adminOrders;