import React from "react";
import './SignUp.css';

const SignUpForm = ({ signUpOpen, signUpClose }) => {
  if (!signUpOpen) {
    return null; // Does not render anything if the modal is not open
  }

  return (
    <div className='signup-container'>
      <div className='signup-form'>
        <button className='signup-close-btn' onClick={signUpClose}>&times;</button>
        <h3>Sign up for a better mind</h3>
        <p>Join BetterMind ZM today and connect your mental wellness to a peaceful journey</p>
        <form className='signup-form-container'>
          <div className='signup-form-details'>
            <label htmlFor='first-name'>First Name</label>
            <input type='text' className='signup-input-details' id='first-name' />
          </div>
          <div className='signup-form-details'>
            <label htmlFor='last-name'>Last Name</label>
            <input type='text' className='signup-input-details' id='last-name' />
          </div>
          <div className='signup-form-details'>
            <label htmlFor='email-address'>Email Address</label>
            <input type='email' className='signup-input-details' id='email-address' />
          </div>
          <div className='signup-form-details'>
            <label htmlFor='password'>Password</label>
            <input type='password' className='signup-input-details' id='password' />
          </div>
          <div className='signup-form-details'>
            <label htmlFor='confirm-password'>Confirm Password</label>
            <input type='password' className='signup-input-details' id='confirm-password' />
          </div>

          <div className='form-details-checkbox'>
            <input type="checkbox" name="terms" id="terms-checkbox" className='signup-checkbox' />
            <label htmlFor='terms-checkbox'>I agree to the <a href="#terms-of-service">terms of service</a> and <a href="#privacy-policy">privacy policy</a> of BetterMind</label>
          </div>

          <div className='signup-btn'>
            <input type='submit' value='Sign up' className='signup-submit-btn' />
          </div>

          <div className='signup-other-details'>
            <p>Already have an account with BetterMind? <a href='#signin'>Sign in</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;