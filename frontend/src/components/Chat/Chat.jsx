import { useAuth } from "../../providers";
import { getOtherUserDetailsInChat } from "../../common/utils";
import "./Chat.css";

export const Chat = (props) => {
  const { _id, users, latestMessage, selectedChat, setSelectedChat } = props;

  const { authUser } = useAuth();

  return (
    <li
      className={`container ${
        selectedChat?._id === _id ? "selected-chat" : ""
      }`}
      onClick={() => setSelectedChat(props)}
    >
      <div className="mr-1">
        <div className="avatar">
          {getOtherUserDetailsInChat(
            authUser,
            users
          ).firstName[0].toUpperCase()}
        </div>
      </div>
      <div className="chat-details">
        <p>{getOtherUserDetailsInChat(authUser, users).firstName}</p>
        {latestMessage && <p>{latestMessage.content}</p>}
      </div>
      {/* <div style={{ marginLeft: "auto" }}>
        {new Date(latestMessageTimestamp).toLocaleDateString()}
      </div> */}
    </li>
  );
};
