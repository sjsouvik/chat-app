const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

exports.fetchAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content.trim() || !chatId) {
    return res.status(400).json({ error: "Bad request" });
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
