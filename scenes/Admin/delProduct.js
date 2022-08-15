const {Scenes, Markup} = require("telegraf");
const axios = require("../../axios");
const delProduct = new Scenes.WizardScene(
"delProduct",
async (ctx) => {
if(!ctx.callbackQuery) return;
ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{});
const txt = `O'chirmoqchi bo'lgan mahsulotingizni tanlang!`;
  const products = await axios.get("/category");
    let buttons = products.data.categories.map(button => Markup.button.callback(`❌${button.title}`, button._id));
    let buttonArr = [];
    for(i=0; i < products.data.categories.length; i++){buttonArr.push(buttons.splice(0,5))}

    let keyboard = Markup.inlineKeyboard([
        ...buttonArr,
			[Markup.button.callback("🔙Orqaga","adminHome")]
    ]);

await	ctx.replyWithHTML(txt,keyboard);

return ctx.wizard.next();
	
},

async (ctx) => {
if(!ctx.callbackQuery) return;
ctx.replyWithChatAction("typing");
ctx.deleteMessage().catch(()=>{});
const id = ctx.callbackQuery.data;
	const category = await axios.delete("/category/"+id);
	const Product = await axios.get("/product/"+category.data.category.title);
	console.log(Product.data.status)
	if(Product.data.status !== 200) return ctx.scene.enter("adminHome");
	const productIds = Product.data.products.map(product => product._id);
	productIds.map(async productId => await axios.delete("/product/"+productId))
ctx.answerCbQuery( "Mahsulot o'chirildi✅",{show_alert:true});
return ctx.scene.reenter();

}

	
);
delProduct.action("adminHome", ctx => {
ctx.deleteMessage().catch(()=>{});
	return ctx.scene.enter("adminHome");
})
delProduct.command("start",ctx => ctx.scene.enter("adminHome"));

module.exports = delProduct;