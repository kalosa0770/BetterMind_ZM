import React, { useState } from 'react';
import axios from 'axios';
import './OTPVerificationForm.css'; // Add a CSS file for styling

const OTPVerificationForm = ({ isOpen, onClose, userId, onVerificationSuccess }) => {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify-otp', {
        userId,
        // The backend expects 'otp' as the key, not 'token'. This is a critical fix.
        otp,
      });

      // Handle success: store the JWT and redirect
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onVerificationSuccess(); // Call the parent function to handle redirection or state change
      }

    } catch (error) {
      // Handle invalid or expired OTP
      setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="otp-modal-container">
      <div className="otp-modal-form">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h3>Two-Factor Authentication</h3>
        <p>Please enter the 6-digit code sent to your phone number.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />
          </div>
          <button type="submit" className="verify-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <div className="resend-otp-section">
          {/* This is currently a placeholder link. You can add a new function
            to handle a resend request, which would call the login API again. */}
          <p>Didn't receive a code? <a href="#resend">Resend Code</a></p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationForm;