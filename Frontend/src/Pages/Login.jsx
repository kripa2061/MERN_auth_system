import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import "./login.css"
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context';
import axios from 'axios';
import { toast } from 'react-toastify';
  

const Login = () => {
  const { backendURL, setIsLoggedIn, getUserData} = useContext(AppContext);
  const [state, setState] = useState("signup"); 
  const [email, setEmail] = useState('');     
  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      if (state === 'signup') {
        const { data } = await axios.post(
          backendURL + 'api/auth/register',
          { name, email, password }
        );

        if (data.success) {
          setIsLoggedIn(true);
           getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          backendURL + 'api/auth/login',
          { email, password }
        );

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-page">
      <div className="navbar-logo">
           <img 
                  src={assets.logo} 
                  onClick={() => navigate('/')} 
                  alt="Logo" 
                 
                />
      </div>

      <div className="login-form-box">
        <div className="login-content">
          <h1>{state === "signup" ? "Create Account" : "Login"}</h1>
          <p>{state === "signup" ? "Create your account" : "Login into your account"}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {state === "signup" && (
            <div className="input-group">
              <img src={assets.person_icon} className="input-icon" alt="person"/>
              <input 
                type="text" 
                onChange={(e)=>setName(e.target.value)}
                value={name}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="input-group">
            <img src={assets.mail_icon} className="input-icon" alt="mail"/>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <img src={assets.lock_icon} className="input-icon" alt="lock"/>
            <input 
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <span className="link" onClick={() => navigate('/reset-password')}>Forgot password?</span>

          <button type="submit">{state === "signup" ? "Sign Up" : "Login"}</button>
        </form>

        {state === "signup" ? (
          <p>Already have an account? <span className="link" onClick={() => setState("login")}>Login here</span></p>
        ) : (
          <p>Don't have an account? <span className="link" onClick={() => setState("signup")}>Sign Up</span></p>
        )}
      </div>
    </div>
  )
}

export default Login;
