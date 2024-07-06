import { useState } from "react";
import axios from "axios";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../providers";

import "./Autocomplete.css";

export const Autocomplete = (props) => {
  const { setSelectedChat } = props;
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debounce = useDebounce();

  const { authToken, authUser } = useAuth();

  const loadSearchResults = async (searchText) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND}/user?search=${searchText}`,
        {
          headers: { authorization: `Bearer ${authToken}` },
        }
      );

      if (data.length === 0) {
        setSearchResults([
          { _id: 0, firstName: "No search result is found", lastName: "" },
        ]);
        return;
      }

      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedSearch = debounce(loadSearchResults, 300);

  const changeSearchText = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);

    if (searchText === "") {
      setSearchResults([]);
      return;
    }

    debouncedSearch(searchText);
  };

  const selectSearchResult = async (selectedSearchResult) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP_BACKEND}/chat/${selectedSearchResult._id}`,
      { headers: { authorization: `Bearer ${authToken}` } }
    );

    if (data) {
      setSelectedChat(data);
    } else {
      setSelectedChat({ _id: "new", users: [selectedSearchResult, authUser] });
    }

    setSearchText("");
    setSearchResults([]);
  };

  return (
    <div className="search-bar">
      <label htmlFor="search">Filter by Title / Order ID</label>
      <input
        id="search"
        type="search"
        placeholder="Start typing to search users"
        onChange={changeSearchText}
        value={searchText}
        className="search-box"
      />
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((searchResult) => {
            const { _id, firstName, lastName } = searchResult;

            return (
              <li
                className="search-result"
                key={_id}
                onClick={() => selectSearchResult(searchResult)}
              >
                {`${firstName} ${lastName}`}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
