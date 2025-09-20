import React, { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import api from '../api/axios.js';
import './LoginForm.css';

function LoginForm({ isOpen, onClose, onForgotPasswordClick, onSignupClick, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // State to hold the user message
    const [isSuccess, setIsSuccess] = useState(false); // State to track success or failure
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // set password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); // Clear previous messages
        setIsSuccess(false);

        try {
            const response = await api.post('/auth/login', { email, password });

            // Success: The backend sent a 200 OK status. Our new backend now returns a userId for 2FA.
            if (response.data.userId) {
                setIsSuccess(true);
                setMessage(response.data.message);

                // IMPORTANT: We now pass the userId to the parent handler
                onLoginSuccess(response.data.userId);
            } else {
                // This case handles a malformed successful response without a userId.
                setIsSuccess(false);
                setMessage("An unexpected response was received. Please try again.");
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
        <div className={`login-container ${isOpen ? 'show' : ''}`}>
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
                                type={showPassword ? 'text' : 'password'}
                                className='login-input-details'
                                id='password'
                                name='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} />
                            {showPassword ? (
                                <Eye onClick={togglePasswordVisibility} className='eye-icon' />
                            ) : (
                                <EyeClosed onClick={togglePasswordVisibility} className='eye-icon' />
                            )}
                        </div>
                    </div>
                    <div className='signin-btn'>
                        <input type='submit' value={loading ? 'Loading...' : 'Sign in'} className='submit-btn' disabled={loading} />
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
        </div>
    )
}

export default LoginForm;
