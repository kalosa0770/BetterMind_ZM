import React, { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import './LoginForm.css';
import axios from 'axios';

function LoginForm({ isOpen, onClose, onForgotPasswordClick, onSignupClick, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // State to hold the user message
    const [isSuccess, setIsSuccess] = useState(false); // State to track success or failure
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

     const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setIsSuccess(false);

        try {
            // Axios automatically handles JSON parsing and will throw an error
            // for non-2xx status codes.
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                email,
                password
            });
            
            // If the request is successful (2xx status code), the code continues here.
            // The parsed JSON data is available directly in response.data.
            const responseData = response.data;
            
            setIsSuccess(true);
            setMessage(responseData.message || 'Login successful!');
            
            // The backend now sends the token directly upon successful login.
            if (responseData.token) {
                onLoginSuccess(responseData);
            } else {
                setMessage("Login successful, but the authentication token is missing. Please try again.");
                setIsSuccess(false);
            }
        } catch (error) {
            // This catch block handles both network errors and non-2xx status codes
            // thrown by Axios.
            setIsSuccess(false);
            // Check if the error has a response from the server.
            if (error.response) {
                // The server responded with a status code outside the 2xx range.
                // The error message is in error.response.data.message.
                setMessage(error.response.data.message || 'An unexpected error occurred.');
            } else if (error.request) {
                // The request was made but no response was received (e.g., server is down).
                setMessage('No response from the server. Please check your internet connection and the server status.');
            } else {
                // Something happened in setting up the request that triggered an error.
                setMessage('An error occurred during the request setup.');
            }
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
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
                        <a href='#forgot' onClick={onForgotPasswordClick}>Forgot Password?</a>
                        <p>New to BetterMind?<a href='#signup' onClick={onSignupClick}>Sign up</a></p>
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
