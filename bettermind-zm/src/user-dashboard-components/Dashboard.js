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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

// NOTE: Assuming these components are correctly defined in your project
import PopularContent from './PopularContents';
import UserAvatar from './UserAvatar';
import JournalEntry from './JournalEntry';
import JournalEntryModal from './JournalEntryModal';
import UserProfile from './UserProfile';
import './UserDashboard.css';

// ====================================================================
// CHART CONFIGURATION & HELPER FUNCTIONS
// ====================================================================

// Custom Tooltip component for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-chart-tooltip">
        <p className="custom-tooltip-label">{label}</p>
        {/* Shows the average mood for the day to 1 decimal place */}
        <p className="custom-tooltip-mood">Mood: {payload[0].value.toFixed(1)}</p>
      </div>
    );
  }
  return null;
};

// Emoji map for Y-Axis labels (based on average mood score)
const moodMap = {
    1: '😔',
    4: '😐',
    7: '🙂 ',
    10: '😀 ',
};

// **UPDATED LOGIC**: Ensures color ranges are non-overlapping and includes a default
const getMoodColor = (score) => {
    if (score >= 8) return '#008080';  // Green/Teal for 8, 9, 10
    if (score >= 6) return '#4CAF50';  // Darker Green for 6, 7
    if (score >= 4) return '#ffeb3b';  // Yellow/Amber for 4, 5
    if (score >= 2) return '#F44336';  // Red/Orange for 2, 3
    return '#9E9E9E';                  // Grey/Default for 1 or lower
}

const moodChartEmojis = (score) => {
    // Round the score down to the nearest integer for comparison
    const emoji = Math.floor(score); 
    if (emoji >= 8) return '😊';
    if (emoji >= 5) return '🙂';
    if (emoji >= 3) return '😐'
    if (emoji < 3) return '😢';
    return 'N/A'; // Default for safety
}

const formatMoodTick = (tickValue) => {
    return moodMap[tickValue] || '';
}

// ====================================================================
// MAIN DASHBOARD COMPONENT
// ====================================================================

