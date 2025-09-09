import React, { useState, useEffect} from 'react';
import { Bell, User, Home, FilePlus, Video, MessageCircle } from 'lucide-react';
import PopularContent from './user-dashboard-components/PopularContents';
import UserAvatar from './user-dashboard-components/UserAvatar';
import axios from 'axios';


import './Dashboard.css'







const Dashboard = ({fullname}) => {
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
     

    useEffect(() => {
        const fetchInitials = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                
                // Get the current hostname to build a dynamic URL
                const hostname = window.location.hostname;
                const baseURL = (hostname === 'localhost' || hostname === '127.0.0.1')
                    ? 'http://localhost:3001'
                    : `http://${hostname}:3001`;

                const apiUrl = `${baseURL}/api/my-initials`;

                // Use the dynamic URL in the axios request
                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.fullName) {
                    setFullName(response.data.fullName);
                } else {
                    throw new Error('Full name not in response');
                }

            } catch (e) {
                setError(e.message);
                console.error("Authentication Error:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchInitials();
    }, []);


    if (loading) {
        return <div>loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }


  return (
    
      <div className="dashboard-container">
        {/* Sidebar for desktop */}
        <header className="dashboard-sidebar">
          <h1 className="sidebar-title">BetterMind ZM</h1>
          <nav className="sidebar-nav">
            <ul className="sidebar-nav-links">
              <li><a href="/#" className="active"><Home className="w-5 h-5 mr-3" />Dashboard</a></li>
              <li><a href="/#"><FilePlus className="w-5 h-5 mr-3" />My Journey</a></li>
              <li><a href="/#"><Video className="w-5 h-5 mr-3" />My Resources</a></li>
              <li><a href="/#"><Video className="w-5 h-5 mr-3" />My Therapist</a></li>
              <li><a href="/#"><MessageCircle className="w-5 h-5 mr-3" />Community Forum</a></li>
              <li><a href="/#"><User className="w-5 h-5 mr-3" />Account & Settings</a></li>
            </ul>
          </nav>
          <div className="mt-auto">
            <button className="logout-button">Log out</button>
          </div>
        </header>

        {/* Main content area */}
        <main className="main-content">
          <header className="header-bar">
            <UserAvatar />
            <div className="header-icons">
              <Bell className="header-icon" />
              <div className="md:hidden">
                <User className="header-icon" />
              </div>
            </div>
          </header>
          
          <section className="welcome-section">
            <div className="mb-6">
              <h2 className="welcome-heading">Welcome back {fullName}</h2>
              <p className="welcome-text-msg">Let's make today a great day.</p>
            </div>

            <div className="card-grid">
              {/* Daily Tip / Quote Card */}
              <div className="card">
                <h3 className="card-heading">Daily Tip</h3>
                <p className="card-text">Mindfulness can reduce stress. Try a 5-minute breathing exercise today.</p>
              </div>

              {/* Progress Snapshot Widget */}
              <div className="card">
                <h3 className="card-heading">Your Progress</h3>
                {/* Placeholder for a simple chart or visualization */}
                <div className="chart-placeholder">
                  [Placeholder for a Mood Tracker Chart]
                </div>
              </div>

              {/* Another empty card for a 3-column layout */}
              <div className="card">
                <h3 className="card-heading">My Goals</h3>
                <div className="chart-placeholder">
                  [Placeholder for Goal Tracker]
                </div>
              </div>
            </div>
          </section>
          {/* Quick Links Section */}
            <PopularContent />
            
             {/* Mobile footer navigation */}
            <header className="mobile-footer-bar">
                <nav>
                    <ul className="footer-bar-links">
                    <li><a href="/#" className="icon-bar-footer active"><Home className="w-6 h-6" /><span className="text-xs mt-1">Dashboard</span></a></li>
                    <li><a href="/#" className="icon-bar-footer"><FilePlus className="w-6 h-6" /><span className="text-xs mt-1">Journey</span></a></li>
                    <li><a href="/#" className="icon-bar-footer"><Video className="w-6 h-6" /><span className="text-xs mt-1">Teletherapy</span></a></li>
                    <li><a href="/#" className="icon-bar-footer"><MessageCircle className="w-6 h-6" /><span className="text-xs mt-1">Forum</span></a></li>
                    </ul>
                </nav>
            </header>
        </main>

       
      </div>
  
  );
};


export default Dashboard;