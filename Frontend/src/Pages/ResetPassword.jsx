import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../../Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ResetPassword.css';

const ResetPassword = () => {
  const { backendURL, setUserData, setIsLoggedIn, getUserData } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const [isemailsent, setIsemailsent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isotpsubmitted, setIsotpsubmitted] = useState(false);

  const navigate = useNavigate();

  const [newPassword, setnewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [OTP, setOTP] = useState(Array(6).fill(''));

  const inputRefs = useRef([]);

  // Submit new password with OTP
  const handlePasswordsubmit = async (e) => {
    e.preventDefault();
    try {
      if (!otp || !newPassword || !email) return toast.error("All fields required");
      
      const { data } = await axios.post(
        backendURL + 'api/auth/reset-password',
        { email, otp, newPassword }
      );

      data.success
        ? toast.success(data.message) && navigate("/login")
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Send reset OTP to email
  const handlesubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        backendURL + 'api/auth/send-reset-otp',
        { email }
      );

      data.success
        ? (toast.success(data.message), setIsemailsent(true))
        : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Handle OTP inputs
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

  // Submit OTP before entering new password
  const handleOTPsubmit = (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((input) => input.value);
    setOtp(otpArray.join('')); // Join as string
    setIsotpsubmitted(true);
    toast.success("OTP Verified. You can now reset your password.");
  };

  return (
    <div className="reset-container">
      <div className="connect-container">
        <img src={assets.logo} onClick={() => navigate('/')} alt="Logo" />
      </div>

      {/* Email input form */}
      {!isemailsent &&
        <div className="email-form">
          <div className="text-reset">
            <h3>Reset Password</h3>
            <p>Enter your Email Address</p>
          </div>
          <div className="reset-input">
            <div className="input-group">
              <img src={assets.mail_icon} className="input-icon" alt="mail" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="reset-submit-button">
            <button className="submit-reset" onClick={handlesubmitEmail}>
              Submit
            </button>
          </div>
        </div>
      }

      {/* OTP input form */}
      {!isotpsubmitted && isemailsent &&
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
      }

      {/* New password form */}
      {isemailsent && isotpsubmitted &&
        <div className="new-password-container">
          <h3>Reset New Password</h3>
          <p>Enter new password</p>
          <div className="input-group">
            <img src={assets.lock_icon} className="input-icon" alt="lock" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div className="new-password-button">
            <button onClick={handlePasswordsubmit}>Submit</button>
          </div>
        </div>
      }
    </div>
  );
};

export default ResetPassword;
