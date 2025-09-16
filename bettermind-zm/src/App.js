import './App.css';
import './icons.js'
import Header from './Header.js';
import HeroSection from './HeroSection.js';
import FeaturedProducts from './FeaturedProducts.js';
import SimpleSteps from './SimpleSteps.js';
import Services from './Services.js';
import Testimonials from './Testimonials.js';
import HealthProviders from './HealthProviders.js';
import FinalCTA from './FinalCTA.js';
import Footer from './Footer.js';
import LoginForm from './LoginForm.js';
import SignUpForm from './SignUpForm.js';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard.js';
import api from './api/axios.js';

// HomePage component to group all the main page content
const HomePage = ({ openLoginModal, openSignupForm, isLoginModalOpen, closeLoginModal, isSignUpFormOpen, closeSignUpForm }) => (
  <>
    <Header openLoginModal={openLoginModal} openSignupForm={openSignupForm} />
    <HeroSection />
    <FeaturedProducts />
    <SimpleSteps />
    <Services />
    <Testimonials />
    <HealthProviders />
    <FinalCTA />
    <LoginForm isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    <SignUpForm signUpOpen={isSignUpFormOpen} signUpClose={closeSignUpForm} />
    <Footer />
  </>
);

function App () {

  useEffect (() => {
    // Function to fetch the CSRF(Cross Site Request Forgery) token
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
  
  
  // creating a modal for login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // creating a signup form modal as props to be passed
  const [isSignUpFormOpen, setIsSignUpFormOpen] = useState(false);

  const openSignupForm = () => {
    setIsSignUpFormOpen(true);
  };

  const closeSignUpForm = () => {
    setIsSignUpFormOpen(false)
  }

  return (
    // Only one BrowserRouter
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Main page route, the home page components */}
          <Route 
            path="/" 
            element={
              <HomePage
                openLoginModal={openLoginModal} 
                openSignupForm={openSignupForm} 
                isLoginModalOpen={isLoginModalOpen} 
                closeLoginModal={closeLoginModal} 
                isSignUpFormOpen={isSignUpFormOpen} 
                closeSignUpForm={closeSignUpForm} 
              />
            } 
          />
          {/* Dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
