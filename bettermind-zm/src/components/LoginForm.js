import React from 'react';
import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Eye, EyeClosed} from 'lucide-react';

function LoginForm({isOpen, onClose, onForgotPasswordClick, onSignupClick}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // State to hold the user message
    const [isSuccess, setIsSuccess] = useState(false); // State to track success or failure
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // set password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); // Clear previous messages

        // Get the current hostname from the browser
        const hostname = window.location.hostname;
        
        // Use a conditional to choose the correct base URL
        let baseURL;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            baseURL = `http://localhost:3001`;
        } else {
            // Use the dynamic hostname for other devices
            baseURL = `http://${hostname}:3001`;
        }

        // The full API endpoint
        const loginURL = `${baseURL}/api/auth/login`;

        try {
            const response = await axios.post(loginURL, { email, password });
            
            // Success: The backend sent a 200 OK status
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setIsSuccess(true);
                setMessage(response.data.message);
                navigate('/dashboard');
            } else {
                // This case handles a malformed successful response without a token.
                setIsSuccess(false);
                setMessage("Login failed: No token received from the server.");
            }
        } catch (error) {
            // Failure: The backend sent a non-200 status (e.g., 401, 429, 500)
            setIsSuccess(false);
            
            if (error.response) {
                // The API responded with an error message
                setMessage(error.response.data.message);
            } else if (error.request) {
                // The request was made but no response was received (network error)
                setMessage('Network error. Please check your internet connection.');
            } else {
                // Something else happened in setting up the request
                setMessage('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        onClose(); // closing the login modal
        onForgotPasswordClick(); //Opens the forgot password modal
    };

    const handleSignUpClick = (e) => {
        e.preventDefault();
        onClose(); // closing the login modal
        onSignupClick(); //Opens the signup modal
    };

    if (!isOpen) {
        return null; //Does not render anything if the modal is not open
    }

    return (
        <div className='login-container'>
            <div className='login-form'>
                <button className='close-btn' onClick={onClose}>&times;</button>
                <h3>Sign in to your Journey</h3>
                <form className='form-container' onSubmit={handleSubmit}>
                    <div className='login-form-details'>
                        <label htmlFor='email-address'>Email Address</label>
                        <input 
                            type='email' 
                            className='login-input-details' 
                            id='email-address'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='login-form-details'>
                        <label htmlFor='password'>Password</label>
                        <div className='password-fields'>
                            <input 
                            type={ showPassword ? 'text' : 'password' }
                            className='login-input-details'
                            id='password'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                            {showPassword ? (
                                <Eye onClick={togglePasswordVisibility} className='eye-icon'/>
                            ) : (
                                <EyeClosed onClick={togglePasswordVisibility } className='eye-icon'/>
                            )}
                        </div>
                    </div>
                    <div className='login-btn'>
                        <input type='submit' value='Sign in' className='submit-btn' disabled={loading}/>
                    </div>
                    <div className='other-details'>
                        <a href='#forgot' onClick={handleForgotPasswordClick}>Forgot Password?</a>
                        <p>New to BetterMind?<a href='#signup' onClick={handleSignUpClick}>Sign up</a></p>
                    </div>
                    {/* Display the message to the user based on the state */}
                    {message && (
                        <p className={isSuccess ? 'success-message' : 'error-message'}>
                            {message}
                        </p>
                    )}
                </form>
            </div>

            {/* <ForgotPassword /> */}
        </div>
    )
}

export default LoginForm;