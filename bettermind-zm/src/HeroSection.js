import React from 'react';
import { ArrowRight } from 'lucide-react';
// NOTE: Ensure './assets/hero-background-img.jpg' is correctly accessible
import bgImage from './assets/hero-background-img.jpg'

const HeroSection = () => {
    // Placeholder image URL for a calming, high-quality background
    const HeroBackgroundUrl = bgImage;

    return (
        // Hero Section: full width, full height of viewport, background image container
        <div 
            id="home"
            className='relative w-full h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center justify-center rounded-b-3xl overflow-hidden shadow-2xl'
            style={{ 
                backgroundImage: `url(${HeroBackgroundUrl})`,
                fontFamily: 'Inter, sans-serif'
            }}
        >
            {/* Overlay: Dark overlay for readability, keeping the opacity at 60% */}
            <div className='absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center p-8'>
                
                {/* Content Container */}
                <div className='max-w-3xl text-center text-white'>
                    
                    {/* Title: White text (best contrast) */}
                    <h2 className='text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg'>
                        Start your journey to a better mind
                    </h2>
                    
                    {/* Paragraph: Using Secondary Accent color for the text for brand cohesion */}
                    <p className='text-lg md:text-xl font-light mb-8 text-[#9bb8a1] opacity-90 drop-shadow-sm'>
                        Get personalized support, track your well-being, and connect
                        with licensed therapists, all in one safe space.
                    </p>
                    
                    {/* Button */}
                    <button className='
                        flex items-center justify-center mx-auto space-x-2 
                        
                        /* Button Background: Primary Action color (#008080) */
                        bg-[#008080] 
                        
                        /* Button Text: Background Neutral color (#f4f5f6) for contrast */
                        text-[#f4f5f6] font-semibold 
                        
                        px-8 py-3 
                        rounded-full 
                        shadow-xl 
                        transition-all duration-300 
                        
                        /* Hover: Slightly darker or use Secondary Accent (but darker is better on this background) */
                        hover:bg-[#006666] hover:scale-[1.03]
                        
                        /* Focus Ring: Primary Action color */
                        focus:outline-none focus:ring-4 focus:ring-[#008080] focus:ring-opacity-50
                    '>
                        <span>Get Started</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;