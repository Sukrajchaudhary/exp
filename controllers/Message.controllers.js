const { Message } = require("../models/Message.model");
const { Conversation } = require("../models/Conversation.model");
const { getReceiverSocketId, io } = require("../socket/socket");
exports.sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const { message } = req.body;
    const senderId = req.user._id;
    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId: senderId,
      receiverId: receiverId,
      message: message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    // socket.io funcanality

    await Promise.all([await conversation.save(), await newMessage.save()]);
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json(newMessage);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: "Internal Server Error !" });
  }
};
//
exports.getMessage = async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, userToChat],
      },
    }).populate("messages");
    if (!conversation) {
      return res.status(200).json([]);
    }
    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ error: "Internal Server Error !" });
  }
};
