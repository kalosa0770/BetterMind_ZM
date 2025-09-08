import React from "react";
import './Dashboard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserAvatar from "./user-dashboard-components/UserAvatar";

const Dashboard = () => {
    
    
    
    return (
        <div className="dashboard">
            {/* The main dashboard container uses flexbox for the sidebar and content */}
            <div className="dashboard-layout">
                {/* Header/Sidebar */}
                <header className="dashboard-header">
                    <h1 className="header-title">BetterMind ZM</h1>
                    <nav className="dashboard-nav">
                        <ul className="dashboard-nav-links">
                            <li><a href="/#profile">Dashboard</a></li>
                            <li><a href="/#settings">My Journey</a></li>
                            <li><a href="/#logout">My Resources</a></li>
                            <li><a href="/#help">My Therapist</a></li>
                            <li><a href="/#contact">Community Forum</a></li>
                            <li><a href="/#account">Account & Settings</a></li>
                        </ul>
                        
                        <ul className="logout-btn">
                            <li><button>Log out</button></li>
                        </ul>
                    
                    </nav>
                   
                </header>
                
                
                {/* Main content area of the dashboard */}
                <main className="dashboard-main-content">
                    <header className="header-bar">
                        <div className="bar-content">
                          
                                <UserAvatar />
                            
                            <div className="bar-icons">
                                <FontAwesomeIcon icon={['fas' , 'bell']} className="bar-notification"></FontAwesomeIcon>
                                <FontAwesomeIcon icon={['fas', 'user']} className="user-profile" />
                            </div>
                        </div>
                    </header>
                    <section className="section-main-content">
                        {/* Placeholder content for the dashboard widgets */}
                        <div className="welcome-card">
                            <h2>Welcome back!</h2>
                            <p>Let's make today a great day.</p>
                        </div>
                        <div className="grid-contents">
                            {/* <!-- Daily Tip / Quote Card --> */}
                            <div className="daily-tips-card">
                                <h3 className="daily-tips-heading">Daily Tip</h3>
                                <p className="tips-text">Mindfulness can reduce stress. Try a 5-minute breathing exercise today.</p>
                            </div>

                            {/* <!-- Progress Snapshot Widget --> */}
                            <div className="grid-progress">
                                <h3 className="progress-heading">Your Progress</h3>
                                {/* <!-- Placeholder for a simple chart or visualization --> */}
                                <div className="progress-card">
                                    [Placeholder for a Mood Tracker Chart]
                                </div>
                            </div>
                        </div>

                        {/* <!-- Quick Links --> */}
                        <div className="container-contents">
                            {/* <!-- Quick Link 1 --> */}
                            <a href="#journal" className="container-content-card">
                                <div className="container-content-details">
                                <FontAwesomeIcon icon={['fas', 'file-circle-plus']}  className='content-details-icon' />
                                </div>
                                <h4 className="font-semibold text-gray-800">Log a Journal Entry</h4>
                            </a>

                            {/* <!-- Quick Link 2 --> */}
                            <a href="#resources" className="container-content-card">
                                <div className="container-content-details">
                                    <FontAwesomeIcon icon={['fas', 'video']}  className='content-details-icon' />

                                </div>
                                <h4 className="font-semibold text-gray-800">Start Guided Meditation</h4>
                            </a>

                            {/* <!-- Quick Link 3 --> */}
                            <a href="#appointment" className="container-content-card">
                                <div className="container-content-details">
                                <FontAwesomeIcon icon={['fas', 'calendar-check']}  className='content-details-icon' />
                                </div>
                                <h4 className="font-semibold text-gray-800">Book an Appointment</h4>
                            </a>

                            {/* <!-- Quick Link 4 --> */}
                            <a href="#forum" className="container-content-card">
                                <div className="container-content-details">
                                    <FontAwesomeIcon icon={['fas', 'comments']}  className='content-details-icon' />
                                </div>
                                <h4 className="font-semibold text-gray-800">View Community Forum</h4>
                            </a>
                        </div>
                    </section>
                </main>

                <header className="mobile-dashboard-links">
                    <nav className="mobile-dashboard-nav">
                        <ul className="mobile-dashboard-nav-links">
                            <li>
                                <a href="#profile" >
                                    <FontAwesomeIcon icon={['fas', 'home']} className="icon-nav-links"/>
                                    <p >Dashboard</p>
                                </a>
                                
                            </li>
                            <li>
                                <a href="#profile" >
                                    <FontAwesomeIcon icon={['fas', 'file-circle-plus']} className="icon-nav-links" />
                                    <p >Journey</p>
                                </a>
                                
                            </li>
                            <li>
                                <a href="#profile" >
                                    <FontAwesomeIcon icon={['fas', 'video']} className="icon-nav-links" />
                                    <p >Teletherapy</p>
                                </a>
                                
                            </li>
                            <li>
                                <a href="#profile" >
                                    <FontAwesomeIcon icon={['fas', 'comments']}  className="icon-nav-links"/>
                                    <p >Forum</p>
                                </a>
                                
                            </li>
                            

                            
                            
                        </ul>
                    </nav>
                </header>
            </div>
        </div>
    );
};

export default Dashboard;