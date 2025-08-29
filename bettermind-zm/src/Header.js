import './Header.css';
import logo from './assets/bettermind-logo-removebg-preview.png';

function Header() {
    return (
        <header className="App-header">
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
                    <button className="login-btn">Login</button>
                    <button className="signup-btn">Sign Up</button>
                </div>
            </div>
        </header>
    )
}

export default Header;