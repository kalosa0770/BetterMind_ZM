import React from 'react';
import { UserPlus, Search, BookOpen } from 'lucide-react';

function SimpleSteps() {
  
  // Define the steps data with custom color classes
  const stepsData = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your free account in minutes.',
      buttonText: 'Sign up',
      buttonIcon: <UserPlus size={18} />,
      // Using Function Color 1 (#6eb282)
      buttonClass: 'bg-[#6eb282] hover:bg-green-700/90', 
    },
    {
      number: '02',
      title: 'Connect',
      description: 'Connect with wellness tools to get personalized support.',
      buttonText: 'Explore Resources',
      buttonIcon: <Search size={18} />,
      // Using Function Color 2 (#c28257)
      buttonClass: 'bg-[#c28257] hover:bg-orange-700/90', 
    },
    {
      number: '03',
      title: 'Thrive',
      description: 'Journey through a path of mental well-being',
      buttonText: 'Start Journey',
      buttonIcon: <BookOpen size={18} />,
      // Using Primary Action color (#008080)
      buttonClass: 'bg-[#008080] hover:bg-[#008080]/90', 
    },
  ];

  return (
    // Main container: Uses Background Neutral color
    <div className='py-16 px-4 md:px-8 lg:px-12 bg-[#f4f5f6] transition-colors duration-300'>
        
        {/* Title: Uses Primary Text color */}
        <h2 className='text-3xl md:text-4xl font-extrabold text-center text-[#333333] mb-12'>
            Simple steps to better your mind
        </h2>
        
        {/* Steps Container: Responsive grid */}
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
          
          {stepsData.map((step, index) => (
            // Individual Step Card
            <div 
              key={index} 
              className='
                flex flex-col items-center text-center p-8 
                /* Card Background uses Secondary Accent color */
                bg-[#9bb8a1]
                rounded-2xl shadow-xl transition-all duration-300 
                hover:shadow-2xl hover:scale-[1.02] 
                relative
              '
            >
              {/* Step Number: Uses Primary Action color with reduced opacity */}
              <p className='text-4xl font-extrabold text-[#ffffff] mb-4 absolute top-2 left-2 p-3'>{step.number}</p>
              
              {/* Title: Uses Primary Text color */}
              <h3 className='text-2xl font-bold text-[#333333] mb-2'>
                {step.title}
              </h3>
              
              {/* Description: Uses gray text for a softer look */}
              <p className='text-gray-700 mb-6'>
                {step.description}
              </p>
              
              {/* Button */}
              <button 
                className={`
                  flex items-center space-x-2 text-white font-semibold px-6 py-3 
                  rounded-full shadow-lg transition-colors duration-200 
                  ${step.buttonClass}
                `}
              >
                {step.buttonIcon}
                <span>{step.buttonText}</span>
              </button>
            </div>
          ))}
        </div>
    </div>
  );
}

export default SimpleSteps;