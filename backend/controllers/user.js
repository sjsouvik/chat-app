const User = require("../models/user");

exports.searchUsers = async (req, res) => {
  const searchText = req.query.search;

  if (!searchText) {
    return res.status(400).json({ error: "Search text is missing" });
  }

  const query = {
    $or: [
      { firstName: { $regex: searchText, $options: "i" } },
      { lastName: { $regex: searchText, $options: "i" } },
      { username: { $regex: searchText, $options: "i" } },
      { email: { $regex: searchText, $options: "i" } },
    ],
  };

  try {
    const users = await User.find(query).find({ _id: { $ne: req.user._id } });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
