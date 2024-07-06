import { useEffect, useState } from "react";
import axios from "axios";
import { Chat, ChatDetails, Autocomplete } from "../../components";
import "./Chats.css";
import { useAuth } from "../../providers";

export const Chats = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const { authToken } = useAuth();

  async function loadChats() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/chat`,
        { headers: { authorization: `Bearer ${authToken}` } }
      );

      setChats(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div className={selectedChat ? "list-container " : ""}>
      <div style={{ width: selectedChat ? "40%" : "100%", overflow: "auto" }}>
        <Autocomplete setSelectedChat={setSelectedChat} />
        <ul className="chat-container">
          {chats?.map((chat) => (
            <Chat
              key={chat._id}
              {...chat}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
            />
          ))}
        </ul>
      </div>
      {selectedChat && (
        <ChatDetails selectedChat={selectedChat} setChats={setChats} />
      )}
    </div>
  );
};
