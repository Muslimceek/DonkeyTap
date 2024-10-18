import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  return (
    <div className="fixed-nav">
      <Link to="/" className="nav-button">
        <div className="blob1"></div>
        <div className="blob2"></div>
        <img src="https://i.ibb.co/7jz58vG/Component-3.png" alt="Home" />
        <p>Home</p>
      </Link>
      <Link to="/friends" className="nav-button">
        <div className="blob1"></div>
        <div className="blob2"></div>
        <img src="https://i.ibb.co/2gMj8gy/friends-icon-on-a-white-background-gold-icon-1.png" alt="Friends" />
        <p>Friends</p>
      </Link>
      <Link to="/earn" className="nav-button">
        <div className="blob1"></div>
        <div className="blob2"></div>
        <img src="https://i.ibb.co/L943fxb/coin-icon-on-the-round-coin-inside-there-and-a-lot-1.png" alt="Earn" />
        <p>Earn</p>
      </Link>
    </div>
  );
};

export default Navigation;