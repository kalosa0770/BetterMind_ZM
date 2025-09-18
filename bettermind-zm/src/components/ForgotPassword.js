import React, {useState} from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const ForgotPassword = ({isOpen, onClose}) => {
    const [enterEmail, setEnterEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isMessageSuccess, setIsMessageSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const submitEmail = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const hostname = window.location.hostname;
        const baseURL = (hostname === 'localhost' || hostname === '127.0.0.1') ? 'http://localhost:3001' : `http://${hostname}:3001`;

        const forgotPasswordUrl = `${baseURL}/api/auth/forgot-password`;

        try {
            const response = await axios.post(forgotPasswordUrl,  { enterEmail });
            setMessage(response.data.message);
            setIsMessageSuccess(true);
            setEnterEmail('');

        }catch (errors) {
            setMessage(errors.response?.data?.message || 'An error occured. Please try again later.');
            setIsMessageSuccess(false);
        } finally {
            setLoading(false)
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className='forgot-password-container'>
            <div className='forgot-password-form'>
                <button className='close-btn' onClick={onClose}><X /></button>
                <h3>Forgot Password?</h3>
                <p>Enter your email to receive a password reset link.</p>
                <form onSubmit={submitEmail}>
                    <div className='form-details'>
                        <label htmlFor='email-address'>Email Address</label>
                        <input type='email' className='input-details' name='email' 
                                value={enterEmail} onChange={(e) => setEnterEmail(e.target.value)} required
                        />
                    </div>
                    <div className='submit-btn-container'>
                        <button type='submit' className='submit-btn' disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'} </button>
                    </div>
                </form>

                {message && (
                    <p className={`message ${isMessageSuccess ? 'success' : 'error'}`}> {message}</p>
                )}
            </div>
        </div>
    );
}; 

export default ForgotPassword;