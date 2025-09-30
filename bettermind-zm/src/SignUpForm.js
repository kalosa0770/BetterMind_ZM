import React, { useState } from "react";
// import './SignUp.css'; // Removed: Replaced with Tailwind
import axios from 'axios';
import { EyeClosed, Eye } from "lucide-react";

const SignUpForm = ({ signUpOpen, signUpClose, onLoginClick }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
      setPhoneNumber("");
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

  // Tailwind Modal structure
  return (
    // Modal Container: fixed, full screen, overlay
    <div className='fixed inset-0 z-50 flex items-center text-start justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm'>
      
      {/* Sign Up Form Card: bg-white, rounded corners, max width */}
      <div className='bg-[#f4f5f6] text-[#333333] rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 relative'>
        
        {/* Close Button */}
        <button 
          className='absolute top-4 right-4 text-gray-500 hover:text-red-500 text-3xl transition-colors' 
          onClick={signUpClose}
        >
          &times;
        </button>
        
        <div className='p-8 md:p-10'>
          
          {/* Header Text */}
          <h3 className='text-3xl font-bold mb-2 text-[#333333]'>Sign up for a better mind</h3>
          <p className='text-gray-600 mb-8'>Join BetterMind ZM today and connect your mental wellness to a peaceful journey</p>
          
          <form className='space-y-4' onSubmit={handleSubmit}>
            
            {/* Form Fields */}
            {[
              { label: 'First Name', type: 'text', name: 'firstName', placeholder: 'First Name', value: firstName, setter: setFirstName },
              { label: 'Last Name', type: 'text', name: 'lastName', placeholder: 'Last Name', value: lastName, setter: setLastName },
              { label: 'Email Address', type: 'email', name: 'email', placeholder: 'Email Address', value: email, setter: setEmail },
              { label: 'Phone Number', type: 'tel', name: 'phoneNumber', placeholder: 'Phone Number (e.g., +26097xxxxxxx)', value: phoneNumber, setter: setPhoneNumber },
            ].map((field) => (
              <div key={field.name} className='space-y-1'>
                <label htmlFor={field.name} className='text-sm font-medium text-[#333333]'>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9bb8a1] transition duration-200'
                  required
                />
              </div>
            ))}

            {/* Password Field */}
            <div className='space-y-1'>
              <label htmlFor='password' className='text-sm font-medium text-[#333333]'>Password</label>
              <div className="relative">
                <input
                  // Conditionally set the input type
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value); }}
                  onClick={showValidationField}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9bb8a1] transition duration-200 pr-10'
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
              
              {/* Password Validation List */}
              {validationField &&
                <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-inner">
                  <p className='text-sm font-semibold mb-1'>Password should contain at least:</p>
                  <ul className="text-sm list-none p-0 ml-0 space-y-1">
                    {Object.entries(passwordValidation).map(([key, isValid]) => {
                      let text = '';
                      if (key === 'minLength') text = '6 characters,';
                      if (key === 'hasUpperCase') text = '1 uppercase letter,';
                      if (key === 'hasLowerCase') text = '1 lowercase letter,';
                      if (key === 'hasNumber') text = '1 number,';
                      if (key === 'hasSpecialChar') text = '1 special character.';
                      
                      return (
                        <li key={key} className={`flex items-center space-x-2 ${isValid ? 'text-[#008080]' : 'text-red-500'}`}>
                          {isValid ? '✅' : '❌'} <span>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              }
            </div>

            {/* Terms Checkbox */}
            <div className='flex items-start pt-2'>
              <input
                type="checkbox"
                name="termsAccepted"
                className='mt-1 w-4 h-4 text-[#008080] border-gray-300 rounded focus:ring-[#008080]'
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor='terms-checkbox' className='ml-3 text-sm text-gray-700'>
                I agree to the <a href="#terms-of-service" className='text-[#008080] hover:underline'>terms of service</a> and <a href="#privacy-policy" className='text-[#008080] hover:underline'>privacy policy</a> of BetterMind
              </label>
            </div>
            
            {/* Submit Button */}
            <div className='pt-4'>
              <input 
                type='submit' 
                value={loading ? 'Processing...' : 'Sign up'} 
                className={`
                  w-full py-3 text-white font-bold rounded-lg shadow-md transition duration-300 cursor-pointer
                  ${!isPasswordValid || loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#008080] hover:bg-[#006666]'
                  }
                `} 
                disabled={!isPasswordValid || loading} 
              />
            </div>
            
            {/* Sign In Link */}
            <div className='text-center pt-2'>
              <p className='text-sm text-gray-700'>
                Already have an account? <a href="#login" onClick={loginClick} className='text-[#008080] font-semibold hover:underline'>Sign in</a>
              </p>
            </div>
          </form>
          
          {/* Message (Success/Error) */}
          {message && 
            <p className={`mt-4 p-3 rounded-lg text-center font-medium ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </p>
          }
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;