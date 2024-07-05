import { useEffect, useState } from "react";
import axios from "axios";
import { Chat, ChatDetails } from "../../components";
import "./Chats.css";
import { useAuth } from "../../providers";

export const Chats = () => {
  const [chats, setChats] = useState([]);
  const [searchText, setSearchText] = useState("");
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

  const changeSearchText = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className={selectedChat ? "list-container " : ""}>
      <div style={{ width: selectedChat ? "40%" : "100%", overflow: "auto" }}>
        <div className="search-bar">
          <label htmlFor="search" className="search-label">
            Filter by Title / Order ID
          </label>
          <input
            id="search"
            type="search"
            placeholder="Start typing to search"
            onChange={changeSearchText}
            value={searchText}
            className="search-box"
          />
        </div>
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