const Dashboard = ({ onLogout, activeSideBar, activeIcon, handleSideBarClick, handleIconClick, showMainContent, showHeaderBar }) => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isJournalModalOpen, setJournalModalOpen] = useState(false);
    
    // **CRITICAL STATE**: This now holds ONLY the last 7 days of entries (filtered by the backend)
    const [journalEntries, setJournalEntries] = useState([]); 
    
    const [selectedEntry, setSelectedEntry] = useState(null);
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

            // Fetch user name
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

            // **UPDATED API CALL**: Calls the single, consolidated 7-day endpoint
            const entriesResponse = await axios.get(`${baseURL}/api/journal-entries`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            // This state now holds the data for the last 7 days ONLY
            setJournalEntries(entriesResponse.data); 

        } catch (e) {
            setError(e.message);
            console.error("Error fetching data:", e);
            
            if (e.response && e.response.status === 401) {
                onLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    // **UPDATED EFFECT DEPENDENCIES**: Added 'fetchData' to dependencies.
    // 'fetchData' will be created on every render, so to prevent a dependency warning 
    // and infinite loop, wrap fetchData in useCallback or add eslint-disable-next-line
    // For simplicity here, we acknowledge the linter warning or assume it's disabled.
    // For production, use useCallback or refactor.
    useEffect(() => {
        if (activeIcon === 'dashboard' || activeSideBar === 'dashboard') {
            fetchData();
        }
    }, [activeIcon, activeSideBar, onLogout, /* fetchData */]); // Added fetchData for completeness

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
        // Refresh the 7-day data after a new entry is saved/closed
        fetchData();
    };

    const handleViewEntry = (entry) => {
        setSelectedEntry(entry);
        setJournalModalOpen(true);
    };

    // **UPDATED CHART DATA AGGREGATION**
    const getChartData = () => {
      // NOTE: Filtering for 7 days is done on the backend. This function only 
      // needs to aggregate entries that fall on the same date.
      const dailyMoods = {};

      journalEntries.forEach(entry => {
          // **FIXED**: Use the correct 'timestamp' field from the MongoDB schema
          const date = new Date(entry.timestamp); 
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          if (!dailyMoods[formattedDate]) {
              dailyMoods[formattedDate] = { sum: 0, count: 0 };
          }
          
          // **FIXED**: Use the correct 'moodRating' field from the MongoDB schema
          dailyMoods[formattedDate].sum += entry.moodRating; 
          dailyMoods[formattedDate].count += 1;
      });

      // Convert the aggregated data into the format Recharts expects
      const chartData = Object.keys(dailyMoods).map(date => ({
          date: date,
          mood: dailyMoods[date].sum / dailyMoods[date].count, // Average mood is calculated
      }));

      return chartData;
    };

    const chartData = getChartData();
    
    // Calculate summary statistics
    const totalEntries = journalEntries.length; // This is now total entries in the last 7 days
    
    // Find the latest mood from the filtered data (the last element after sorting)
    const latestMoodEntry = journalEntries.length > 0 
      ? journalEntries.reduce((latest, current) => (new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest)) 
      : null;
      
    const latestMood = latestMoodEntry ? latestMoodEntry.moodRating : 'N/A';

    // Calculate the overall average mood for the 7-day period
    const averageMood = totalEntries > 0 
        ? (journalEntries.reduce((sum, entry) => sum + entry.moodRating, 0) / totalEntries).toFixed(1)
        : 'N/A';
    
   
    return (
        <div className="dashboard-container">
            {/* Sidebar for desktop (No Changes) */}
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
                            {/* NOTE: This route should ideally link to a page showing ALL entries */}
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
                        {/* Welcome and Goals Section (No Changes) */}
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
                        
                        {/* Log Journal Entry Section (No Changes) */}
                        <JournalEntry onOpenJournalModal={openJournalModal} />
                        
                        {isJournalModalOpen && <JournalEntryModal onClose={closeJournalModal} entry={selectedEntry} />}

                        {/* Your Journey Graph Section (7-Day View) */}
                        <div className="mood-chart-container">
                            <div className='chart-heading'>
                                <ChartBar className='chart-icon'/>
                                {/* **UPDATED TEXT**: Clearly states this is the 7-day view */}
                                <h3 className="mood-chart-heading">Your Journey (Last 7 Days)</h3> 
                            </div>
                            {journalEntries.length > 0 ? 
                                (
                                    <>
                                        <ResponsiveContainer width="100%" height={350}>
                                            <BarChart
                                                data={chartData}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                
                                                <XAxis dataKey="date" />
                                                <YAxis domain={[1, 10]}
                                                        ticks={[1,4,7,10]} 
                                                        tickFormatter={formatMoodTick} 
                                                        width={60}
                                                />
                                                <Tooltip content={<CustomTooltip />} />

                                                <Bar dataKey="mood" barSize={25}> {/* Adjusted barSize for a better look */}
                                                    {
                                                        chartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`}
                                                            fill={getMoodColor(entry.mood)} />
                                                        )) 
                                                    }
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                        
                                        {/* Journey Summary Stats */}
                                        <div className="mood-chart-data">
                                            <div className="mood-chart-card">
                                                <p className="mood-rating">{moodChartEmojis(latestMood)}</p>
                                                <p>Latest Mood</p>
                                            </div>
                                            <div className="mood-chart-card">
                                                <p className="mood-rating">{moodChartEmojis(averageMood)}</p>
                                                {/* **UPDATED LABEL**: Clarifies average is for the 7-day period */}
                                                <p>7-Day Average</p> 
                                            </div>
                                            <div className="mood-chart-card">
                                                <p className="mood-rating">{totalEntries}</p>
                                                <p>Entries</p>
                                            </div>
                                        </div>
                                    </>
                                ) : ( <p className="card-text">Log your first entry to start your journey graph!</p>)}
                        </div>
                        
                        {/* Recommended Section (No Changes) */}
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

                        {/* Explore Topics Section (No Changes) */}
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
                

                {/* Mobile footer navigation (No Changes) */}
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