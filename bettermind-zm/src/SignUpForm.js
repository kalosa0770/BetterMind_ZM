import React, { useState } from "react";
import './SignUp.css';

const SignUpForm = ({ signUpOpen, signUpClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  
  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password
        })
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage('Sign-up successful! You can now log in.');
      } else {
        setMessage(data.msg || 'An error occurred during sign-up.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error. Please try again.');
    }
  };

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
              onChange={handleChange} 
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
              onChange={handleChange} 
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
              onChange={handleChange} 
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
              onChange={handleChange} 
              required 
            />
          </div>
          <div className='signup-form-details'>
            <label htmlFor='confirm-password'>Confirm Password</label>
             <input 
              type="password" 
              name="confirmPassword" 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChange={handleChange} 
              className='signup-input-details'
              required 
            />
          </div>

          <div className='form-details-checkbox'>
            <input type="checkbox" name="terms" id="terms-checkbox" className='signup-checkbox' />
            <label htmlFor='terms-checkbox'>I agree to the <a href="#terms-of-service">terms of service</a> and <a href="#privacy-policy">privacy policy</a> of BetterMind</label>
          </div>

          <div className='signup-btn'>
            <input type='submit' value='Sign up' className='signup-submit-btn' />
          </div>

          <div className='signup-other-details'>
            <p>Already have an account? <a href='#signin'>Sign in</a></p>
          </div>
        </form>

        {message && <p className="signup-message">{message}</p>}
      </div>
    </div>
  );
};

export default SignUpForm;