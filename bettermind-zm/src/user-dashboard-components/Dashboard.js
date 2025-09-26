import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Bell, User, Home, FilePlus, Video, 
  MessageCircle, Plus, ChartBar, 
  LampDesk, ArrowRight, Zap, Droplet, AlertTriangle, Brain, 
  MoreHorizontal
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import PopularContent from './PopularContents';
import UserAvatar from './UserAvatar';
import JournalEntry from './JournalEntry';
import JournalEntryModal from './JournalEntryModal';
import UserProfile from './UserProfile';
import './UserDashboard.css';

// Custom Tooltip component for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <p className="custom-tooltip-label">{label}</p>
        <p className="custom-tooltip-mood">Mood: {payload[0].value.toFixed(1)}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = ({ onLogout, activeSideBar, activeIcon, handleSideBarClick, handleIconClick, showMainContent, showHeaderBar }) => {
    const navigate = useNavigate();

    
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isJournalModalOpen, setJournalModalOpen] = useState(false);
    const [journalEntries, setJournalEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    // Sample goals data
    const [goals, setGoals] = useState([
      { id: 1, title: 'Meditate for 10 minutes', current: 3, total: 5 },
      { id: 2, title: 'Practice Gratitude', current: 1, total: 7 },
    ]);

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            onLogout();
            return;
        }

        try {
            const hostname = window.location.hostname;
            const baseURL = (hostname === 'localhost' || hostname === '127.0.0.1')
                ? 'http://localhost:3001'
                : `http://${hostname}:3001`;

            const nameResponse = await axios.get(`${baseURL}/api/my-initials`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (nameResponse.data.fullName) {
                setFullName(nameResponse.data.fullName);
            } else {
                throw new Error('Full name not in response');
            }

            const entriesResponse = await axios.get(`${baseURL}/api/journal-entries`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setJournalEntries(entriesResponse.data);

        } catch (e) {
            setError(e.message);
            console.error("Error fetching data:", e);
            
            // Here's the change: check for an authentication error
            if (e.response && e.response.status === 401) {
                // If it's a 401 error, it means the token is invalid, so log out
                onLogout();
            }
            // For other errors, don't log the user out.
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeIcon === 'dashboard') {
            fetchData();
        }

        if (activeSideBar === 'dashboard') {
            fetchData();
        }
    }, [activeIcon, activeSideBar, onLogout]);

    if (loading) {
        return <div>loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const openJournalModal = () => {
        setSelectedEntry(null);
        setJournalModalOpen(true);
    };

    const closeJournalModal = () => {
        setJournalModalOpen(false);
        fetchData();
    };

    const handleViewEntry = (entry) => {
        setSelectedEntry(entry);
        setJournalModalOpen(true);
    };

    const getChartData = () => {
      // Create a map to store mood sums and counts for each date
      const dailyMoods = {};

      journalEntries.forEach(entry => {
          const date = new Date(entry.timestamp);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          if (!dailyMoods[formattedDate]) {
              dailyMoods[formattedDate] = { sum: 0, count: 0 };
          }
          
          dailyMoods[formattedDate].sum += entry.moodRating;
          dailyMoods[formattedDate].count += 1;
      });

      // Convert the aggregated data into the format Recharts expects
      const chartData = Object.keys(dailyMoods).map(date => ({
          date: date,
          mood: dailyMoods[date].sum / dailyMoods[date].count, // Calculate the average mood
      }));

      return chartData;
    };

    const moodChartEmojis = (emoji) => {
        if (emoji >= 8) return '😊';
        if (emoji >= 5) return '🙂';
        if (emoji >= 3) return '😐'
        if (emoji < 3) return '😢';
    }

    const chartData = getChartData();
    
    // Calculate summary statistics
    const totalEntries = journalEntries.length;
    const latestMood = totalEntries > 0 ? journalEntries[journalEntries.length - 1].moodRating : 'N/A';
    const averageMood = totalEntries > 0 
        ? (journalEntries.reduce((sum, entry) => sum + entry.moodRating, 0) / totalEntries).toFixed(1)
        : 'N/A';
    
   
    return (
        <div className="dashboard-container">
            {/* Sidebar for desktop */}
            <header className="dashboard-sidebar">
                <h1 className="sidebar-title">BetterMind ZM</h1>
                <nav className="sidebar-nav">
                    <ul className="sidebar-nav-links">
                        <li onClick={() => handleSideBarClick('dashboard')}>
                            <p className={`sidebar-active ${activeSideBar === 'dashboard' ? 'active' : ''}`}>
                                <Home className="sidebar-icon" size={18}/>
                                Dashboard
                            </p>
                        </li>
                        <li>
                            <p className={`sidebar-active ${activeSideBar === 'journey' ? 'active' : ''}`}>
                                <FilePlus className="sidebar-icon"size={18} />
                                My journey
                            </p>
                        </li>
                        <li>
                            <p className={`sidebar-active ${activeSideBar === 'resources' ? 'active' : ''}`}>
                                <Video className="sidebar-icon" size={18}/>
                                My Resources
                            </p>
                        </li>
                        <li>
                            <p className={`sidebar-active ${activeSideBar === 'teletherapy' ? 'active' : ''}`}>
                                <Video className="sidebar-icon" size={18}/>
                                My Therapist
                            </p>
                        </li>
                        <li>
                            <p className={`sidebar-active ${activeSideBar === 'forum' ? 'active' : ''}`}>
                                <MessageCircle className="sidebar-icon" size={18} />
                                Community Forum
                            </p>
                        </li>
                        <li onClick={() => handleSideBarClick('profile')}>
                            <p className={`sidebar-active ${activeSideBar === 'profile' ? 'active' : ''}`}>
                                <User className='sidebar-icon'  size={18} />
                                Account & Settings
                            </p>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto">
                    <button className="logout-button" onClick={onLogout}>Log out</button>
                </div>
            </header>

            {/* Main content area */}
            <main className="main-content">
                {showHeaderBar &&
                    <header className="header-bar">
                    <UserAvatar />
                    <div className="header-icons">
                        <Bell className="header-icon" />
                        <div className="md:hidden">
                            <User className="header-icon" />
                        </div>
                    </div>
                </header>
                }
                
                {(activeIcon === 'profile' || activeSideBar === 'profile') ? (
                    <UserProfile showMainContent={showMainContent} journalEntries={journalEntries} />
                ) : (
                    showMainContent && 
                    <div className="main-dashboard-content">
                        <section className="welcome-section">
                            <div className="mb-6">
                                <h2 className="welcome-heading">Welcome back {fullName}</h2>
                                <p className="welcome-text-msg">Let's make today a great day.</p>
                            </div>

                            <div className="card-grid">
                                <div className="card">
                                    <h3 className="card-heading">Daily Tip</h3>
                                    <p className="card-text">Mindfulness can reduce stress. Try a 5-minute breathing exercise today.</p>
                                </div>
                                
                                <div className="goals-card">
                                    <h3 className="card-heading goal-card-header">
                                        My Goals
                                        <button className="add-goal-button">
                                            <Plus className="add-goal-icon"/>
                                        </button>
                                    </h3>
                                    <div className="goals-list">
                                        {goals.map(goal => (
                                            <div key={goal.id} className="goal-item">
                                                <p className="goal-title">{goal.title}</p>
                                                <div className="progress-bar-container">
                                                    <div 
                                                        className="progress-bar" 
                                                        style={{ width: `${(goal.current / goal.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="goal-completion-text">
                                                    {goal.current}/{goal.total} completed
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                        <PopularContent />
                        
                        {/* Correctly passing the function as a prop */}
                        <JournalEntry onOpenJournalModal={openJournalModal} />
                        
                        {/* Conditionally render the modal based on state */}
                        {isJournalModalOpen && <JournalEntryModal onClose={closeJournalModal} entry={selectedEntry} />}

                        <div className="mood-chart-container">
                            <div className='chart-heading'>
                                <ChartBar className='chart-icon'/>
                                <h3 className="mood-chart-heading">Your Journey</h3>
                            </div>
                            {journalEntries.length > 0 ? 
                                (
                                    <>
                                        <ResponsiveContainer width="100%" height={350}>
                                            <LineChart
                                                data={chartData}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" stroke="#ffffff" />
                                                <YAxis domain={[1, 10]} stroke="#ffffff" />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="mood"
                                                    stroke="#ffffff"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#ffffff', stroke: '#8884d8', strokeWidth: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                        <div className="mood-chart-data">
                                            <div className="mood-chart-card">
                                                <p className="mood-rating">{moodChartEmojis(latestMood)}</p>
                                                <p>Latest Mood</p>
                                            </div>
                                            <div className="mood-chart-card">
                                                <p className="mood-rating">{moodChartEmojis(averageMood)}</p>
                                                <p>Average Mood</p>
                                            </div>
                                            <div className="mood-chart-card">
                                                <p className="mood-rating">{totalEntries}</p>
                                                <p>Total Entries</p>
                                            </div>
                                        </div>
                                    </>
                                ) : ( <p className="card-text">No journal entries yet.</p>)}
                        </div>
                        
                        {/* New Journal Entries Section */}
                        <section className="recommended-section">
                            <h3 className='recommended-title'>Recommended for You</h3>
                            <div className="recommended-card">
                                <div className="recommended-content">
                                    <h4 className="recommended-heading">5 Tips to Boost Your Mental Health</h4>
                                    <p className="recommended-text">Discover simple strategies to enhance your well-being and cultivate a positive mindset.</p>
                                </div>
                                <div className="recommended-image">
                                    <img src="/images/recommended1.jpg" alt="Recommended img" className="recommended-img"/>
                                </div>
                            </div>
                        </section>

                        {/* Explore Topics */}
                        <section className="explore-by-topic-section">
                            <h3 className='explore-by-topic-title'>Explore By Topic</h3> 
                            <div className="explore-by-topic-content">
                                <div className="topic-item">
                                    <Zap size={16} className="topic-icon" />
                                    Anxiety
                                </div>
                                <div className="topic-item">
                                    <Droplet size={16} className="topic-icon" />
                                    Depression
                                </div>
                                <div className="topic-item">
                                    <AlertTriangle size={16} className="topic-icon" />
                                    Stress
                                </div>
                                <div className="topic-item">
                                    <Brain size={16} className="topic-icon" />
                                    Mindfulness
                                </div>
                                <div className='topic-item'>
                                    <MoreHorizontal size={16} className="topic-icon" />
                                    Other
                                </div>
                            </div>
                        </section>
                    </div>
                )}
                

                {/* Mobile footer navigation */}
                <header className="mobile-footer-bar">
                    <nav className='mobile-footer-nav'>
                        <ul className="footer-bar-links">
                            <li onClick={() => handleIconClick('dashboard')}>
                                <p className={`icon-bar-footer ${activeIcon === 'dashboard' ? 'active' : ''}`}>
                                    <Home className="mobile-footer-icon" />
                                    <span className="mobile-footer-icon-name">Dashboard</span>
                                </p>
                            </li>
                            <li onClick={() => handleIconClick('journal')}>
                                <p className={`icon-bar-footer ${activeIcon === 'journal' ? 'active' : ''}`}>
                                    <FilePlus className="mobile-footer-icon" />
                                    <span className="mobile-footer-icon-name">Journal</span>
                                </p>
                            </li>
                            <li onClick={() => handleIconClick('explore')}>
                                <p className={`icon-bar-footer ${activeIcon === 'explore' ? 'active' : ''}`}>
                                    <LampDesk className="mobile-footer-icon" />
                                    <span className="mobile-footer-icon-name">Explore</span>
                                </p>
                            </li>
                            <li onClick={() => handleIconClick('teletherapy')}>
                                <p className={`icon-bar-footer ${activeIcon === 'teletherapy' ? 'active' : ''}`}>
                                    <Video className="mobile-footer-icon" />
                                    <span className="mobile-footer-icon-name">Teletherapy</span>
                                </p>
                            </li>
                            <li onClick={() => handleIconClick('forum')}>
                                <p className={`icon-bar-footer ${activeIcon === 'forum' ? 'active' : ''}`}>
                                    <MessageCircle className="mobile-footer-icon" />
                                    <span className="mobile-footer-icon-name">Forum</span>
                                </p>
                            </li>
                            {/* The profile click handler is now simplified */}
                            <li onClick={() => handleIconClick('profile')}>
                                <p className={`icon-bar-footer ${activeIcon === 'profile' ? 'active' : ''}`}>
                                    <User className="mobile-footer-icon" />
                                    <span className="mobile-footer-icon-name">Profile</span>
                                </p>
                            </li>
                        </ul>
                    </nav>
                </header>
            </main>
        </div>
    );
};

export default Dashboard;