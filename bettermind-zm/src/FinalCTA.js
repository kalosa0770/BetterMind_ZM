import React from 'react';
import { ArrowRight } from 'lucide-react';

const FinalCTA = () => {
  return (
    // Main Section Container: Uses Primary Action color (#008080) for the background
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-[#008080] transition-colors duration-300">
      <div className="cta-content max-w-4xl mx-auto text-center">
        
        {/* Title: Text is white for maximum contrast */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Ready to start your journey to a better mind?
        </h2>
        
        {/* Subtitle/Description: Uses Secondary Accent color (#9bb8a1) for soft, contrasting text */}
        <p className="text-lg text-[#9bb8a1] mb-8 max-w-3xl mx-auto">
          Sign up in minutes and get instant access to a full suite of mental wellness tools and professional support.
        </p>
        
        {/* CTA Button */}
        <button className="
          inline-flex items-center space-x-2 px-8 py-3 
          
          /* Button Background: Background Neutral (#f4f5f6) */
          bg-[#f4f5f6] 
          
          /* Button Text: Primary Text (#333333) */
          text-[#333333] 
          
          text-lg font-bold 
          rounded-full shadow-2xl transition-all duration-300 
          
          /* Hover state: Lighter version of neutral or slight scale */
          hover:bg-white hover:scale-105 
          
          /* Focus Ring: White ring to stand out on the teal background */
          focus:outline-none focus:ring-4 focus:ring-white/50
        ">
          <span>Get Started Now</span>
          <ArrowRight size={20} className='arrow-right' />
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;