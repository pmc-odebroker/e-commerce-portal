// src/contexts/ContextProvider.jsx
import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    currentUser: null,
    token: null,
    role: null, // Added role to the context
    setUser: () => {},
    setToken: () => {},
    setRole: () => {}, // Added setRole
});

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, _setToken] = useState(null);
    const [role, setRole] = useState(null); // State for role

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    return (
        <StateContext.Provider
            value={{
                user,
                token,
                role,
                setUser,
                setToken,
                setRole,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
export default ContextProvider;