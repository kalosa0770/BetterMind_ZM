import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Services.css';
import mentalHealthPic from './assets/mental-health-1.jpeg';

const Services = () => {
    return (
        <div className="comfort-container">
            <h2>At the comfort of your home</h2>
            <div className="comfort-card">
                <div className='comfort-text'>
                    <p>
                        With BetterMind ZM, take the step to unlock your mental wellness through our coaching services
                    </p>
                    <ul>
                        <li><FontAwesomeIcon icon={['fas', 'check']} />Secure teletherapy sessions</li>
                        <li><FontAwesomeIcon icon={['fas', 'check']} />Personalized mood tracking</li>
                        <li><FontAwesomeIcon icon={['fas', 'check']} />Curated mental health resources</li>
                    </ul>
                </div>
                <div className='image-container'>
                    <img src={mentalHealthPic} alt="mental health" className='mental-health-pic' />
                </div>
                
            </div>
        </div>
    );
}

export default Services;