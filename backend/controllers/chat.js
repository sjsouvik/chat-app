const Chat = require("../models/chat");
const User = require("../models/user");

// Fetch one chat
exports.findChat = async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return res
      .status(400)
      .json({ error: "UserId param not sent with the request" });
  }

  //TODO: add validation to check whether the given userId exists or not before finding or creating a new chat using that given userId

  try {
    let chat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users")
      .populate("latestMessage");

    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "firstName lastName email",
    });

    if (chat || req.method === "GET") {
      res.status(200).json(chat);
    }

    if (!chat && req.method === "POST") {
      next();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// create a chat if there's no chat created for the given user
exports.createChat = async (req, res) => {
  const { userId } = req.params;

  //TODO: add validation to check whether the given userId exists or not before finding or creating a new chat using that given userId
  const chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users"
    );
    res.status(200).json(fullChat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch all chats for a user
exports.fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users")
      .populate("groupAdmin")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "firstName lastName email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
