import './App.css';
import './icons.js';
import Header from './Header.js';
import HeroSection from './HeroSection.js';
import FeaturedProducts from './FeaturedProducts.js';
import SimpleSteps from './SimpleSteps.js';
import Services from './Services.js';
import Testimonials from './Testimonials.js';
import HealthProviders from './HealthProviders.js';
import FinalCTA from './FinalCTA.js';
import Footer from './Footer.js';
import LoginForm from './components/LoginForm.js';
import SignUpForm from './SignUpForm.js';
import ForgotPassword from './components/ForgotPassword.js';
import OTPVerificationForm from './components/OTPVerificationForm.js';
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './user-dashboard-components/Dashboard.js';
import api from './api/axios.js';

// HomePage component to group all the main page content
const HomePage = ({
  openLoginModal, openSignupForm,
  isLoginModalOpen, closeLoginModal, isSignUpFormOpen, closeSignUpForm,
  openForgotPasswordModal, isForgotPasswordModalOpen, goBack,
  isOTPModalOpen, closeOTPModal, currentUserId, onOTPVerificationSuccess,
  onLoginSuccess, // Pass this new handler down to the LoginForm
}) => (
  <>
    <Header openLoginModal={openLoginModal} openSignupForm={openSignupForm} openForgotPasswordModal={openForgotPasswordModal}/>
    <HeroSection />
    <FeaturedProducts />
    <SimpleSteps />
    <Services />
    <Testimonials />
    <HealthProviders />
    <FinalCTA />
    <LoginForm
      isOpen={isLoginModalOpen}
      onClose={closeLoginModal}
      onForgotPasswordClick={openForgotPasswordModal}
      onSignupClick={openSignupForm}
      // This is the CORRECT way to pass the callback function
      onLoginSuccess={onLoginSuccess}
    />
    <SignUpForm
      signUpOpen={isSignUpFormOpen}
      signUpClose={closeSignUpForm}
      onLoginClick={openLoginModal}
    />
    <ForgotPassword
      isOpen={isForgotPasswordModalOpen}
      onClose={goBack}
    />
    <OTPVerificationForm
      // The isOpen prop must be a boolean
      isOpen={isOTPModalOpen}
      // The onClose prop should just close the modal
      onClose={closeOTPModal}
      // We must pass the userId so the form knows which user to verify
      userId={currentUserId}
      // We must pass a success handler for when OTP verification succeeds
      onVerificationSuccess={onOTPVerificationSuccess}
    />
    <Footer />
  </>
);

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Fetch CSRF token on app load

  useEffect (() => {
    const fetchCsrfToken = async () => {
      try {
        const { data } = await api.get('csrf-token');
        api.defaults.headers.common['csrf-token'] = data.csrfToken;
        console.log ('CSRF token fetched successfully.');
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const [modalState, setModalState] = useState({
    login: false,
    signup: false,
    forgotPassword: false,
    otp: false,
  });

  // Store userId temporarily after successful password login
  const [currentUserId, setCurrentUserId] = useState(null);

  const openModal = (modalName) => {
    setModalState({
      login: modalName === 'login',
      signup: modalName === 'signup',
      forgotPassword: modalName === 'forgotPassword',
      otp: modalName === 'otp',
    });
  };

  const closeModal = (modalName) => {
    setModalState(prevState => ({
      ...prevState,
      [modalName]: false
    }));
  };

  const goBackToLoginModal = () => {
    closeModal('forgotPassword');
    openModal('login');
  }

  // This function will be called by the LoginForm when the login is successful
  const handleLoginSuccess = (userId) => {
    // This is where you pass the userId to the App's state
    setCurrentUserId(userId);
    closeModal('login'); // Close the login modal
    openModal('otp'); // Open the OTP modal
  }

  // This function will be called by the OTPVerificationForm after a successful verification
  const handleOTPVerificationSuccess = () => {
    closeModal('otp'); // Close the OTP modal
    navigate('/dashboard'); // Navigate to the dashboard
  }

  // handle logout
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/auth/logout', null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
    // Clear token and state regardless of API response
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };


  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              openLoginModal={() => openModal('login')}
              openSignupForm={() => openModal('signup')}
              openForgotPasswordModal={() => {
                closeModal('login');
                openModal('forgotPassword');
              }}
              isLoginModalOpen={modalState.login}
              closeLoginModal={() => closeModal('login')}
              isSignUpFormOpen={modalState.signup}
              closeSignUpForm={() => closeModal('signup')}
              isForgotPasswordModalOpen={modalState.forgotPassword}
              goBack={() => goBackToLoginModal()}
              // Correctly pass the boolean state to the OTP form
              isOTPModalOpen={modalState.otp}
              // Correctly pass the close handler for the OTP form
              closeOTPModal={() => closeModal('otp')}
              // Correctly pass the userId state
              currentUserId={currentUserId}
              // Correctly pass the success handler for OTP verification
              onOTPVerificationSuccess={handleOTPVerificationSuccess}
              // Correctly pass the login success handler
              onLoginSuccess={handleLoginSuccess}
            />
          }
        />
        <Route path="/dashboard" element={<Dashboard onLogout={handleLogout}/>} />
      </Routes>
    </div>
  );
}

export default App;
