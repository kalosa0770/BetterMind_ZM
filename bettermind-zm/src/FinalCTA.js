// src/components/FinalCTA.js
import './FinalCTA.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const FinalCTA = () => {
  return (
    <section className="final-cta-section">
      <div className="cta-content">
        <h2>Ready to start your journey to a better mind?</h2>
        <p>Sign up in minutes and get instant access to a full suite of mental wellness tools and professional support.</p>
        <button className="cta-button">
          Get Started Now<FontAwesomeIcon icon={['fas', 'arrow-right']} className='arrow-right'/>
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;