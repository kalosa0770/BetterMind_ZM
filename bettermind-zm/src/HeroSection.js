import './HeroSection.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import HeroBackground from './assets/hero-background-img.jpg';

const HeroSection = () => {
    return (
        <div className='hero-section' style={{ backgroundImage: `url(${HeroBackground})` }}>
            <div className='hero-overlay'>
                <h2>Start Your Journey to a Better Mind</h2>
                <p>
                    Get personalized support, track your well-being, and connect
                    with licenced therapists, all in one safe space.
                </p>
                <button className='get-started-btn'>Get Started <FontAwesomeIcon icon={['fas', 'arrow-right']}/></button>
            </div>
        </div>
    )

}

export default HeroSection;