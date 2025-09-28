import React from 'react';
import { CheckCircle } from 'lucide-react';
import ComfortPic from './assets/mental-health-1.jpeg'

const Services = () => {
    // Placeholder image URL for an appealing mental health scene
    // Note: I updated the placeholder color to match your primary action color for better visual integration.
    const mentalHealthPicUrl = ComfortPic;

    return (
        // Main container with padding, using Secondary Accent color for the section background
        <div id="about" className="py-16 px-4 md:px-8 lg:px-12 bg-[#9bb8a1] transition-colors duration-300">
            
            {/* Title - Using Primary Text color */}
            <h2 className="text-3xl text-start md:text-4xl font-extrabold text-[#ffffff] mb-12">
                At the comfort of your home
            </h2>
            
            {/* Comfort Card Container: 
                - Uses Background Neutral color for the card background.
                - Uses Primary Action color for the shadow for a distinct look.
            */}
            <div className="
                max-w-6xl mx-auto 
                flex flex-col-reverse md:flex-row items-center 
                bg-[#f4f5f6] rounded-3xl overflow-hidden
                shadow-2xl shadow-[#008080]/50 
            ">
                
                {/* Text Content */}
                <div className='flex-1 p-8 md:p-12 lg:p-16'>
                    {/* Primary Text color for paragraphs */}
                    <p className='text-lg text-[#333333] mb-6 text-start'>
                        With BetterMind, you will be empowered to have the clarity and control over your mental health challenges and journey a 
                        step closer to unlock your mental wellness through our coaching services.
                    </p>
                    
                    {/* Feature List */}
                    <ul className='space-y-4 list-none p-0'>
                        {/* Features use Primary Text color for text */}
                        <li className='flex items-start text-[#333333]'>
                            {/* Checkmark uses Primary Action color */}
                            <CheckCircle size={20} className='text-[#008080] mr-3 mt-1 flex-shrink-0' />
                            <span>Secure teletherapy sessions</span>
                        </li>
                        <li className='flex items-start text-[#333333]'>
                            <CheckCircle size={20} className='text-[#008080] mr-3 mt-1 flex-shrink-0' />
                            <span>Personalized mood tracking</span>
                        </li>
                        <li className='flex items-start text-[#333333]'>
                            <CheckCircle size={20} className='text-[#008080] mr-3 mt-1 flex-shrink-0' />
                            <span>Curated mental health resources</span>
                        </li>
                        <li className='flex items-start text-[#333333]'>
                            <CheckCircle size={20} className='text-[#008080] mr-3 mt-1 flex-shrink-0' />
                            <span>Secure community support</span>
                        </li>
                    </ul>
                </div>
                
                {/* Image Container */}
                <div className='flex-1 md:max-w-[50%] w-full h-80 md:h-auto'>
                    <img 
                        src={mentalHealthPicUrl} 
                        alt="A person relaxing comfortably at home" 
                        className='w-full h-full object-cover' 
                    />
                </div>
                
            </div>
        </div>
    );
}

export default Services;