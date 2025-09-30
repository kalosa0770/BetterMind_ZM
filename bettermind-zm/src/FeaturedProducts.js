import React from 'react';
import { Video, BookOpen, Activity, Headset } from 'lucide-react';

const FeaturedProducts = () => {
    // Array defining the structure of each service card
    const services = [
        { 
            icon: <Video size={36} />, 
            title: "Teletherapy", 
            description: "Connect with licensed therapists through secure video consultations. Bettermind is committed to providing high-quality teletherapy services that meet your mental health needs." 
        },
        { 
            icon: <BookOpen size={36} />, 
            title: "Resource Hub", 
            description: "Access articles, videos, and tools to support your well-being. Our resource hub is designed to provide you with valuable information and practical tips for maintaining mental health." 
        },
        { 
            icon: <Activity size={36} />, // Using Activity as a stand-in for 'brain' or tracking
            title: "Mood Tracking", 
            description: "Monitor your mental health progress with our tracking tools. Bettermind offers mood tracking features to help you understand patterns and triggers in your emotional well-being." 
        },
        { 
            icon: <Headset size={36} />, 
            title: "24/7 Support", 
            description: "Get immediate assistance whenever you need it. Our 24/7 AI support ensures that you have access to help and resources at any time of the day or night." 
        },
    ];

    return (
        // Main container: Uses Background Neutral color
        <div id="services" className="py-16 px-4 md:px-8 lg:px-12 bg-[#f4f5f6] transition-colors duration-300">
            
            {/* Title: Uses Primary Text color */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#333333] mb-12">
                On a silver plate
            </h2>
            
            {/* Services Grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                
                {services.map((service, index) => (
                    // Service Card
                    <div 
                        key={index}
                        className="
                            /* Card Background uses Secondary Accent color */
                            bg-[#9bb8a1] p-6 rounded-2xl shadow-xl transition-all duration-300 
                            hover:shadow-2xl hover:translate-y-[-4px] 
                            flex flex-col items-center text-center
                        "
                    >
                        {/* Service Icon Container */}
                        <div 
                            className="
                                /* Icon color is Primary Action */
                                text-[#008080] mb-4 p-3 
                                /* Icon container background is a light contrast */
                                bg-white rounded-full
                                shadow-md
                            "
                        >
                            {service.icon}
                        </div>
                        
                        {/* Title: Uses Primary Text color */}
                        <h3 className="text-xl font-bold text-[#333333] mb-3">
                            {service.title}
                        </h3>
                        
                        {/* Description: Uses a standard gray for readability */}
                        <p className="text-gray-700 text-base">
                            {service.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeaturedProducts;