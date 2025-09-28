import React from 'react';
import { ArrowRight } from 'lucide-react';

const TherapistSection = () => {
  // Generic placeholder URL for the profile pictures
  const placeholderImageUrl = "https://placehold.co/100x100/008080/ffffff?text=P"; 

  const therapists = [
    { name: 'Rosabella Chipili', title: 'Board-Certified Family Physician', image: placeholderImageUrl },
    { name: 'Elijah Kalosa', title: 'Mental Health Therapist', image: placeholderImageUrl},
    { name: 'Beatrice CHiwaya', title: 'Mental Health Counsellor', image: placeholderImageUrl },
    { name: 'Petter Zimba', title: 'Psychotherapist', image: placeholderImageUrl },
    { name: 'Jeremiah Chushi', title: 'Mindset Specialist', image: placeholderImageUrl},
    { name: 'Anna Kalosa', title: 'Pharmacist', image: placeholderImageUrl }
    // Add more therapist data here
  ];

  return (
    // Main container: Uses Background Neutral color
    <div className="py-16 px-4 md:px-8 lg:px-12 bg-[#f4f5f6] transition-colors duration-300">
      
      {/* Header Text */}
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#333333] mb-4">
        Find the right therapist for You
      </h2>
      <p className="section-subtitle max-w-2xl mx-auto text-center text-lg text-gray-600 mb-12">
        Our network of licensed therapists and mental health professionals are here 
        to support you on your journey to better mental health.
      </p>
      
      {/* Therapist Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {therapists.map((therapist, index) => (
          // Therapist Card: Uses a light background on hover
          <div 
            key={index} 
            className="flex flex-col items-center text-center p-4 rounded-xl transition-transform duration-300 hover:shadow-xl hover:bg-white hover:scale-[1.03] cursor-pointer"
          >
            {/* Therapist Photo */}
            <img 
              src={therapist.image} 
              alt={therapist.name} 
              className="w-24 h-24 rounded-full object-cover mb-3 ring-4 ring-[#008080]" 
            />
            
            {/* Therapist Info */}
            <div>
              {/* Name uses Primary Text color */}
              <h3 className="text-sm font-semibold text-[#333333] mb-1">
                <span>{therapist.name}</span>
              </h3>
              {/* Title uses a softer gray text */}
              <p className="text-xs text-gray-500">{therapist.title}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* See More Button */}
      <div className="text-center mt-12">
        <button className="
          inline-flex items-center space-x-2 px-6 py-3 
          
          /* Button Background: Primary Action color */
          bg-[#008080] text-white
          
          /* Hover State: Secondary Accent color */
          hover:bg-[#9bb8a1] 
          
          /* Text styling */
          text-sm font-semibold uppercase tracking-wider 
          
          rounded-full shadow-md transition-all duration-300 
          hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#008080]/50
        ">
          <span>SEE ALL EXPERTS</span>
          <ArrowRight size={18} className='arrow-right' />
        </button>
      </div>
    </div>
  );
};

export default TherapistSection;