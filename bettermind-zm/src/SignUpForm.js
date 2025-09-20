import React, { useState } from "react";
import './SignUp.css';
import axios from 'axios';
import { EyeClosed, Eye } from "lucide-react";

const SignUpForm = ({ signUpOpen, signUpClose, onLoginClick }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [validationField, setValidationField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validates the password against a more secure policy
  const validatePassword = (password) => {
    setPasswordValidation({
      minLength: password.length >= 6,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%&*?]/.test(password),
    });
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  // show password validation after user clicks the password field
  const showValidationField = () => {
    setValidationField(true);
  };
  
  // function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    if (!termsAccepted) {
      setMessage("You must agree to the terms of service and privacy policy.");
      setLoading(false);
      return;
    }

    const hostname = window.location.hostname;
    const baseURL = (hostname === 'localhost' || hostname === '127.0.0.1')
      ? 'http://localhost:3001'
      : `http://${hostname}:3001`;

    const registerURL = `${baseURL}/api/auth/register`;

    try {
      const response = await axios.post(registerURL, { firstName, lastName, email, password, phoneNumber });
      if (response.status === 201) {
        setMessage("Registration successful! You can now log in.");
        setIsSuccess(true);
      } else {
        setMessage(response.data.msg || "An unexpected error occurred during registration.");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.msg) {
        setMessage(err.response.data.msg);
      } else if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = err.response.data.errors.map(error => error.msg).join(' ');
        setMessage(validationErrors);
      } else {
        setMessage("An error occurred during registration.");
      }
      setIsSuccess(false);
    } finally {
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPhoneNumber(""); // Clear the phone number field on submission
      setTermsAccepted(false);
      setLoading(false);
    }
  };

  const loginClick = (e) => {
    e.preventDefault();
    signUpClose();
    onLoginClick();
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
            <label htmlFor='phone-number'>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (e.g., +26097xxxxxxx)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className='signup-input-details'
              required
            />
          </div>
          <div className='signup-form-details'>
            <label htmlFor='password'>Password</label>
            <div className="password-field">
              <input
                className='signup-input-details'
                // Conditionally set the input type
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }}
                onClick={showValidationField}
                required
              />
              {showPassword ? (
                <Eye className="eye-icon" onClick={togglePasswordVisibility} />
              ) : (
                <EyeClosed className="eye-icon" onClick={togglePasswordVisibility} />
              )}
            </div>
            {validationField &&
              <div className="password-validation">
                <p>Password should contain at least</p>
                <ul className="password-validation-list">
                  <li style={{ color: passwordValidation.minLength ? '#008080' : 'red' }}>6 characters,</li>
                  <li style={{ color: passwordValidation.hasUpperCase ? '#008080' : 'red' }}>1 uppercase letter,</li>
                  <li style={{ color: passwordValidation.hasLowerCase ? '#008080' : 'red' }}>1 lowercase letter,</li>
                  <li style={{ color: passwordValidation.hasNumber ? '#008080' : 'red' }}>1 number,</li>
                  <li style={{ color: passwordValidation.hasSpecialChar ? '#008080' : 'red' }}>1 special character.</li>
                </ul>
              </div>
            }
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
            <input type='submit' value='Sign up' className='signup-submit-btn' disabled={!isPasswordValid || loading} />
          </div>
          <div className='signup-other-details'>
            <p>Already have an account? <a href="#login" onClick={loginClick}>Sign in</a></p>
          </div>
        </form>
        {message && <p className={`signup-message ${isSuccess ? 'success-msg' : 'error-msg'}`}>{message}</p>}
      </div>
    </div>
  );
};

export default SignUpForm;
