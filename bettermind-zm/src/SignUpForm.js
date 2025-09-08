import React, { useState } from "react";
import './SignUp.css';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const SignUpForm = ({ signUpOpen, signUpClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState("");
  // const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(''); // Clear any previous messages

    if (!termsAccepted) {
      setMessage("You must agree to the terms of service and privacy policy.");
      return;
    }

    axios.post('http://localhost:3001/api/auth/register', {firstName, lastName, email, password})
    .then(result => {
      console.log(result);
      if (result.status === 201) {
        setMessage("Registration successful! You can now log in.");
        // Optional: Navigate to login page after successful registration
        // navigate('/login');
      } else {
        setMessage(result.data.msg || "An unexpected error occurred during registration.");
      }
    })
    .catch(err => {
      console.error(err);
      if (err.response && err.response.data && err.response.data.msg) {
        setMessage(err.response.data.msg);
      } else {
        setMessage("An error occurred during registration.");
      }
    });

    // Reset form fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setTermsAccepted(false);
  }

  if (!signUpOpen) {
      return null;
  }
  return (
    <div className='signup-container'>
      <div className='signup-form'>
        <button className='signup-close-btn' onClick={signUpClose}>&times;</button>
        <h3>Sign up for a better mind</h3>
        <p>Join BetterMind ZM today and connect your mental wellness to a peaceful journey</p>
        <form className='signup-form-container' onSubmit={handleSubmit}>
          {/* Change 1: Added First Name input */}
          <div className='signup-form-details'>
            <label htmlFor='first-name'>First Name</label>
             <input 
              type="text" 
              name="firstName" 
              placeholder="First Name" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)}
              className='signup-input-details'
              required 
            />
          </div>
          {/* Change 2: Added Last Name input */}
          <div className='signup-form-details'>
            <label htmlFor='last-name'>Last Name</label>
             <input 
              type="text" 
              name="lastName" 
              placeholder="Last Name" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              className='signup-input-details'
              required 
            />
          </div>
          <div className='signup-form-details'>
            <label htmlFor='email-address'>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className='signup-input-details'
              required 
            />
          </div>
          <div className='signup-form-details'>
            <label htmlFor='password'>Password</label>
             <input 
              className='signup-input-details'
              type="password" 
              name="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className='form-details-checkbox'>
            <input 
              type="checkbox" 
              name="termsAccepted"
              className='signup-checkbox' 
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
             />
            <label htmlFor='terms-checkbox'>I agree to the <a href="#terms-of-service">terms of service</a> and <a href="#privacy-policy">privacy policy</a> of BetterMind</label>
          </div>

          <div className='signup-btn'>
            <input type='submit' value='Sign up' className='signup-submit-btn' />
          </div>

          <div className='signup-other-details'>
            <p>Already have an account? <a href="LoginForm.js">Sign in</a></p>
          </div>
        </form>

        {message && <p className="signup-message">{message}</p>}
      </div>
    </div>
  );
};

export default SignUpForm;
