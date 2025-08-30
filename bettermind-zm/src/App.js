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


function App () {
  return (
    <div className="App">
      <Header />
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