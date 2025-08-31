import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from './assets/bettermind-logo-removebg-preview.png';
import { useState } from 'react';

// the onLoginClick is the function passed from App.js
function Header({onLoginClick}) {

    const [openMenu, setOpenMenu] = useState(false);
    
    const toggleMenuList = () => {
        
            setOpenMenu(!openMenu)
        
    }

    return (
        <header className="App-header">
            <div className='large-screens'>
                <div className="logo-container">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className='logo-name'>BetterMind Zm</h1>
                </div>
                <div className="nav-links">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#services">Services</a>
                    <a href="#contact">Contact</a>
                    <div className="auth-buttons">
                        <button className="login-btn" onClick={(e) =>
                                {
                                    e.preventDefault(); // prevents link from navigating
                                    onLoginClick(); //calls the onLoginClick prop function to open the modal
                                } }>Sign in</button>
                        <button className="signup-btn">Sign Up</button>
                    </div>
                </div>
            </div>
            {/* Mobile Screens */}
            <div className='mobile-screens'>
                <div className="mobile-logo-container">
                    <img src={logo} className="mobile-App-logo" alt="logo" />
                    <h1 className='mobile-logo-name'>BetterMind Zm</h1>
                </div>
                <div className='menu-bar'>
                   <button className='fa-bars'> <FontAwesomeIcon icon={['fas', 'stream']} onClick={toggleMenuList} /> </button> 
                </div>
                <nav className={`mobile-nav-links ${openMenu ? 'open' : ''}`}>
                    <ul>
                        <button><FontAwesomeIcon icon={['fas', 'times']} onClick={toggleMenuList} className='close-menu' /></button>
                        <div className='mobile-links'>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </div>
                        <div className="mobile-auth-buttons">
                            <li><a href="#login"className="mobile-login-btn" onClick={(e) =>
                                {
                                    e.preventDefault(); // prevents link from navigating
                                    onLoginClick(); //calls the onLoginClick prop function to open the modal
                                }
                            }>Sign in</a></li>
                            <li><a href='signup.js' className="mobile-signup-btn">Sign Up</a></li>
                            
                            
                        </div>
                    </ul>
                    
                </nav>
            </div>
        </header>
    )
}

export default Header;