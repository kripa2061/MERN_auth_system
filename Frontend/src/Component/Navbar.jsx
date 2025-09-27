import React, { useContext } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { assets } from "../assets/assets";
import { AppContext } from '../../Context';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { backendURL, isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData } = useContext(AppContext);
  const sendverificationotp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendURL + 'api/auth/send-verify-otp')
      if (data.success) {
        navigate("/verify-email");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }
const handleLogout = async () => {
  try {
    axios.defaults.withCredentials = true;
    const { data } = await axios.post(`${backendURL}api/auth/logout`);
    
    if (data.success) {
      setIsLoggedIn(false);
      setUserData(null); // or false if you prefer
      navigate('/');
      toast.success('Logged out successfully');
    } else {
      toast.error(data.message || 'Logout failed');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
};

  return (
    <div className="container">
      <div className="logo">
        <img
          src={assets.logo}
          onClick={() => navigate('/')}
          alt="Logo"
        />
      </div>
      <div className="login">
        {!isLoggedIn ? (
          <button onClick={() => navigate('/login')}>
            Login <img src={assets.arrow_icon} alt="arrow" />
          </button>
        ) : (
          <div className="logout">
            {userData && userData.name[0].toUpperCase()}
            <ul>
              {!userData?.isAccountVerify &&
                <li onClick={sendverificationotp}>Verify Email</li>
              }
  
              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}

export default Navbar;