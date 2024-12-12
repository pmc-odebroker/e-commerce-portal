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
  const [user, setUser] = useState(null);
  const [token, setTokenInternal] = useState(null);

  // Retrieve the token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem("ACCESS_TOKEN");
    if (savedToken) {
      setTokenInternal(savedToken);
      console.log("Token loaded from localStorage:", savedToken);
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
