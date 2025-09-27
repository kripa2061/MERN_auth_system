import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import './Header.css';
import { AppContext } from '../../Context';

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className="header">
      <div className="img-header">
        <img src={assets.header_img} alt="Header" />
      </div>
      <div className="content-header">
        <p>
          Hey {userData? userData.name:"Developer"} <img src={assets.hand_wave} alt="Wave" />
        </p>
        <h3>Welcome to our app</h3>
        <span>
          Let's start with a quick product tour and we will have you up and running in no time!
        </span>
      </div>
    </div>
  );
};

export default Header;
