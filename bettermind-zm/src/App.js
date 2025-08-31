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
import React, { useState } from 'react';


function App () {
  // creating a modal for login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    console.log("Modal state changing to true")
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };


  return (
    <div className="App">
      <Header onLoginClick={openLoginModal} />
      <LoginForm isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <HeroSection />
      <SimpleSteps />
      <FeaturedProducts />
      <Services />
      <Testimonials />
      <HealthProviders />
      <FinalCTA />
      <Footer />
    </div>
  )
  
  
}

export default App