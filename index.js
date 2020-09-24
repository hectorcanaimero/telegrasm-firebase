const Telegraf = require('telegraf');
const functions = require('firebase-functions');
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore().collection("centro");




const bot = new Telegraf(functions.config().telegrambot.key);

// bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.on('text', (ctx) => {
    const text = ctx.message.text.split(' ');
    ctx.reply(`${typeof(text)} - ${text}`)
    let query = db.where('code', '==', `${text[0]}`).get()
    .then((snapshot) => {
        // eslint-disable-next-line promise/always-return
        if (snapshot.empty) {
            return ctx.reply(`${text} no esta asociado, digite de nuevo ${snapshot.empty} - ${snapshot.size}`);
        }
        snapshot.forEach(res => {
            res.collection('poll').set({
                hora: '09:00',
                total: text[1]
            })
            return ctx.reply(`${res.data().name}, su Centro es ${res.data().code}`);
          });
    })
    .catch(err => {
        ctx.reply(err);
        console.log('Error getting documents', err);
    });
});

bot.launch();

exports.bot = functions.https.onRequest((req, res) => {
  bot.handleUpdate(req.body, res);
})
