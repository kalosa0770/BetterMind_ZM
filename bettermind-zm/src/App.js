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
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard.js';
import api from './api/axios.js';

// HomePage component to group all the main page content
const HomePage = ({
  openLoginModal, openSignupForm,
  isLoginModalOpen, closeLoginModal, isSignUpFormOpen, closeSignUpForm,
  openForgotPasswordModal, isForgotPasswordModalOpen, goBack
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
    forgotPassword: false
  });

  const openModal = (modalName) => {
    setModalState({
      login: modalName === 'login',
      signup: modalName === 'signup',
      forgotPassword: modalName === 'forgotPassword'
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

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                openLoginModal={() => openModal('login')} 
                openSignupForm={() => openModal('signup')} 
                openForgotPasswordModal={() => {
                  closeModal('login'); // Close login modal first
                  openModal('forgotPassword'); // Then open forgot password modal
                }}
                isLoginModalOpen={modalState.login} 
                closeLoginModal={() => closeModal('login')} 
                isSignUpFormOpen={modalState.signup} 
                closeSignUpForm={() => closeModal('signup')} 
                isForgotPasswordModalOpen={modalState.forgotPassword}
                goBack={() => goBackToLoginModal()}
              />
            } 
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;