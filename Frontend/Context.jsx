import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  axios.defaults.withCredentials = true;
  const backendURL = import.meta.env.VITE_BACKEND_URL;


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendURL + 'api/user/data');
      if (data.success) setUserData(data.userData);
      else toast.error(data.message || 'Failed to fetch user data');
    } catch (error) {
      toast.error(error.message);
    }
  };



const getUserAuth = async () => {
  try {
    const { data } = await axios.get(backendURL + 'api/auth/isAuth', { withCredentials: true });
    if (data.success) {
      setIsLoggedIn(true);
      setUserData(data.user); // <-- make sure backend sends `user`
    } else {
      setIsLoggedIn(false);
    }
  } catch (error) {
    setIsLoggedIn(false);
  }
};



  useEffect(() => {
    getUserAuth();
  }, []);

  const value = {
    backendURL,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    getUserAuth
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
