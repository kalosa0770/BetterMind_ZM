import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Bell, User, Home, FilePlus, Video,
  MessageCircle, Plus, ChartBar,
  XIcon, Zap, Droplet, Clock, Heart, Brain, MoreHorizontal,
  Activity, CloudDrizzle, Feather 
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

import UserProfile from './UserProfile';
// ====================================================================
// UPDATED: UserAvatar Component (Integrated and optimized to use parent state)
// ====================================================================

const UserAvatar = ({ fullName, loading, error }) => {
    // Calculate initials based on the received fullName prop
    const initials = useMemo(() => {
        if (!fullName) return 'U';
        const parts = fullName.split(' ').filter(p => p.length > 0);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        if (parts.length >= 2) return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
        return 'U';
    }, [fullName]);
    
    if (loading) {
        return <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>;
    }

    if (error || !fullName) {
        // Fallback to the default placeholder if loading failed
        return (
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center text-teal-900 font-bold text-lg border-2 border-teal-400">
                    U
                </div>
                <p className="font-semibold text-gray-800 hidden sm:block">Hello, User</p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {/* Applied user's requested gradient style */}
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                <span>{initials}</span>
            </div>
            <div className="hidden sm:block">
                <p className="text-sm font-semibold text-teal-700">{fullName}</p>
                <p className="text-xs text-gray-600">Welcome Back</p>
            </div>
        </div>
    );
};



/**
 * Replaces Swiper component with a pure Tailwind CSS horizontal scroll container.
 * Styles maintained to use Teal/Gray palette.
 */
const PopularContent = () => {
    const contentData = [
        {
          cardImg: "https://placehold.co/300x160/2c3e50/ffffff?text=Mindfulness+Guide",
          cardTitle: "Guided Relaxation for Sleep",
          cardText: "A 15-minute audio session to prepare your mind for a deep, restful night."
        },
        {
          cardImg: "https://placehold.co/300x160/3498db/ffffff?text=Stress+Buster",
          cardTitle: "5 Tips to Manage Work Stress",
          cardText: "Quick and actionable strategies to maintain balance during busy weeks."
        },
        {
          cardImg: "https://placehold.co/300x160/95a5a6/333333?text=Coping+Skills",
          cardTitle: "Beginner's Guide to Journaling",
          cardText: "Learn how to structure your entries to maximize emotional clarity."
        },
        {
          cardImg: "https://placehold.co/300x160/e74c3c/ffffff?text=Therapy+Intro",
          cardTitle: "Understanding Teletherapy",
          cardText: "Your questions answered about meeting with a mental health professional online."
        }
    ];
     
    return (
        <div className="my-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Popular Resources</h3>
            <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 scrollbar-hide">
                {contentData.map((data, index) => (
                    <div 
                        key={index} 
                        className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] snap-start bg-white p-4 rounded-xl shadow-md border border-gray-100 h-full hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex flex-col space-y-3 h-full">
                            <div className="h-40 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                    src={data.cardImg} 
                                    alt={data.cardTitle} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x160/f0f0f0/333333?text=Content+Card"; }}
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">{data.cardTitle}</h2>
                            <p className="text-sm text-gray-600 line-clamp-2 flex-grow">{data.cardText}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Custom CSS to hide the scrollbar for aesthetic purposes */}
            <style jsx="true">{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none; 
                    scrollbar-width: none; 
                }
            `}</style>
        </div>
      );
};


/**
 * Journal Entry quick button, styled with Teal.
 */
const JournalEntry = ({ onOpenJournalModal }) => (
    <div className="bg-teal-100 p-6 rounded-2xl shadow-lg mb-8 flex items-center justify-between border-l-4 border-teal-400">
        <div className="flex items-center gap-4">
            <FilePlus className="text-teal-700 w-6 h-6" />
            <p className="text-lg font-medium text-teal-800">How was your day?</p>
        </div>
        <button
            onClick={onOpenJournalModal}
            className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded-xl shadow-md transition duration-200 flex items-center gap-1"
        >
            <Plus size={18} />
            Log Entry
        </button>
    </div>
);

// ===================================================================
// JOURNAL ENTRY MODAL (Teal Palette Applied)
// ===================================================================

const moodThoughts = [
   { name: 'Depressed', range: 'Low', emoji: '😔' }, 
   { name: 'Anxious', range: 'Low', emoji: '😥' }, 
   { name: 'Sad', range: 'Low', emoji: '😢' }, 
   { name: 'Heartbroken', range: 'Low', emoji: '💔' },
   { name: 'Overwhelmed', range: 'Low', emoji: '😵‍💫' },
   { name: 'Tired', range: 'Mid', emoji: '😴' }, 
   { name: 'Confused', range: 'Mid', emoji: '🤔' }, 
   { name: 'Bored', range: 'Mid', emoji: '😑' }, 
   { name: 'Neutral', range: 'Mid', emoji: '😶' }, 
   { name: 'Uncertain', range: 'Mid', emoji: '🤷‍♀️' },
   { name: 'Grateful', range: 'High', emoji: '🙏' }, 
   { name: 'Calm', range: 'High', emoji: '😌' }, 
   { name: 'Motivated', range: 'High', emoji: '🚀' }, 
   { name: 'Happy', range: 'High', emoji: '😀' }, 
   { name: 'Loved', range: 'High', emoji: '🥰' },
   { name: 'Other', range: 'All', emoji: '✨' }, 
];

const MoodThoughtSelector = ({ rating, selectedThought, onSelect }) => {
    let requiredRange;
    if (rating >= 8) {
        requiredRange = 'High';
    } else if (rating >= 5) {
        requiredRange = 'Mid';
    } else {
        requiredRange = 'Low';
    }

    const filteredThoughts = moodThoughts.filter(
        (thought) => thought.range === requiredRange || thought.range === 'All'
    );

    return (
        <div className="flex flex-wrap gap-3 mt-4">
            {filteredThoughts.map((thought) => (
                <div
                    key={thought.name}
                    className={`cursor-pointer p-3 rounded-xl transition-all duration-200 text-sm font-medium shadow-sm border
                        ${selectedThought === thought.name 
                            ? 'bg-teal-600 text-white border-teal-700' // Teal for selection
                            : 'bg-gray-100 text-gray-800 hover:bg-teal-100 border-gray-200' // Teal for hover
                        }`}
                    onClick={() => onSelect(thought.name)} 
                >
                    <span className="mr-2">{thought.emoji}</span> 
                    {thought.name}
                </div>
            ))}
        </div>
    );
};

const JournalEntryModal = ({ onClose, entry }) => {
    const [moodRating, setMoodRating] = useState(entry?.moodRating || null);
    const [showMoodThought, setShowMoodThought] = useState(entry?.moodRating ? true : false);
    const [moodThought, setMoodThought] = useState(entry?.moodThought || '');
    const [showJournalText, setShowJournalText] = useState(entry?.journalText || false);
    const [guidedQuestion, setGuidedQuestion] = useState(entry?.moodRating ? getMoodQuestion(entry.moodRating) : '');
    const [journalText, setJournalText] = useState(entry?.journalText || '');
    const [isSaving, setIsSaving] = useState(false); 

    function getMoodQuestion(rating) {
        if (rating >= 8) {
            return "That's wonderful! What is one thing that contributed to you having such a great day?";
        } else if (rating >= 5) {
            return "It sounds like you have mixed feelings today. What's on your mind?";
        } else {
            return "I'm sorry to hear that. What is one thing that made today feel difficult?";
        }
    }

    const handleRatingSelect = (rating) => {
        setMoodRating(rating);
        setGuidedQuestion(getMoodQuestion(rating));
        setShowMoodThought(true);
    };

    const handleThoughtSelect = (thoughtName) => {
        setMoodThought(thoughtName);
        setShowMoodThought(false);
        setShowJournalText(true);
    };

    const saveJournalEntry = useCallback(async (entryData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Authentication token not found.");
            return false;
        }
        
        const hostname = window.location.hostname;
        const baseURL = (hostname === 'localhost' || hostname === '127.0.0.1')
            ? 'http://localhost:3001'
            : `http://${hostname}:3001`;

        try {
            const method = entry ? 'PUT' : 'POST';
            const url = entry 
                ? `${baseURL}/api/journal-entries/${entry.id}` 
                : `${baseURL}/api/journal-entries`;

            const response = await axios({
                method: method,
                url: url,
                data: entryData,
                headers: { Authorization: `Bearer ${token}` },
            });
            
            return response.status === 201 || response.status === 200;

        } catch (error) {
            console.error("Error saving document:", error);
            return false;
        }
    }, [entry]);

    const handleSubmit = async () => {
        if (journalText.trim() === "") {
             console.warn("Please write something about your day before saving.");
             return;
        }
        
        setIsSaving(true); 

        const entryData = {
            moodRating,
            moodThought,
            journalText,
        };
        
        const success = await saveJournalEntry(entryData);
        
        setIsSaving(false); 

        if (success) {
            onClose(); 
        } 
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                <div className="p-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <h2 className='text-xl font-bold text-teal-700'>Log a New Journal Entry</h2>
                        <XIcon className="w-6 h-6 text-gray-500 cursor-pointer hover:text-red-500" onClick={isSaving ? null : onClose} />
                    </div>
                    
                    {/* Step 1: Mood Rating Selection */}
                    {moodRating === null && !showMoodThought && !showJournalText && (
                        <div className="py-6">
                            <p className="text-gray-700 mb-4 font-semibold">What is your mood rating today (1 is worst, 10 is best)?</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {[...Array(10)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handleRatingSelect(i + 1)}
                                        className={`w-10 h-10 rounded-full font-bold transition-colors duration-150 shadow-md 
                                            ${moodRating === i + 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-teal-300'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Mood Thought Selection */}
                    {showMoodThought && !showJournalText && (
                        <div className='py-6'>
                            <p className="text-lg font-semibold text-gray-700 mb-4">How are you feeling right now, based on your mood rating?</p>
                            <MoodThoughtSelector 
                                rating={moodRating} 
                                selectedThought={moodThought} 
                                onSelect={handleThoughtSelect} 
                            />
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => {
                                        if (moodThought) {
                                            handleThoughtSelect(moodThought);
                                        } else {
                                            handleThoughtSelect('Neutral'); 
                                        }
                                    }}
                                    className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-teal-700 transition duration-200"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Journal Text Entry */}
                    {showJournalText && (
                        <div className='py-6'>
                            <p className="text-sm font-medium text-gray-600 mb-2">Selected Mood: <span className="font-bold text-teal-600">{moodRating} - {moodThought}</span></p>
                            <p className="text-lg font-semibold text-gray-700 mb-4">{guidedQuestion}</p>
                            <textarea
                                value={journalText}
                                onChange={(e) => setJournalText(e.target.value)}
                                placeholder="Start writing about your thoughts and feelings here..."
                                rows="6"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 transition duration-150"
                            />
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className={`font-semibold py-3 px-8 rounded-xl transition duration-200 flex items-center gap-2 
                                        ${isSaving ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                                >
                                    {isSaving ? 'Saving...' : 'Save Entry'}
                                    <FilePlus size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// ====================================================================
// EXPLORE TOPICS COMPONENT (Horizontally scrolling)
// ====================================================================

const TopicCard = ({ icon: Icon, title, description, color }) => (
    <div 
        // Added flex-shrink-0, specific width, and snap-start for horizontal scrolling
        className={`bg-white p-4 rounded-xl shadow-md flex flex-col items-center text-center transition-all duration-200 
                    border border-gray-100 cursor-pointer hover:shadow-lg hover:bg-${color}-50 flex-shrink-0 w-36 sm:w-40 snap-start`}
    >
        <div className={`p-3 rounded-full mb-3 bg-${color}-100 text-${color}-700`}>
            <Icon size={24} />
        </div>
        <h4 className="font-semibold text-gray-800 text-base mb-1">{title}</h4>
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
    </div>
);

const ExploreTopics = () => {
    // Defined topics with new icons and descriptions
    const topics = [
        { icon: Zap, title: "Anxiety", description: "Strategies for managing worry and fear." },
        { icon: CloudDrizzle, title: "Depression", description: "Finding support and boosting motivation." },
        { icon: Activity, title: "Stress", description: "Techniques for instant relief and calm." },
        { icon: Feather, title: "Mindfulness", description: "Guided practices for presence and focus." },
        { icon: MoreHorizontal, title: "Other", description: "Explore all topics in our health library." },
    ];
    
    return (
        <section className="mt-8">
            <h3 className='text-xl font-bold text-gray-800 mb-4'>Explore Mental Wellness Topics</h3>
            {/* Horizontal scroll container */}
            <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 scrollbar-hide">
                {topics.map((topic, index) => (
                    <TopicCard 
                        key={index} 
                        icon={topic.icon} 
                        title={topic.title} 
                        description={topic.description} 
                        color="teal" 
                    />
                ))}
            </div>
            {/* Custom CSS to hide the scrollbar (defined globally but safe to re-include) */}
            <style jsx="true">{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none; 
                    scrollbar-width: none; 
                }
            `}</style>
        </section>
    );
};


// ====================================================================
// CHART CONFIGURATION & HELPER FUNCTIONS
// ====================================================================

// Custom Tooltip component for the chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-md text-sm">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-teal-600">Mood: {payload[0].value.toFixed(1)}</p>
      </div>
    );
  }
  return null;
};

// Emoji map for Y-Axis labels
const moodMap = {
    1: '😔', 4: '😐', 7: '🙂 ', 10: '😀 ',
};

// Color mapping for bars and metric card backgrounds (using colors from your snippet)
const getMoodColor = (score) => {
    if (score >= 8) return '#047857';  // Emerald 700 (High)
    if (score >= 5) return '#fbbf24';  // Amber 400 (Mid)
    if (score >= 1) return '#dc2626';  // Red 600 (Low)
    return '#6b7280'; // Gray (N/A)
}

const moodChartEmojis = (score) => {
    const emoji = Math.floor(score); 
    if (emoji >= 8) return '😊';
    if (emoji >= 5) return '🙂';
    if (emoji >= 1) return '😐'
    return 'N/A';
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
    
    const [journalEntries, setJournalEntries] = useState([]); 
    
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [goals, setGoals] = useState([
      { id: 1, title: 'Meditate for 10 minutes', current: 3, total: 5 },
      { id: 2, title: 'Practice Gratitude', current: 1, total: 7 },
    ]);

    const fetchData = useCallback(async () => {
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

            // Fetch user name and initials
            const nameResponse = await axios.get(`${baseURL}/api/my-initials`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFullName(nameResponse.data.fullName || 'User'); // Set fullName state for greeting and Avatar component

            // Fetch journal entries
            const entriesResponse = await axios.get(`${baseURL}/api/journal-entries`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const mappedEntries = entriesResponse.data.map(entry => ({
                ...entry,
                moodThought: entry.moodThought || 'Not Logged',
                entryDate: entry.entryDate || entry.timestamp, 
                moodRating: entry.moodRating || 5, // Default to 5 if missing
            }));
            
            setJournalEntries(mappedEntries); 

        } catch (e) {
            setError(e.message);
            if (e.response && e.response.status === 401) {
                onLogout();
            }
        } finally {
            setLoading(false);
        }
    }, [onLogout]);

    useEffect(() => {
        if (activeIcon === 'dashboard' || activeSideBar === 'dashboard') {
            fetchData();
        }
    }, [activeIcon, activeSideBar, fetchData]); 

    const { previousRecord, latestRecord, chartData } = useMemo(() => {
        const aggregatedData = {};
        
        const sortedEntries = [...journalEntries].sort((a, b) => 
            new Date(a.entryDate) - new Date(b.entryDate)
        );

        const latest = sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1] : null;
        const previous = sortedEntries.length > 1 ? sortedEntries[sortedEntries.length - 2] : null;

        // Group by date and calculate average mood for the chart
        sortedEntries.forEach(entry => {
            const dateObj = new Date(entry.entryDate); 
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            if (!aggregatedData[formattedDate]) {
                aggregatedData[formattedDate] = { sum: 0, count: 0 };
            }
            
            aggregatedData[formattedDate].sum += entry.moodRating; 
            aggregatedData[formattedDate].count += 1;
        });

        // Convert aggregated data to chart format, only keeping the last 7 days
        const allChartData = Object.keys(aggregatedData).map(date => ({
            date: date,
            mood: aggregatedData[date].sum / aggregatedData[date].count,
        }));
        
        const finalChartData = allChartData.slice(-7);


        return { previousRecord: previous, latestRecord: latest, chartData: finalChartData };

    }, [journalEntries]);

    if (loading) {
        // Return a cleaner loading state for the whole dashboard
        return <div className="p-8 text-center text-gray-700 bg-gray-100 min-h-screen flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading dashboard data...
        </div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600 bg-gray-100 min-h-screen">Error loading data: {error}</div>;
    }

    const openJournalModal = () => {
        setSelectedEntry(null);
        setJournalModalOpen(true);
    };

    const closeJournalModal = () => {
        setJournalModalOpen(false);
        fetchData();
    };
    
    // Helper function to render the new metric cards
    const renderMetricCard = (title, icon, record) => (
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-gray-800">
                {icon}
                <span className="text-base font-semibold">{title}</span>
            </div>
            {record ? (
                <>
                    <p className="text-3xl font-extrabold mb-1">{moodChartEmojis(record.moodRating)}</p>
                    <p 
                        className="text-sm font-medium text-white p-2 rounded-lg"
                        // Color determined dynamically by score
                        style={{backgroundColor: getMoodColor(record.moodRating)}}
                    >
                        {record.moodThought || 'No Thought Logged'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        on {new Date(record.entryDate).toLocaleDateString()}
                    </p>
                </>
            ) : (
                <p className="text-sm text-gray-500">No data available.</p>
            )}
        </div>
    );
    
    // --- Render ---

    return (
        <div className="flex h-screen bg-gray-100">
            
            {/* Sidebar (Desktop) - Teal Primary Color */}
            <header className="fixed left-0 bottom-0 top-0 hidden md:flex flex-col w-64 bg-teal-700 shadow-xl p-6 z-20">
                <h1 className="text-2xl font-extrabold text-white mb-8 text-left">BetterMind ZM</h1>
                <nav className="flex-grow">
                    <ul className="flex flex-col gap-4">
                        {/* Sidebar Link Mapping - Uses Teal for hover/active */}
                        {['dashboard', 'journey', 'resources', 'teletherapy', 'forum', 'profile'].map(item => (
                            <li key={item} onClick={() => handleSideBarClick(item)}>
                                <p className={`flex items-center p-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer gap-2 
                                    ${activeSideBar === item ? 'bg-teal-800 text-white shadow-inner' : 'text-white hover:bg-teal-600'}`}>
                                    {item === 'dashboard' && <Home size={18}/>}
                                    {item === 'journey' && <FilePlus size={18} />}
                                    {item === 'resources' && <Zap size={18}/>}
                                    {item === 'teletherapy' && <Video size={18}/>}
                                    {item === 'forum' && <MessageCircle size={18} />}
                                    {item === 'profile' && <User size={18} />}
                                    {item === 'teletherapy' ? 'My Therapist' : item.charAt(0).toUpperCase() + item.slice(1)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="mt-auto pt-6">
                    <button 
                        className="w-full py-3 px-4 bg-white text-gray-800 font-semibold text-base rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 hover:text-white"
                        onClick={onLogout}
                    >
                        Log out
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 overflow-y-auto pb-20 md:pb-0">
                {showHeaderBar &&
                    <header className="flex items-center justify-between p-4 bg-white rounded-b-lg shadow-sm sticky top-0 z-10 mb-6">
                    {/* Updated UserAvatar to use state passed as props */}
                    <UserAvatar fullName={fullName} loading={loading} error={error} />
                    <div className="flex items-center gap-4">
                        <Bell className="w-6 h-6 text-gray-700 cursor-pointer hover:text-teal-600" />
                        <div className="md:hidden">
                            <User className="w-6 h-6 text-gray-700 cursor-pointer hover:text-teal-600" onClick={() => handleIconClick('profile')} />
                        </div>
                    </div>
                </header>
                }
                
                {(activeIcon === 'profile' || activeSideBar === 'profile') ? (
                    <UserProfile journalEntries={journalEntries} />
                ) : (
                    showMainContent && 
                    <div className="p-4 md:p-6">
                        {/* Welcome and Goals Section */}
                        <section className="mb-6">
                            <div className="mb-8 text-left">
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back {fullName}</h2>
                                <p className="text-gray-600">Let's make today a great day.</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {/* Daily Tip Card - Teal Border */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02] border-t-4 border-teal-600 lg:col-span-1">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-left">Daily Tip</h3>
                                    <p className="text-sm text-gray-500">Mindfulness can reduce stress. Try a 5-minute breathing exercise today.</p>
                                </div>
                                
                                {/* Goals Card - Teal Border and Gradient */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-[1.02] border-t-4 border-teal-600 lg:col-span-2">
                                    <h3 className="flex justify-between items-center text-lg font-semibold text-gray-800 mb-4">
                                        My Goals
                                        <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full shadow-md transition duration-200">
                                            <Plus className="w-4 h-4"/>
                                        </button>
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {goals.map(goal => (
                                            <div key={goal.id} className="flex flex-col">
                                                <p className="font-medium text-gray-800 text-left">{goal.title}</p>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                                    <div 
                                                        className="h-2.5 rounded-full bg-gradient-to-r from-teal-300 to-teal-600 transition-all duration-500" 
                                                        style={{ width: `${(goal.current / goal.total) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-right text-xs text-gray-700 mt-1">
                                                    {goal.current}/{goal.total} completed
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        <PopularContent />
                        
                        {/* Log Journal Entry Section - Teal styling */}
                        <JournalEntry onOpenJournalModal={openJournalModal} />
                        
                        {isJournalModalOpen && <JournalEntryModal onClose={closeJournalModal} entry={selectedEntry} />}

                        {/* Your Journey Graph Section (7-Day View) */}
                        <div className="bg-white p-6 shadow-lg rounded-xl mt-8">
                            <div className='flex items-center gap-3 text-teal-700 mb-4'>
                                <ChartBar className='w-6 h-6'/>
                                <h3 className="text-xl font-bold">Your Journey Snapshot</h3> 
                            </div>
                            
                            {/* NEW METRICS SECTION */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-8">
                                {renderMetricCard(
                                    "Previous Record", 
                                    <Clock className='w-5 h-5 text-gray-500' />, 
                                    previousRecord
                                )}
                                {renderMetricCard(
                                    "Latest Record", 
                                    <Heart className='w-5 h-5 text-red-500' />, 
                                    latestRecord
                                )}
                            </div>

                            {/* CHART RENDERING */}
                            <div className="chart-section p-4">
                                <h2 className="text-lg font-semibold mb-4 text-gray-700">Mood Trend (Last 7 Days)</h2>
                                {journalEntries.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={chartData}
                                            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            
                                            <XAxis dataKey="date" stroke="#374151" className="text-xs" />
                                            <YAxis domain={[1, 10]}
                                                    ticks={[1,4,7,10]} 
                                                    tickFormatter={formatMoodTick} 
                                                    width={40}
                                                    stroke="#374151"
                                                    className="text-sm"
                                            />
                                            <Tooltip content={<CustomTooltip />} />

                                            <Bar dataKey="mood" barSize={30} radius={[5, 5, 0, 0]}> 
                                                {
                                                    chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`}
                                                        fill={getMoodColor(entry.mood)} />
                                                    )) 
                                                }
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : ( 
                                    <p className="text-gray-500 p-8 text-center">Log your first entry to start your journey graph!</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Recommended Section - Teal styling */}
                        <section className="mt-8">
                            <h3 className='text-xl font-bold text-gray-800 mb-4'>Recommended for You</h3>
                            <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-center gap-4">
                                {/* Recommendation Card 1: Breathing */}
                                <div className="flex items-center p-4 bg-teal-50 rounded-lg w-full md:w-1/2 border border-teal-200 transition-shadow hover:shadow-md">
                                    <Zap className="w-8 h-8 text-teal-700 mr-4 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Quick 3-Minute Reset</p>
                                        <p className="text-sm text-gray-600">A guided box breathing exercise to instantly lower anxiety.</p>
                                    </div>
                                </div>
                                {/* Recommendation Card 2: Hydration */}
                                <div className="flex items-center p-4 bg-teal-50 rounded-lg w-full md:w-1/2 border border-teal-200 transition-shadow hover:shadow-md">
                                    <Droplet className="w-8 h-8 text-teal-700 mr-4 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-800">Hydration Check</p>
                                        <p className="text-sm text-gray-600">Reminder: Have you had enough water today? Physical health impacts mental health!</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        
                        {/* UPDATED: Explore Topics Section (Horizontal Scroll) */}
                        <ExploreTopics />


                    </div>
                )}
            </main>
            
            {/* Mobile Fixed Bottom Navigation (Teal styling) */}
            <footer className='fixed bottom-0 left-0 w-full md:hidden bg-white border-t border-gray-200 shadow-2xl z-40'>
                <nav className='flex justify-around items-center h-16'>
                    {[
                        { name: 'dashboard', label: 'Home', icon: Home },
                        { name: 'journey', label: 'Journal', icon: FilePlus },
                        { name: 'teletherapy', label: 'Therapy', icon: Video },
                        { name: 'forum', label: 'Forum', icon: MessageCircle },
                        { name: 'profile', label: 'Profile', icon: User },
                    ].map((item) => (
                        <div
                            key={item.name} 
                            onClick={() => handleIconClick(item.name)} 
                            className={`flex flex-col items-center justify-center p-1 text-xs font-medium transition-colors cursor-pointer 
                                ${activeIcon === item.name ? 'text-teal-700' : 'text-gray-500 hover:text-teal-600'}`
                            }
                        >
                            <item.icon size={20} className='mb-0.5' />
                            {item.label}
                        </div>
                    ))}
                </nav>
            </footer>
        </div>
    );
};

export default Dashboard;
