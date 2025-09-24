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
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './user-dashboard-components/Dashboard.js';
import UserProfile from './user-dashboard-components/UserProfile.js';
import api from './api/axios.js';


// HomePage component to group all the main page content
const HomePage = ({
  openLoginModal, openSignupForm,
  isLoginModalOpen, closeLoginModal, isSignUpFormOpen, closeSignUpForm,
  openForgotPasswordModal, isForgotPasswordModalOpen, goBack,
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
    <Footer />
  </>
);

function App () {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeIcon, setActiveIcon] = useState('dashboard');
  const [showMainContent, setShowMainContent] = useState(true);
  const [showHeaderBar, setShowHeaderBar] = useState(true);
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
  });

  const openModal = (modalName) => {
    setModalState({
      login: modalName === 'login',
      signup: modalName === 'signup',
      forgotPassword: modalName === 'forgotPassword',
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
  const handleLoginSuccess = (data) => {
    closeModal('login'); // Close the login modal
    localStorage.setItem('token', data.token); // Store the JWT token
    navigate('/dashboard'); // Navigate directly to the dashboard
  };

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

  const onLogout = useCallback(handleLogout, []);

  const handleIconClick = (iconName) => {
      setActiveIcon(iconName);
      
      // Logic to show/hide content based on the clicked icon
      if (iconName === 'profile') {
        setShowMainContent(false);
        setShowHeaderBar(false);
      } else {
        setShowMainContent(true);
        setShowHeaderBar(true);
      }
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
              // Correctly pass the login success handler
              onLoginSuccess={handleLoginSuccess}
            />
          }
        />
        <Route path="/dashboard" 
               element={
                  <>
                    <Dashboard onLogout={onLogout}
                                activeIcon={activeIcon} 
                                handleIconClick={handleIconClick}
                                showMainContent={showMainContent}
                                showHeaderBar={showHeaderBar}
                      />
                  </>
                }      
        />
      </Routes>
    </div>
  );
}

export default App;
