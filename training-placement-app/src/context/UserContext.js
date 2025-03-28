import React, { createContext, useContext, useState } from "react";

// Create the UserContext
const UserContext = createContext();

// UserProvider component to manage user state
export const UserProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "user"); // Initialize role from localStorage

  return (
    <UserContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to access user context
export const useUser = () => useContext(UserContext);
