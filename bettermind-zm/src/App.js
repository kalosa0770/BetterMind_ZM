import './App.css';
import './icons.js'
import Header from './Header.js';
import HeroSection from './HeroSection.js';
import FeaturedProducts from './FeaturedProducts.js';
import SimpleSteps from './SimpleSteps.js';
import Services from './Services.js';


function App () {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <SimpleSteps />
      <FeaturedProducts />
      <Services />
    </div>
  )
  
  
}

export default App