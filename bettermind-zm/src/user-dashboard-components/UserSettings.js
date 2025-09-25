import React from 'react';
import './UserDashboard.css';
import { ArrowLeft } from 'lucide-react';


const UserSettings = ({onBack}) => {
  return (
    <div className="user-settings-container">
      <div className="user-settings-header">
        <ArrowLeft size={18} className="back-icon" onClick={onBack} />
        <h2>User Settings</h2>
      </div>
      <div className="user-settings-content">
        <p>Settings content goes here...</p>
        {/* Add your settings form or options here */}
      </div>
    </div>
  )
 
};

export default UserSettings;