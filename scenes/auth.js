const { Scenes, Markup } = require("telegraf");
const axios = require("../axios");
const {RequestPhoneKeyboard} = require("../utils/keyboards")
const authScene = new Scenes.WizardScene(
"authScene",
async (ctx) => {
   await ctx.replyWithHTML(ctx.i18n.t("auth.welcome"));
    await ctx.reply(ctx.i18n.t("auth.name"));
ctx.wizard.state.user = {};
    return ctx.wizard.next();
},

async (ctx) => {
ctx.replyWithChatAction("typing");
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id-2).catch(()=>{});
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id-1).catch(()=>{});
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id).catch(()=>{});
if(ctx.message.text ==="/start") return ctx.scene.reenter();
if(ctx.message.text.length < 3) {
    await ctx.reply(ctx.i18n.t("auth.nameLength"));
    return;
}

ctx.wizard.state.user.first_name = ctx.message.text;
ctx.wizard.state.user.username = `@${ctx.from.username}`;
ctx.wizard.state.user.user_id = ctx.from.id;

const keyboard = RequestPhoneKeyboard(ctx);
 await ctx.reply(ctx.i18n.t("auth.phone"),keyboard);
 return ctx.wizard.next();
},


async (ctx) => {
ctx.replyWithChatAction("typing");
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id-1).catch(()=>{});
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id).catch(()=>{});
if(ctx.message.text ==="/start") return ctx.scene.reenter();

 if(ctx.message.contact || !isNaN(ctx.message.text)){
     
ctx.message.text ? ctx.wizard.state.user.phone = ctx.message.text : ctx.wizard.state.user.phone = ctx.message.contact.phone_number; 
     
  const { user } = ctx.wizard.state;
const userdata = await axios.post("/users", user);
if (userdata.data.status === 201) {
ctx.replyWithChatAction("typing");
ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id).catch(()=>{});
await ctx.reply(ctx.i18n.t("auth.nameSuccess"),{reply_markup: { remove_keyboard: true }});
return ctx.scene.enter("start") 

}  
    
}

  await ctx.reply(ctx.i18n.t("auth.plaseNumber"))
  return;
}

    
);



// authScene.leave(ctx => {
// console.log(ctx.wizard.state.user)
//  } 
// );
module.exports = authScene;
