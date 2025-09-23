import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './UserDashboard.css';
import {
  Cog, CheckCircle, FileCheck, 
  ClipboardCheck, Route, ArrowRight
} from 'lucide-react';

const myJourneyData = [
  { id: 1, title: 'Therapy Completed', number: '3', icon: <CheckCircle size={20} /> },
  { id: 2, title: 'Completed Resources', number: '7', icon: <FileCheck size={20} /> },
  { id: 3, title: 'Journal Entries', number: '4', icon: <ClipboardCheck size={20} /> },
];




// src/user-dashboard-components/UserProfile.js
function UserProfile() {

  //fetching journal entries from backend
  const [journalEntries, setJournalEntries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect (() => {
    const fetchJournalEntries = async () => {
      // Correct: Define 'token' here, inside the function where it's used
      const token = localStorage.getItem('token');

      try {
        if (!token) {
          // Handle case where token is not found
          setError('Authorization token not found.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:3001/api/journal-entries', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setJournalEntries(response.data);
      } catch (err) {
        setError('Error fetching journal entries');
      } finally {
        setLoading(false);
      }
    };

    fetchJournalEntries();  
  }, []);

  // const displayEntries = () => {
  //   const rating = {};
  //   journalEntries.forEach(entry => {
  //   const date = new Date(entry.date);
  //   entry.formattedDate = date.toLocaleDateString('en-US', {
  //     month: 'short',
  //     day: 'numeric'
  //   });

  //   if (!rating[entry.formattedDate]) {
  //     rating[entry.formattedDate] = entry.moodRating;
  //   }
  // });


  

  


  if (loading) return <p>Loading journal entries...</p>;
  if (error) return <p>{error}</p>;
  if (!journalEntries || journalEntries.length === 0) return <p>No journal entries found.</p>;



  
  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <Cog size={21} className="settings-icon"/>
        <h2>Profile</h2>
      </div>

      {/*My journey  */}
      <div className="my-journey-section">
        <h2>My Journey</h2>
        <div className="journey-card">
          {myJourneyData.map((item) => (
            <div key={item.id} className="journey-detail">
              <div className="journer-detail-icon">{item.icon}</div>
              <div className="journey-detail-title">{item.title}</div>
              <div className="journey-detail-number">{item.number}</div>
            </div>
          ))}
          
        </div>
        <button className='view-journey-content-btn'><Route size={18} /> View Journey Content</button>
      </div>

      {/* Mood Summary */}
      <div className="mood-summary-section">
        <h2>Mood Summary</h2>
        <div className="mood-summary-card">
          {journalEntries.slice(0, 3).map((entry) => (
            <div key={entry.id} className="mood-entry">
              <div className="mood-entry-header">
                <span className="mood-entry-date">{new Date(entry.timestamp).toLocaleDateString()}</span>
                <span className="mood-entry-rating">Mood: {entry.moodRating}/10</span>
              </div>
              <div className="mood-entry-content">
                { (entry.content || '').length > 100 
                  ? (entry.content || '').substring(0, 100) + '...' 
                  : (entry.content || '') }
              </div>
            </div>
          ))}
        </div>
        <div className="mood-summary-footer">
          <div className="mood-summary-footer-text">Showing 3 of {journalEntries.length} entries</div>
          <div className="mood-summary-footer-link">View All Entries <ArrowRight size={12} /></div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile;