import React from 'react';
import './UserDashboard.css';
import { X, Cog, CheckCircle, FileCheck, ClipboardCheck, Route} from 'lucide-react'

const myJourneyData = [
  { id: 1, title: 'Therapy Completed', number: '3', icon: <CheckCircle size={20} /> },
  { id: 2, title: 'Completed Resources', number: '7', icon: <FileCheck size={20} /> },
  { id: 3, title: 'Journal Entries', number: '4', icon: <ClipboardCheck size={20} /> },
];




// src/user-dashboard-components/UserProfile.js
function UserProfile() {

  return (
    <div className="user-profile-container">
      <div className="user-profile-header">
        <Cog size={21} className="settings-icon"/>
        <h2>User Profile</h2>
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


    </div>
  )
}

export default UserProfile;