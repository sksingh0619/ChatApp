const mongoose = require("mongoose");

const messageScema = new mongoose.Schema({
    chatId: String,
    senderId:String,
    text:String
},{
    timestamps:true
})

const messageModel = mongoose.model("Message", messageScema);

module.exports = messageModel;