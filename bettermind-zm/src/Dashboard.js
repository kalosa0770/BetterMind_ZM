import React, { useState, useEffect } from 'react';
import { Bell, User, Home, FilePlus, Video, MessageCircle, Plus, ChartBar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import PopularContent from './user-dashboard-components/PopularContents';
import UserAvatar from './user-dashboard-components/UserAvatar';
import JournalEntry from './user-dashboard-components/JournalEntry';
import JournalEntryModal from './user-dashboard-components/JournalEntryModal';
import axios from 'axios';

import './Dashboard.css';

// Custom Tooltip component for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 rounded-lg text-white" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <p className="font-bold">{label}</p>
        <p>Mood: {payload[0].value.toFixed(1)}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = ({ fullname }) => {
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
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            
            const hostname = window.location.hostname;
            const baseURL = (hostname === 'localhost' || hostname === '127.0.0.1')
                ? 'http://localhost:3001'
                : `http://${hostname}:3001`;

            const apiUrl = `${baseURL}/api/my-initials`;

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

            const entriesResponse = await axios.get(`${baseURL}/api/journal-entries`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setJournalEntries(entriesResponse.data);

        } catch (e) {
            setError(e.message);
            console.error("Error fetching data:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                        <div className="card">
                            <h3 className="card-heading">Daily Tip</h3>
                            <p className="card-text">Mindfulness can reduce stress. Try a 5-minute breathing exercise today.</p>
                        </div>
                        
                        <div className="goals-card">
                            <h3 className="card-heading flex items-center justify-between">
                                My Goals
                                <button className="ml-2 bg-white text-gray-800 p-1 rounded-full hover:bg-gray-200">
                                    <Plus className="w-4 h-4" />
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
                                        <p className="mood-rating">{latestMood}/10</p>
                                        <p>Latest Mood</p>
                                    </div>
                                    <div className="mood-chart-card">
                                        <p className="mood-rating">{averageMood}/10</p>
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
                <section className="journal-entries-section">
                    <h3 className="journal-entries-heading">Your Journal History</h3>
                    <div className="journal-entries-list">
                        {journalEntries.length > 0 ? (
                            // Sort entries by timestamp in descending order and render each
                            journalEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(entry => (
                                <div key={entry._id} className="journal-entry-card" onClick={() => handleViewEntry(entry)}>
                                    <div className="journal-entry-header">
                                        <p className="journal-entry-date">
                                            {new Date(entry.timestamp).toLocaleDateString()}
                                        </p>
                                        <span className="journal-entry-mood">Mood: {entry.moodRating}/10</span>
                                    </div>
                                    <p className="journal-entry-text">
                                        {entry.moodEntryText
                                            ? entry.moodEntryText.length > 100
                                                ? `${entry.moodEntryText.substring(0, 100)}...`
                                                : entry.moodEntryText
                                            : 'No entry text available.'
                                        }
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No journal entries to display.</p>
                        )}
                    </div>
                </section>

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
