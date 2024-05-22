const chatModel = require("../Models/chatModel");


const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;

    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] }
        });

        if (chat)
            return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firstId, secondId]
        });
        console.log("Created new chat");
        const response = await newChat.save();
        return res.status(200).json(response);


    } catch (error) {
        console.log("Create Chat error : ", error);
        res.status(500).json(error);
    }
}

const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] }
        });

        console.log("Finding chat : ", chats);
        return res.status(200).json(chats);
    } catch (error) {
        console.log("Finding chat error : ", error);
        return res.status(500).json(error);
    }
}

const findChat = async (req, res) => {
    const { firstId, secondId } = req.params;

    try {
        const chats = await chatModel.findOne({
            members: { $all: [firstId, secondId] }
        });

        console.log("Finding single chat : ", chats);
        return res.status(200).json(chats);
    } catch (error) {
        console.log("Finding single chat error : ", error);
        return res.status(500).json(error);
    }
}

module.exports = {createChat, findUserChats, findChat};