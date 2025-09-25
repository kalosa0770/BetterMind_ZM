import React from 'react';
import './UserDashboard.css';
import { ArrowLeft, User, CreditCard, LogOut, Lock, CircleQuestionMark, Info, Link, Bell } from 'lucide-react';


const UserSettings = ({onBack}) => {
  return (
    <div className="user-settings-container">
      <div className="user-settings-header">
        <ArrowLeft size={18} className="back-icon" onClick={onBack} />
        <h2>User Settings</h2>
      </div>
      <div className="user-settings-content">
        <div className='manage-account-section'>
            <nav className='account-nav'>
                <ul>
                    <li>
                        <Bell size={16} className="notifications-icon" />
                        Notifications
                    </li>
                    <hr />
                    <li>
                        <User size={16} className="manage-icon" /> 
                        Manage Account
                    </li>
                    
                    <li>
                        <CreditCard size={16} className="subscription-icon" />
                        Manage Subscription
                    </li>
                   
                    <li>
                        <Link size={16} className="link-icon" />
                        Link Organisation Subscription
                    </li>
                    <hr />
                    <li>
                        <Lock size={16} className="privacy-icon" /> 
                        Privacy & Security
                    </li>
                    
                    <li>    
                        <CircleQuestionMark size={16} className="support-icon" />
                        Help & Support
                    </li>
                    
                    <li>
                        <Info size={16} className="about-icon" />
                        About BetterMind
                    </li>
                    <hr />
                    <li className='logout-btn' onClick={() => {
                        // Clear token from localStorage
                        localStorage.removeItem('token');
                        // Optionally, you can also redirect the user to the login page or homepage
                        window.location.href = '/';
                        }}>
                        <LogOut size={16} className="logout-icon" />
                        Log Out
                    </li> 
                </ul>
            </nav>
        </div>
         
      </div>
    </div>
  )
 
};

export default UserSettings;