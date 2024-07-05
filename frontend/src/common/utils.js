export const getOtherUserDetailsInChat = (loggedInUser, usersInChat) => {
  return loggedInUser._id === usersInChat[0]._id
    ? usersInChat[1]
    : usersInChat[0];
};
