import React, { useState, useEffect, useMemo } from 'react';
import { Cog, CheckCircle, FileCheck, ClipboardCheck, ArrowRight, FilePlus, Sparkles, Route, Activity, ChevronLeft } from 'lucide-react';
import UserSettings from './UserSettings'
// --- MOCK DATA AND UTILITIES ---

// Mocking UserSettings component for single-file deployment
// const UserSettings = ({ onBack }) => {
//   return (
//     <div className="flex flex-col w-full h-full bg-gray-50 animate-in fade-in slide-in-from-right duration-500">
//       <div className="sticky top-0 flex items-center justify-between p-4 bg-white shadow-sm z-10">
//         <ChevronLeft size={24} className="cursor-pointer text-teal-600 bg-gray-100 rounded-full p-1" onClick={onBack} />
//         <h2 className="text-lg font-semibold text-gray-800">Settings & Privacy</h2>
//         <div className="w-6"></div> {/* Spacer */}
//       </div>
//       <div className="p-5 flex flex-col gap-5">
//         <div className="w-full bg-white p-5 rounded-xl shadow-sm">
//           <h3 className="text-md font-semibold text-gray-800 mb-4">Manage Account</h3>
//           <ul className="flex flex-col gap-3 list-none p-0 m-0">
//             <li className="flex items-center gap-4 text-gray-600 cursor-pointer hover:text-teal-600 transition-colors">
//               <ClipboardCheck size={20} /> Update Profile
//             </li>
//             <hr className="w-full border-gray-200 my-1" />
//             <li className="flex items-center gap-4 text-gray-600 cursor-pointer hover:text-teal-600 transition-colors">
//               <Cog size={20} /> Preferences
//             </li>
//             <hr className="w-full border-gray-200 my-1" />
//             <li className="flex items-center gap-4 text-red-500 cursor-pointer hover:text-red-700 transition-colors">
//               <Activity size={20} /> Sign Out
//             </li>
//           </ul>
//         </div>
//         <p className="text-sm text-gray-400 text-center mt-4">Version 1.0.0</p>
//       </div>
//     </div>
//   );
// };


// A helper function to calculate the current streak of journal entries
const calculateCurrentStreak = (entries) => {
  if (!entries || entries.length === 0) return 0;

  // Sort entries by timestamp in descending order
  const sortedEntries = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Create a set of unique normalized dates (start of the day)
  const uniqueDates = Array.from(new Set(sortedEntries.map(entry => {
    const date = new Date(entry.timestamp);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  })));
  
  let streak = 0;
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if the most recent entry is today
  if (uniqueDates[0] === today.getTime()) {
    streak = 1;
  }
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const previousDate = new Date(uniqueDates[i - 1]);
    const currentDate = new Date(uniqueDates[i]);
    const daysDiff = (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Check if the current date is exactly one day before the previous date
    if (Math.round(daysDiff) === 1) {
      streak++;
    } else {
      // If there's a gap or the date is older, the streak is broken
      break;
    }
  }
  
  return streak;
};

// Generates the calendar array for the last 14 days
const generateCalendar = (journalEntries) => {
  const today = new Date();
  const calendarDays = [];
  const entryDates = new Set(journalEntries.map(entry => {
    const d = new Date(entry.timestamp);
    // Use toLocaleDateString for easy string comparison of normalized dates
    return d.toLocaleDateString(); 
  }));

  for (let i = 13; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const isJournalDay = entryDates.has(day.toLocaleDateString());
    const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'narrow' });
    
    calendarDays.push({
      date: day,
      dayOfWeek,
      isJournalDay
    });
  }
  return calendarDays;
};

const getMoodEmoji = (rating) => {
  if (rating >= 8) return '😊'; // Happy
  if (rating >= 5) return '🙂'; // Neutral-Happy
  if (rating >= 3) return '😐'; // Neutral
  return '😢'; // Sad
};

// --- USER PROFILE COMPONENT (TAILWIND REFACTOR) ---

function UserProfile({ journalEntries = [], onLogout }) {
  const [showSettings, setShowSettings] = useState(false);

  // Derived state calculations are memoized or calculated once
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

  // The original useEffect was loading data but not setting state, 
  // which caused an ESLint warning and an API call to localhost.
  // I will remove the logic that causes the unused variable warning and unnecessary mock calls.
  useEffect(() => {
    // Placeholder for real-time listener or initial data load
    // The `journalEntries` are now expected via props.
    console.log("UserProfile mounted. Current journal entry count:", totalEntries);
  }, [totalEntries]);

  const handleShowSettings = () => setShowSettings(true);
  const handleHideSettings = () => setShowSettings(false);


  if (showSettings) {
    // If settings are shown, render the mock UserSettings component
    return <UserSettings onBack={handleHideSettings} />;
  }

  // Use 'animate-in' classes for a smooth slide-in effect, replicating the original CSS animation
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
                  {/* Optionally display the day of the month or just leave empty */}
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
                <div key={entry._id} className="bg-gray-50 rounded-xl p-3 shadow-sm border border-gray-200">
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
                    { (entry.moodEntryText || '').length > 100 
                      ? (entry.moodEntryText || '').substring(0, 100) + '...' 
                      : (entry.moodEntryText || '') }
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
            <button className="w-full py-3 bg-teal-600 text-white font-semibold rounded-full text-sm transition-all flex justify-center items-center gap-2 hover:bg-teal-700 active:scale-[.99]">
              <FilePlus size={18} /> Add New Entry
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

// NOTE: Since the real app likely uses a router and multiple files, 
// this component is exported stand-alone but includes a mock UserSettings 
// for demonstration purposes within this single file environment.
export default UserProfile;
