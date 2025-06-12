const { user_status_enum } = require("../consts");
const User = require("../db/userModel");

// Add user to matchmaking queue
const addUserToQueue = async (user) => {
  const existingUser = await User.findOne({ chatId: user.chatId });
  if (!existingUser) {
    return await User.create({
      chatId: user.chatId,
      firstName: user.firstName,
      status: user.status || user_status_enum.idle,
    });
  }

  existingUser.status = user.status || user_status_enum.idle;
  existingUser.matchedWith = null;
  return await existingUser.save();
};

// Match users
const matchUsers = async () => {
  const users = await User.find({ status: user_status_enum.available }).limit(2);
  if (users.length === 2) {
    const [user1, user2] = users;
    user1.status = user_status_enum.matched;
    user2.status = user_status_enum.matched;
    user1.matchedWith = user2.chatId;
    user2.matchedWith = user1.chatId;
    await user1.save();
    await user2.save();
    return { user1, user2 };
  }
  return null;
};

// Remove match
const removeMatch = async (chatId) => {
  const user = await User.findOne({ chatId });
  if (user && user.matchedWith) {
    const matchedUser = await User.findOne({ chatId: user.matchedWith });
    user.status = user_status_enum.idle;
    user.matchedWith = null;
    matchedUser.status = user_status_enum.idle;
    matchedUser.matchedWith = null;
    await user.save();
    await matchedUser.save();
    return [user.chatId, matchedUser.chatId]; // return both chatIds
  }
  return [chatId]; // if no match, just return the current user
};

// put user at idle mode
const pauseUser = async (chatId) => {
  const user = await User.findOne({ chatId });
  if (user) {
    user.status = "idle";
    user.matchedWith = null;
    await user.save();
    return true;
  }
  return false;
};

module.exports = { addUserToQueue, matchUsers, removeMatch, pauseUser };
