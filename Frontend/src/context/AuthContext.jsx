import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Initial load: LocalStorage se data uthao
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== "undefined") {
      setUser(JSON.parse(savedUser));
    }
  }, []);
// AuthContext.js ke andar login function aisa hona chahiye:
const login = (userData, token) => {
    // 1. State update karo (Taaki Header turant badle)
    setUser(userData);
    
    // 2. LocalStorage update karo (Taaki refresh par data na jaye)
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData)); 
};
  // User update karne ka function
  const updateUserData = (newData) => {
    setUser(newData);
    localStorage.setItem('user', JSON.stringify(newData));
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, updateUserData, logout,login}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);