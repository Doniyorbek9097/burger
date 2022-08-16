const { Scenes, Markup } = require("telegraf");
const path = require("path");
const axios = require("../axios");
const bot = require("../core/bot");
const menuScene = new Scenes.WizardScene(
"menuScene",
async (ctx) => {
  await ctx.replyWithChatAction("upload_photo");
  const { data } = await axios.get("/category");
    const products = data.categories;
    
    let buttons = products.map(button => Markup.button.callback(button.title, button.title));
    let buttonArr = [];
    for(i=0; i< products.length; i++){buttonArr.push(buttons.splice(0,2))}

    let keyboard = Markup.inlineKeyboard([
        ...buttonArr,
        [Markup.button.callback(ctx.i18n.t("menu.keyboard.home"), "home"),
        Markup.button.callback(ctx.i18n.t("menu.keyboard.cart"), "cart")]
    ]);
    
    await ctx.replyWithPhoto({ source: path.join(__dirname, `../images/menyu.jpg`) }, {
        caption: ctx.i18n.t("menu.message"),
        parse_mode: "HTML",
        ...keyboard
    })

ctx.wizard.state.products = {};
return ctx.wizard.next();
    
},

async (ctx) => {  
await ctx.replyWithChatAction("typing");
if(!ctx.callbackQuery) return;
const productName = ctx.callbackQuery.data;
let productsNames = await axios.get("/product");
  productsNames = productsNames.data.products.map(product => product.name);
  if(!productsNames.includes(productName)) {
  ctx.answerCbQuery(ctx.i18n.t("menu.pleaseKeyboard"),{show_alert:true});
    return;
  }
  
ctx.wizard.state.products.name = productName;
let product = await axios.get("/product/"+productName);
product = product.data.products;
    
let buttons = product.map(button => Markup.button.callback(`${button.price}.so'm`, button.price));
    let buttonArr = [];
    for(i=0; i< product.length; i++){buttonArr.push(buttons.splice(0,2))}

    let keyboard = Markup.inlineKeyboard([
        ...buttonArr,
        [Markup.button.callback(ctx.i18n.t("common.keyboard.back"), "back"),
        Markup.button.callback(ctx.i18n.t("menu.keyboard.cart"), "cart")]
    ]);
    
   await ctx.replyWithHTML(`<b>${productName}</b> <i>${ctx.i18n.t("menu.productPriceMessage")}</i>`,keyboard);
    return ctx.wizard.next()
    
},

async (ctx) => {
await ctx.replyWithChatAction("typing");
if(!ctx.callbackQuery) return;
 const productPrice = ctx.callbackQuery.data;
let product = await axios.get("/product/"+ctx.wizard.state.products.name+"/"+productPrice);
let productPrices = product.data.products.map(product => product.price);
if(!productPrices.includes(productPrice)) {
ctx.answerCbQuery("menu.pleaseKeyboard",{show_alert:true});
return;  
}
  
 ctx.wizard.state.products.price = parseInt(productPrice);

    const countes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 50];
  
    let buttons = countes.map(button => Markup.button.callback(button, button));
    let buttonArr = [];
    for(i=0; i<countes.length; i++){buttonArr.push(buttons.splice(0,5))}

    let keyboard = Markup.inlineKeyboard([
        ...buttonArr
    ]);

    await ctx.replyWithHTML(ctx.i18n.t("menu.productAmount"), keyboard)
 
  return ctx.wizard.next();    
   
},


async (ctx) => {
await ctx.replyWithChatAction("typing");
if(!ctx.callbackQuery) return;
const productAmount = parseInt(ctx.callbackQuery.data);
    const countes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 50];
  if(!countes.includes(productAmount)) {
ctx.answerCbQuery(ctx.i18n.t("menu.pleaseKeyboard") ,{show_alert:true});
return;  
}


ctx.wizard.state.products.quantity = parseInt(productAmount);
  
  await ctx.replyWithHTML(ctx.i18n.t("menu.addCart"),{
     ...Markup.inlineKeyboard([
         Markup.button.callback(ctx.i18n.t("menu.keyboard.addedCart"),"yes"),
         Markup.button.callback(ctx.i18n.t("menu.keyboard.notAddCart"),"no")
     ])
 })  
 return ctx.wizard.next();    
}                                     
                                      
);
  

menuScene.action("home",ctx => { 
ctx.deleteMessage().catch(()=>{})
return ctx.scene.enter("start");
});
menuScene.action("cart", ctx => ctx.scene.enter("cartScene"))

menuScene.action("back", ctx => {
	ctx.deleteMessage().catch(()=>{});
	return ctx.scene.enter("start");
})


                              
menuScene.use((ctx, next) => {ctx.deleteMessage().catch(()=>{});next()});
menuScene.command('start', ctx => ctx.scene.enter('start'));

menuScene.action("yes", async ctx => {
   ctx.replyWithChatAction("typing");
        ctx.deleteMessage().catch(()=>{}); 
        const { name, price, quantity } = ctx.wizard.state.products;
        const product1 = await axios.get(`/product/${name}/${price}`)
        const user = await axios.get("/users/"+ ctx.from.id);
        ctx.session.products = {};
        product1.data.products.map(item => ctx.session.products = item);

        ctx.session.products.quantity = quantity;
        const myCart = await axios.post("/cart", {
            user:user.data.user._id,
            products:ctx.session.products
        })
        const msg = myCart.data.message == "Mahsulot Karzinkaga saqlandi" 
					? ctx.i18n.t("menu.cartAddProduct")
					: ctx.i18n.t("menu.cartAddedProduct");
        await ctx.answerCbQuery(msg,{show_alert:true});
 
  return ctx.scene.enter("cartScene");
  
})

menuScene.action("no", ctx => {
ctx.deleteMessage().catch(()=>{});
 return ctx.scene.enter("start")
});



module.exports = menuScene;