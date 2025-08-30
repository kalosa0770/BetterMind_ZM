import './Testimonials.css';
const Testimonials = () => {
    return (
        <div className="testimonials">
            <h2>The Breakthrough</h2>
            <div className="testimonial-cards">
                <div className="testimonial-card">
                    <p>"BetterMind has transformed my life. The therapy sessions have been incredibly helpful."</p>
                    <h4 className='author'>- Rosabella Chipili.</h4>
                </div>
                <div className="testimonial-card">
                    <p>"The team at BetterMind is professional and compassionate. I highly recommend their services."</p>
                    <h4 className='author'>- Elijah Kalosa.</h4>
                </div>
                <div className="testimonial-card">
                    <p>"Thanks to BetterMind, I feel more in control of my mental health than ever before."</p>
                    <h4 className='author'>- Bibusa Kuyama.</h4>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;