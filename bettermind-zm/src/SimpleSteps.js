import './SimpleSteps.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SimpleSteps() {
  return (
    <div className='simple-steps'>
        <h2>Simple Steps to Better Your Mind</h2>
        <div className='steps-container'>
          <div className='step'>
            <h3>01 Sign Up</h3>
            <p>Create your free account in minutes.</p>
            <button><FontAwesomeIcon icon={['fas','user-plus']}/>Sign up</button>
          </div>
          <div className='step'>
            <h3>02 Connect</h3>
            <p>Connect with a professional and get personalized support.</p>
            <button><FontAwesomeIcon icon={['fas','search']}/>Find a Therapist</button>
          </div>
          <div className='step'>
            <h3>03 Thrive</h3>
            <p>Journey through a path of mental well-being</p>
            <button><FontAwesomeIcon icon={['fas','book']}/>Explore Resources</button>
          </div>
        </div>
    </div>
  );
}

export default SimpleSteps;