import React from 'react';
import { Cog, CheckCircle, FileCheck, ClipboardCheck, ArrowRight, FilePlus, Sparkles } from 'lucide-react';
import './UserDashboard.css';

// A helper function to calculate the current streak of journal entries
const calculateCurrentStreak = (entries) => {
  if (!entries || entries.length === 0) {
    return 0;
  }
  
  // Sort entries by timestamp in descending order
  const sortedEntries = [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Create a set of unique dates to handle multiple entries on the same day
  const uniqueDates = Array.from(new Set(sortedEntries.map(entry => {
    const date = new Date(entry.timestamp);
    // Normalize date to the start of the day to ensure correct comparison
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  })));
  
  let streak = 0;
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  let yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (uniqueDates[0] === today.getTime()) {
    streak = 1;
  }
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const previousDate = new Date(uniqueDates[i - 1]);
    const currentDate = new Date(uniqueDates[i]);
    let daysDiff = (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (Math.round(daysDiff) === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// User Profile component that receives data as props
function UserProfile({ journalEntries = [], onLogout }) {
    const getInitials = (name) => {
        if (!name) return 'N/A';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const currentStreak = calculateCurrentStreak(journalEntries);
    const totalEntries = journalEntries ? journalEntries.length : 0;

    const myJourneyData = [
      { id: 1, title: 'Therapy Completed', number: '3', icon: <CheckCircle size={20} /> },
      { id: 2, title: 'Completed Resources', number: '7', icon: <FileCheck size={20} /> },
      { id: 3, title: 'Journal Entries', number: totalEntries, icon: <ClipboardCheck size={20} /> },
    ];

    const generateCalendar = () => {
      const today = new Date();
      const calendarDays = [];
      const entryDates = new Set(journalEntries.map(entry => {
        const d = new Date(entry.timestamp);
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
    
    const calendarDays = generateCalendar();
    
    // Sort entries by timestamp in descending order and get the latest 3
    const latestEntries = journalEntries ? [...journalEntries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3) : [];

    return (
        <div className="user-profile-container">
            <div className="user-profile-header">
                <Cog size={21} className="settings-icon"/>
                <h2>Profile</h2>
            </div>
            
            {/* My journey */}
            <div className="my-journey-section">
                <h2>My Journey</h2>
                <div className="journey-card">
                    {myJourneyData.map((item) => (
                        <div key={item.id} className="journey-detail">
                            <div className="journer-detail-icon">{item.icon}</div>
                            <div className="journey-detail-title">{item.title}</div>
                            <div className="journey-detail-number">{item.number}</div>
                        </div>
                    ))}
                </div>
                <button className='view-journey-content-btn'><ArrowRight size={18} /> View Journey Content</button>
            </div>
            
            {/* New Streak Card with Calendar */}
            <div className="streak-card">
                <div className="streak-header">
                    <Sparkles size={20} />
                    <h3 className="streak-title">Current Streak</h3>
                </div>
                <div className="streak-value">{currentStreak} days</div>
                <div className="calendar-grid">
                    {calendarDays.map((day, index) => (
                        <div key={index} className="calendar-day">
                            <span className="day-of-week">{day.dayOfWeek}</span>
                            <div className={`day-circle ${day.isJournalDay ? 'filled' : ''}`}></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mood Summary */}
            <div className="mood-summary-section">
                <div className="mood-summary-header">
                    <h2>Mood Summary</h2>
                    <button className="view-all-entries-btn">View All Entries <ArrowRight size={15} /></button>
                </div>
                <div className="mood-summary-card">
                    {latestEntries.length > 0 ? (
                        latestEntries.map((entry) => (
                            <div key={entry._id} className="mood-entry">
                                <div className="mood-entry-header">
                                    <span className="mood-entry-date">{new Date(entry.timestamp).toLocaleDateString()}</span>
                                    <span className="mood-entry-rating">Mood: {entry.moodRating}/10</span>
                                </div>
                                <div className="mood-entry-content">
                                    { (entry.moodEntryText || '').length > 100 
                                      ? (entry.moodEntryText || '').substring(0, 100) + '...' 
                                      : (entry.moodEntryText || '') }
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-entries-text">No entries to display.</p>
                    )}
                </div>
                <div className="mood-summary-footer">
                    <button className="add-entry-btn"><FilePlus size={18} />Add New Entry</button>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
