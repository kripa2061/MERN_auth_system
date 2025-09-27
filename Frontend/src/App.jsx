import React from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import ResetPassword from './Pages/ResetPassword';
import EmailVerify from './Pages/EmailVerify';

// Set axios to send cookies with every request
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerify />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
