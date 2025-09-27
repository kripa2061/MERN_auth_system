import React, { useState, useRef, useContext } from 'react';
import './EmailVerify.css';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context';

const EmailVerify = () => {
  const { backendURL, setUserData,setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const [OTP, setOTP] = useState(Array(6).fill(''));
  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    const val = e.target.value;
    if (/^[0-9]?$/.test(val)) {
      const newOTP = [...OTP];
      newOTP[index] = val;
      setOTP(newOTP);
      if (val && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && OTP[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6);
    const newOTP = [...OTP];
    paste.split('').forEach((char, idx) => {
      if (/^[0-9]$/.test(char) && idx < 6) {
        newOTP[idx] = char;
        if (inputRefs.current[idx]) inputRefs.current[idx].value = char;
      }
    });
    setOTP(newOTP);
  };

  const handleOTPsubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendURL}api/auth/verify-email`, { OTP: OTP.join('') });
      if (data.success) {
        toast.success(data.message);
        setUserData(data.user || {});
        setIsLoggedIn(true);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="email-verify-container">
      <div className="otp-logo">
        <img src={assets.logo} alt="Logo" />
      </div>
      <div className="OTP-form">
        <div className="text">
          <h3>Verification OTP</h3>
          <p>Enter 6 digit OTP for verification</p>
        </div>
        <div className="get-otp" onPaste={handlePaste}>
          {OTP.map((val, index) => (
            <input
              type="text"
              maxLength={1}
              key={index}
              value={val}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
        <div className="otp-submit-button">
          <button className="submit" onClick={handleOTPsubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;



