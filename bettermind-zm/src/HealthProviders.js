// src/components/TherapistSection.js

import React from 'react';
import './HealthProviders.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import profileIcon from './assets/profile-icon.jpg';

const TherapistSection = () => {
  const therapists = [
    { name: 'Rosabella Chipili', title: 'Board-Certified Family Physician', image: profileIcon },
    { name: 'Elijah Kalosa', title: 'Mental Health Therapist', image: profileIcon},
    { name: 'Beatrice CHiwaya', title: 'Mental Health Counsellor', image: profileIcon },
    { name: 'Petter Zimba', title: 'Psychotherapist', image: profileIcon },
    { name: 'Jeremiah Chushi', title: 'Mindset Specialist', image: profileIcon},
    { name: 'Anna Kalosa', title: 'Pharmacist', image: profileIcon }
    // Add more therapist data here
  ];

  return (
    <div className="therapist-section">
      <h2 className="section-title">Find the right therapist for You</h2>
      <p className="section-subtitle">
        Our network of licensed therapists and mental health professionals are here 
        to support you on your journey to better mental health.
      </p>
      
      <div className="therapist-grid">
        {therapists.map((therapist, index) => (
          <div key={index} className="therapist-card">
            <img src={therapist.image} alt={therapist.name} className="therapist-photo" />
            <div className="therapist-info">
              <h3>{therapist.name} <FontAwesomeIcon icon={faArrowRight} /></h3>
              <p>{therapist.title}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="see-more-btn">SEE ALL EXPERTS <FontAwesomeIcon icon={['fas', 'arrow-right']} className='arrow-right'/></button>
    </div>
  );
};

export default TherapistSection;