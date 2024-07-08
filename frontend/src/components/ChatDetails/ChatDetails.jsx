import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../providers";
import { getOtherUserDetailsInChat } from "../../common/utils";
import axios from "axios";
import io from "socket.io-client";

import "./ChatDetails.css";

let socket;
export const ChatDetails = (props) => {
  const {
    selectedChat: { _id: selectedChatId, users },
    setChats,
  } = props;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(selectedChatId);

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
    socket = io(import.meta.env.VITE_APP_BACKEND_URI, {
      transports: ["websocket"],
    });
    socket.emit("setup", authUser);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  const onMessageReceived = (newMessage) => {
    if (selectedChatId === newMessage.chat._id) {
      setMessages((messages) => [...messages, newMessage]);
      updateLatestMessage(newMessage.content);
    }
  };

  useEffect(() => {
    socket.on("messageReceived", onMessageReceived);

    return () => {
      socket.off("messageReceived", onMessageReceived);
    };
  }, [socket]);

  useEffect(() => {
    if (selectedChatId === "new") {
      setMessages([]);
    } else {
      loadMessages();
    }

    socket.emit("joinChat", selectedChatId);
  }, [selectedChatId]);

  const updateLatestMessage = (message) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat._id === selectedChatId
          ? {
              ...chat,
              latestMessage: { ...chat.latestMessage, content: message },
            }
          : chat
      )
    );
  };

  const sendMessage = async () => {
    try {
      if (chatRef.current === "new") {
        const otherUser = getOtherUserDetailsInChat(authUser, users);
        const { data } = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND}/chat/${otherUser._id}`,
          {},
          { headers: { authorization: `Bearer ${authToken}` } }
        );
        chatRef.current = data._id;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND}/message/`,
        { content: newMessage, chatId: chatRef.current },
        { headers: { authorization: `Bearer ${authToken}` } }
      );
      if (response.status === 200) {
        setMessages((messages) => [...messages, response.data]);
        socket.emit("newMessageReceived", response.data);
        updateLatestMessage(newMessage);
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
