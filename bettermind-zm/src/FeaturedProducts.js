import './FeaturedProducts.css';

const FeaturedProducts = () => {
    return (
        <div className="featured-services">
            <h2>On a silver plate</h2>
            <div className="services-container">
                <div className="service">
                    <h3>Teletherapy</h3>
                    <p>
                        Connect with licensed therapists through secure video consultations.
                        Bettermind is commited to providing high-quality Teletherapy
                        services that meet your mental health needs.
                    </p>
                    
                </div>
                <div className="service">
                    <h3>Resource Hub</h3>
                    <p>
                        Access articles, videos, and tools to support your well-being.
                        Our resource hub is designed to provide you with valuable information
                        and practical tips for maintaining mental health.
                    </p>
                    
                </div>
                 <div className="service">
                    <h3>Mood Tracking</h3>
                    <p>
                        Monitor your mental health progress with our tracking tools.
                        Bettermind offers mood tracking features to help you understand
                        patterns and triggers in your emotional well-being.
                    </p>
                    
                </div>
                <div className="service">
                    <h3>24/7 Support</h3>
                    <p>
                        Get immediate assistance whenever you need it.
                        Our 24/7 AI support ensures that you have access to help
                        and resources at any time of the day or night.
                    </p>
                    
                </div>
               
            </div>
        </div>
    )
}

export default FeaturedProducts;