import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../providers";
import { getOtherUserDetailsInChat } from "../../common/utils";
import axios from "axios";

import "./ChatDetails.css";

export const ChatDetails = (props) => {
  const {
    selectedChat: { _id: selectedChatId, users },
    setChats,
  } = props;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { authToken, authUser } = useAuth();

  async function loadMessages() {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/message/${selectedChatId}`,
        { headers: { authorization: `Bearer ${authToken}` } }
      );

      setMessages(data);
      scrollToBottom();
    } catch (error) {
      console.error(error);
    }
  }

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (selectedChatId === "new") {
      setMessages([]);
      return;
    }

    loadMessages();
  }, [selectedChatId]);

  const sendMessage = async () => {
    try {
      let chatId = selectedChatId;
      if (chatId === "new") {
        const otherUser = getOtherUserDetailsInChat(authUser, users);
        const { data } = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND}/chat/${otherUser._id}`,
          {},
          { headers: { authorization: `Bearer ${authToken}` } }
        );
        chatId = data._id;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/message/`,
        { content: newMessage, chatId },
        { headers: { authorization: `Bearer ${authToken}` } }
      );
      if (response.status === 200) {
        const message = {
          _id: crypto.randomUUID(),
          sender: { _id: authUser._id },
          content: newMessage,
          updatedAt: Date.now(),
        };

        setMessages((messages) => [...messages, message]);
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat._id === selectedChatId
              ? {
                  ...chat,
                  latestMessage: { ...chat.latestMessage, content: newMessage },
                }
              : chat
          )
        );
        setNewMessage("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const messageInputKeydownHandler = (e) => {
    if (e.key === "Enter" && newMessage) {
      sendMessage();
    }
  };

  if (!selectedChatId) {
    return <p>Loading...</p>;
  }

  return (
    <div className="single-chat">
      <div className="single-chat-heading">
        <div className="avatar">
          {getOtherUserDetailsInChat(
            authUser,
            users
          ).firstName[0].toUpperCase()}
        </div>
        <h2>{getOtherUserDetailsInChat(authUser, users).firstName}</h2>
      </div>

      <ul className="message-container">
        {messages.map((textMessage) => (
          <li
            className={`message ${
              textMessage.sender._id !== authUser._id
                ? "bot-message"
                : "user-message"
            }`}
            key={textMessage._id}
          >
            <div>{textMessage.content}</div>
            <div className="message-time">
              {new Date(textMessage.updatedAt).toLocaleTimeString()}
            </div>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>

      <section className="send-message-section">
        <input
          style={{ width: "98%" }}
          type="text"
          placeholder="Type a message & press enter to send..."
          className="message-input"
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={messageInputKeydownHandler}
          value={newMessage}
        />
      </section>
    </div>
  );
};
