import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Cog, CheckCircle, FileCheck, ClipboardCheck, ArrowRight, FilePlus, Sparkles, Route, Activity, ChevronLeft, Brain, 
  ChevronRight
} from 'lucide-react';
import UserSettings from './UserSettings';
import api from '../api/axios.js';
import { useNavigate } from 'react-router-dom';
// --- HELPER FUNCTIONS ---

/**
 * Calculates the current consecutive daily streak of journal entries.
 * @param {Array<Object>} entries - List of journal entries.
 * @returns {number} The current streak length.
 */
const calculateCurrentStreak = (entries) => {
  if (!entries || entries.length === 0) return 0;

  // Sort entries by timestamp in descending order
  const sortedEntries = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Create a set of unique normalized dates (start of the day)
  const uniqueDates = Array.from(new Set(sortedEntries.map(entry => {
    const date = new Date(entry.timestamp);
    // Normalize date to midnight UTC for consistent comparison
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  })));
  
  let streak = 0;
  let now = new Date();
  let today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // The streak can start today, but only if an entry exists for today.
  // Check if the most recent entry is today
  if (uniqueDates[0] === today) {
    streak = 1;
  }
  
  for (let i = (uniqueDates[0] === today ? 1 : 0); i < uniqueDates.length; i++) {
    const previousDate = new Date(uniqueDates[i]);
    const requiredPreviousDay = new Date(previousDate);
    requiredPreviousDay.setDate(previousDate.getDate() + 1);
    
    // Check if the next unique date exists and is the required previous day
    const nextDateTimestamp = uniqueDates[i - 1];
    
    // If we are past the first entry (i=0) and the previous entry date (i-1) is exactly one day ahead of the current date (i)
    if (i > 0) {
      const differenceInDays = (nextDateTimestamp - uniqueDates[i]) / (1000 * 60 * 60 * 24);
      if (Math.round(differenceInDays) === 1) {
        streak++;
      } else {
        // If there's a gap or the date is older, the streak is broken
        break;
      }
    } else if (uniqueDates[0] === today) {
        // If the very first unique date is today, the streak is 1. We already handled this.
        // The loop logic starts checking the day before today.
    }
  }
  
  return streak;
};


/**
 * Generates the calendar array for the last 14 days for the streak display.
 * @param {Array<Object>} journalEntries - List of journal entries.
 * @returns {Array<Object>} Calendar data with date and entry status.
 */
const generateCalendar = (journalEntries) => {
  const today = new Date();
  const calendarDays = [];
  // Use a map to store normalized date strings for quick lookup
  const entryDates = new Set(journalEntries.map(entry => {
    const d = new Date(entry.timestamp);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toLocaleDateString();
  }));

  for (let i = 13; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    
    const dayNormalizedString = new Date(day.getFullYear(), day.getMonth(), day.getDate()).toLocaleDateString();
    const isJournalDay = entryDates.has(dayNormalizedString);
    const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'narrow' });
    
    calendarDays.push({
      date: day,
      dayOfWeek,
      isJournalDay
    });
  }
  return calendarDays;
};

/**
 * Gets an appropriate emoji for a mood rating.
 * @param {number} rating - Mood rating from 1 to 10.
 * @returns {string} Emoji character.
 */
const getMoodEmoji = (rating) => {
  if (rating >= 8) return '😊'; // Happy
  if (rating >= 5) return '🙂'; // Neutral-Happy
  if (rating >= 3) return '😐'; // Neutral
  return '😢'; // Sad
};



// --- USER PROFILE COMPONENT ---

