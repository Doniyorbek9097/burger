const {Markup} = require("telegraf");

const languageInlineKeyboard = () => {
    return Markup.inlineKeyboard([
        Markup.button.callback(`๐บ๐ฟ O'zbek`, 'uz'),
        Markup.button.callback('๐ท๐บ ะ ัััะบะธะน', 'ru'),
        Markup.button.callback('๐บ๐ธ English', 'en')
    ],{columns:1});
};


const RequestPhoneKeyboard = (ctx) => {
    return Markup.keyboard([
        Markup.button.contactRequest(ctx.i18n.t("auth.keyboard.phone"))
    ]).resize().oneTime().resize()
}

const mainKeyboard = (ctx) => {
    return Markup.inlineKeyboard([
        Markup.button.callback(ctx.i18n.t('main.keyboard.menu'), 'menu'),
        Markup.button.callback(ctx.i18n.t('main.keyboard.cart'), 'cart'),
        Markup.button.callback(ctx.i18n.t('main.keyboard.settings'), 'settings')
    ],{columns:2})
}

const cartKeyboard = (ctx) => {
    return Markup.inlineKeyboard([
        Markup.button.callback(ctx.i18n.t("cart.keyboard.orderPush"), "orderPush"),
        Markup.button.callback(ctx.i18n.t("cart.keyboard.menu"), "menu"),
        Markup.button.callback(ctx.i18n.t("cart.keyboard.clear"), "clear")
    ],{columns:2})
}

const adminHomeKeyboard = (ctx) => {
  return Markup.inlineKeyboard([
    Markup.button.callback(ctx.i18n.t("adminHome.keyboard.productAdd"),"addProduct"),
    Markup.button.callback(ctx.i18n.t("adminHome.keyboard.productDelete"),"delProduct"),
    Markup.button.callback(ctx.i18n.t("adminHome.keyboard.orders"),"adminOrders"),
    Markup.button.callback(ctx.i18n.t("adminHome.keyboard.users"),"users"),
    Markup.button.callback(ctx.i18n.t("main.keyboard.settings"),"settings")
  ],{columns:2})
}

module.exports = {
    languageInlineKeyboard,
    RequestPhoneKeyboard,
    mainKeyboard,
    cartKeyboard,
  adminHomeKeyboard
}