import { createContext, useContext, useState, useEffect } from "react";

// Create the context with initial values
const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

// Define the provider component
export const ContextProvider = ({ children }) => {
  const [user, setUserInternal] = useState(null);
  const [token, setTokenInternal] = useState(null);

  // Retrieve the token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("ACCESS_TOKEN");
    if (savedToken) {
      setTokenInternal(savedToken);
      console.log("Token loaded from localStorage:", savedToken);
    }

    // Optionally, retrieve user data if it's stored in localStorage or another session store
    const savedUser = localStorage.getItem("USER_DATA");
    if (savedUser) {
      setUserInternal(JSON.parse(savedUser));  // Assuming user data is stored as a JSON string
      console.log("User data loaded from localStorage:", savedUser);
    }
  }, []);

  // Function to handle token updates
  const setToken = (newToken) => {
    setTokenInternal(newToken);
    if (newToken) {
      if (!localStorage.getItem("ACCESS_TOKEN")) {
        localStorage.setItem("ACCESS_TOKEN", newToken);
        console.log("Token saved to localStorage.");
      }
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
      console.log("Token removed from localStorage.");
    }
  };

  // Function to handle user updates
  const setUser = (newUser) => {
    setUserInternal(newUser);
    if (newUser) {
      localStorage.setItem("USER_DATA", JSON.stringify(newUser));
      console.log("User data saved to localStorage.");
    } else {
      localStorage.removeItem("USER_DATA");
      console.log("User data removed from localStorage.");
    }
  };

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Hook to access the context
export const useStateContext = () => useContext(StateContext);

export default ContextProvider;