function UserProfile({ journalEntries = [], onOpenJournalModal }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  // Derived state calculations are memoized for performance
  const currentStreak = useMemo(() => calculateCurrentStreak(journalEntries), [journalEntries]);
  const totalEntries = journalEntries ? journalEntries.length : 0;
  const calendarDays = useMemo(() => generateCalendar(journalEntries), [journalEntries]);
  
  // Sort entries by timestamp in descending order and get the latest 3
  const latestEntries = useMemo(() => {
    return journalEntries 
      ? [...journalEntries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3) 
      : [];
  }, [journalEntries]);

  // Mock data for "My Journey"
  const myJourneyData = [
    { id: 1, title: 'Therapy Completed', number: '3', icon: <CheckCircle size={20} /> },
    { id: 2, title: 'Completed Resources', number: '7', icon: <FileCheck size={20} /> },
    { id: 3, title: 'Journal Entries', number: totalEntries, icon: <ClipboardCheck size={20} /> },
  ];

  const handleShowSettings = () => setShowSettings(true);
  const handleHideSettings = () => setShowSettings(false);

  // handle logout
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post('/auth/logout', null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        // Log failure but proceed with client-side cleanup
        console.error("Logout failed:", error);
      }
    }
    // Clear token and state regardless of API response
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const onLogout = useCallback(handleLogout, []);

  // If settings are toggled, render the UserSettings component
  if (showSettings) {
    return <UserSettings onBack={handleHideSettings} onLogout={onLogout} showSettings={setShowSettings}/>;
  }

  // Use 'animate-in' classes for a smooth slide-in effect
  return (
    <div className="flex flex-col bg-gray-50 min-h-screen w-full animate-in fade-in slide-in-from-right duration-500">
        
      {/* User Profile Header (Sticky Top) */}
      <header className="sticky top-0 flex items-center justify-between w-full p-5 bg-white shadow-md z-10">
        <Cog 
          size={24} 
          className="cursor-pointer text-teal-600 bg-gray-100 rounded-full p-1 w-8 h-8 transition-colors hover:bg-gray-200" 
          onClick={handleShowSettings}
        />
        <h2 className="text-xl font-bold text-gray-800">Profile</h2>
        <div className="w-8"></div> {/* Spacer */}
      </header>

      {/* Main Content Area */}
      <div className="p-5 flex flex-col gap-6 w-full">
        
        {/* My Journey Section */}
        <section className="bg-white p-5 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-start justify-start gap-2 text-gray-800 mb-6">
            <Route size={20} className="text-teal-600" />
            <h3 className="text-lg font-semibold m-0">My Journey</h3>
          </div>
          
          <div className="flex justify-around items-center text-center">
            {myJourneyData.map((item) => (
              <div key={item.id} className="flex flex-col items-center mx-1 gap-1 w-1/3">
                <div className="text-teal-600">{item.icon}</div>
                <div className="text-xs font-medium text-gray-500 mt-1">{item.title}</div>
                <div className="text-2xl font-extrabold text-gray-800">{item.number}</div>
              </div>
            ))}
          </div>
          
          <button className='w-full py-3 mt-5 bg-teal-600 text-white font-semibold rounded-full text-sm transition-all flex justify-center items-center gap-2 hover:bg-teal-700 active:scale-[.99]'>
            View Journey Content <ArrowRight size={18} />
          </button>
        </section>
        
        {/* Streak Card with Calendar */}
        <section className="bg-white p-5 rounded-3xl shadow-lg border border-gray-100 text-center">
          <div className="flex items-center justify-start gap-2 text-gray-800 mb-2">
            <Sparkles size={20} className="text-yellow-500" />
            <h3 className="text-lg font-semibold m-0">Current Streak</h3>
          </div>
          
          <div className="text-6xl font-extrabold text-teal-600 my-3">{currentStreak}</div>
          <p className="text-sm text-gray-600 mb-4">days</p>

          <div className="grid grid-cols-7 gap-2 mt-4">
            {calendarDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">{day.dayOfWeek}</span>
                <div className={`w-6 h-6 rounded-full transition-colors duration-200 flex items-center justify-center text-white text-xs ${
                  day.isJournalDay ? 'bg-teal-600 shadow-md' : 'bg-gray-200'
                }`}>
                  {/* The use of index to display day number is problematic for responsive design,
                      so we leave it as a filled/unfilled circle for clarity. */}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mood Summary Section */}
        <section className="bg-white p-5 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between text-gray-800 mb-6 relative">
            <div className="flex items-center gap-2">
              <Activity size={20} className="text-pink-500" />
              <h3 className="text-lg font-semibold m-0">Mood Summary</h3>
            </div>
            <button className="text-sm font-bold text-teal-600 cursor-pointer hover:text-teal-700 transition-colors">
              Show All
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {latestEntries.length > 0 ? (
              latestEntries.map((entry) => (
                <div key={entry._id || entry.timestamp} className="bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3 w-full">
                      <span className="text-2xl p-2 rounded-full bg-teal-100">{getMoodEmoji(entry.moodRating)}</span>
                      <div className='flex flex-col flex-grow'>
                        <span className="text-sm font-medium text-gray-600">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                        {/* mood-entry-thought styled as a small tag */}
                        <span className='mt-1 text-xs px-2 py-1 bg-teal-50 text-teal-600 rounded-full w-fit font-medium border border-teal-200'>
                          {entry.moodThought || 'General Reflection'}
                        </span>
                      </div>
                    </div>
                    <div className='flex-shrink-0 cursor-pointer text-gray-500 hover:text-teal-600 transition-colors'>
                      <ArrowRight size={20} />
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 px-1 pt-1 border-t border-gray-100">
                    { (entry.journalText || '').length > 100 
                      ? (entry.journalText || '').substring(0, 100) + '...' 
                      : (entry.journalText || 'No detailed text available.') }
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No entries to display yet. Start your journey!
              </p>
            )}
          </div>
          
          <div className="mt-5 flex justify-center w-full">
            <button 
              onClick={onOpenJournalModal}
              className="w-full py-3 bg-teal-600 text-white font-semibold rounded-full text-sm transition-all flex justify-center items-center gap-2 hover:bg-teal-700 active:scale-[.99]"
            >
              <FilePlus size={18} /> Add New Entry
            </button>
          </div>
        </section>

        <section className=''>
            <button className='relative flex jusitify-between items-center p-4 bg-teal-50 rounded-lg w-full md:w-1/2 border border-teal-200 transition-shadow hover:shadow-md'>
              <Brain className='flex-none w-8 h-8 text-teal-700 mr-4 flex-shrink-0' />
              <p className='flex-1 text-start font-semibold text-gray-800'>My Journey</p>
              <ArrowRight className='absolute right-0 flex-1 items-center w-6 h-6 text-teal-700 mr-4 flex-shrink-0'/>
            </button>
        </section>
      </div>
    </div>
  );
}


export default UserProfile;
