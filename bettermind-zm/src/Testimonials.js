import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials = () => {
    
    // Define the testimonial data
    const testimonialData = [
        {
            quote: "BetterMind has transformed my life. The therapy sessions have been incredibly helpful.",
            author: "Rosabella Chipili",
        },
        {
            quote: "The team at BetterMind is professional and compassionate. I highly recommend their services.",
            author: "Elijah Kalosa",
        },
        {
            quote: "Thanks to BetterMind, I feel more in control of my mental health than ever before.",
            author: "Bibusa Kuyama",
        },
    ];

    return (
        // Main container with padding (Equivalent to .testimonials)
        <div className="py-16 px-4 md:px-8 lg:px-12 bg-white dark:bg-gray-800 transition-colors duration-300">
            
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-12 dark:text-white">
                The breakthrough
            </h2>
            
            {/* Testimonial Cards Container: Responsive grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {testimonialData.map((testimonial, index) => (
                    // Individual Testimonial Card (Equivalent to .testimonial-card)
                    <div 
                        key={index}
                        className="
                            relative p-6 sm:p-8 bg-gray-50 rounded-2xl shadow-xl 
                            border-2 border-transparent hover:border-teal-400 transition-all duration-300
                            flex flex-col justify-between h-full
                        "
                    >
                        {/* Quote Icon */}
                        <Quote size={40} className='text-teal-500 mb-4 absolute top-4 left-4 opacity-30' />

                        {/* Quote Text */}
                        <p className="text-gray-700 text-lg italic mt-6 mb-6 dark:text-gray-300 z-10">
                            "{testimonial.quote}"
                        </p>

                        {/* Author (Equivalent to .author) */}
                        <h4 className='text-right font-semibold text-gray-900 mt-auto dark:text-white'>
                            – {testimonial.author}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Testimonials;
