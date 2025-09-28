import React, { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
// import './LoginForm.css'; // Removed: Replaced with Tailwind
import axios from 'axios';

function LoginForm({ isOpen, onClose, onForgotPasswordClick, onSignupClick, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
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
            // Using a relative path or defining base URL outside of localhost check for generality
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                email,
                password
            });
            
            const responseData = response.data;
            
            setIsSuccess(true);
            setMessage(responseData.message || 'Login successful!');
            
            if (responseData.token) {
                // Delay success action slightly to show the user the success message
                setTimeout(() => onLoginSuccess(responseData), 1000); 
            } else {
                setMessage("Login successful, but the authentication token is missing. Please try again.");
                setIsSuccess(false);
            }
        } catch (error) {
            setIsSuccess(false);
            if (error.response) {
                setMessage(error.response.data.message || 'An unexpected error occurred.');
            } else if (error.request) {
                setMessage('No response from the server. Please check your internet connection and the server status.');
            } else {
                setMessage('An error occurred during the request setup.');
            }
            console.error('Login error:', error);
        } finally {
            // Keep loading true for a moment if successful login, otherwise set false immediately
            if (!isSuccess) setLoading(false);
        }
    };

    if (!isOpen) {
        return null;
    }
    
    // Tailwind Modal Structure
    return (
        // Modal Container: fixed, full screen, dark overlay
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm'>
            
            {/* Login Form Card: Background Neutral color, rounded, max width */}
            <div className='bg-[#f4f5f6] text-[#333333] rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 relative'>
                
                <div className='p-8 md:p-10'>
                    
                    {/* Close Button */}
                    <button 
                        className='absolute top-4 right-4 text-gray-500 hover:text-red-500 text-3xl transition-colors' 
                        onClick={onClose}
                    >
                        &times;
                    </button>

                    {/* Header */}
                    <h3 className='text-2xl font-bold mb-6 text-[#333333]'>Sign in to your Journey</h3>
                    
                    <form className='space-y-6' onSubmit={handleSubmit}>
                        
                        {/* Email Field */}
                        <div className='space-y-1'>
                            <label htmlFor='email-address' className='text-sm font-medium text-[#333333]'>Email Address</label>
                            <input
                                type='email'
                                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9bb8a1] transition duration-200'
                                id='email-address'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        {/* Password Field */}
                        <div className='space-y-1'>
                            <label htmlFor='password' className='text-sm font-medium text-[#333333]'>Password</label>
                            <div className='relative'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9bb8a1] transition duration-200 pr-10'
                                    id='password'
                                    name='password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500 hover:text-[#008080]" onClick={togglePasswordVisibility}>
                                    {showPassword ? (
                                        <Eye size={20} />
                                    ) : (
                                        <EyeClosed size={20} />
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <div className='pt-2'>
                            <input 
                                type='submit' 
                                value={loading ? 'Loading...' : 'Sign in'} 
                                className={`
                                    w-full py-3 text-white font-bold rounded-lg shadow-md transition duration-300 cursor-pointer
                                    ${loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-[#008080] hover:bg-[#006666]'
                                    }
                                `} 
                                disabled={loading} 
                            />
                        </div>
                        
                        {/* Links (Forgot Password & Sign Up) */}
                        <div className='flex justify-between items-center text-sm pt-2'>
                            <a href='#forgot' onClick={onForgotPasswordClick} className='text-[#008080] hover:underline font-medium'>Forgot Password?</a>
                            <p className='text-gray-700'>
                                New to BetterMind? 
                                <a href='#signup' onClick={onSignupClick} className='text-[#008080] hover:underline font-semibold ml-1'>Sign up</a>
                            </p>
                        </div>
                        
                        {/* Message Display */}
                        {message && (
                            <p className={`mt-4 p-3 rounded-lg text-center font-medium ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;