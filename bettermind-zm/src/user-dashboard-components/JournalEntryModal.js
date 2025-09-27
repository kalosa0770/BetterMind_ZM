import React, { useState, useCallback } from 'react';
import { ChevronRight, XIcon } from 'lucide-react';
import axios from 'axios'; 

// NOTE: The external CSS import is commented out, assuming the necessary 
// styles will be applied via the class names below.
import './JournalEntryModal.css'; 


// NOTE: The external CSS import is commented out, assuming the necessary 
// styles will be applied via the class names below.
// import './JournalEntryModal.css'; 

// ===================================================================
// 1. REFACATORED MOOD THOUGHTS WITH RANGES (1-4, 5-7, 8-10)
// ===================================================================
const moodThoughts = [
   // Low Mood Range (1-4)
   { name: 'Depressed', range: 'Low', emoji: '😔' },
   { name: 'Anxious', range: 'Low', emoji: '😥' },
   { name: 'Sad', range: 'Low', emoji: '😢' },
   { name: 'Heartbroken', range: 'Low', emoji: '💔' },
   { name: 'Overwhelmed', range: 'Low', emoji: '😵‍💫' },
   
   // Mid Mood Range (5-7)
   { name: 'Tired', range: 'Mid', emoji: '😴' },
   { name: 'Confused', range: 'Mid', emoji: '🤔' },
   { name: 'Bored', range: 'Mid', emoji: '😑' },
   { name: 'Neutral', range: 'Mid', emoji: '😶' },
   { name: 'Uncertain', range: 'Mid', emoji: '🤷‍♀️' },

   // High Mood Range (8-10)
   { name: 'Grateful', range: 'High', emoji: '🙏' },
   { name: 'Calm', range: 'High', emoji: '😌' },
   { name: 'Motivated', range: 'High', emoji: '🚀' },
   { name: 'Happy', range: 'High', emoji: '😀' },
   { name: 'Loved', range: 'High', emoji: '🥰' },
   
   // Always available, regardless of rating
   { name: 'Other', range: 'All', emoji: '✨' }, 
];

// Helper Component for Mood Thought Selection (Step 2)
const MoodThoughtSelector = ({ rating, selectedThought, onSelect }) => {
    
    // Determine the required range based on the rating
    let requiredRange;
    if (rating >= 8) {
        requiredRange = 'High'; // Ratings 8, 9, 10
    } else if (rating >= 5) {
        requiredRange = 'Mid';  // Ratings 5, 6, 7
    } else {
        requiredRange = 'Low';  // Ratings 1, 2, 3, 4
    }

    // Filter the mood thoughts based on the determined range or 'All'
    const filteredThoughts = moodThoughts.filter(
        (thought) => thought.range === requiredRange || thought.range === 'All'
    );

    return (
        <div className="mood-thought-tags-container">
            {filteredThoughts.map((thought) => (
                // Loop through the filtered array and conditionally apply 'selected-thought' class
                <div
                    key={thought.name}
                    className={`mood-thought-card ${selectedThought === thought.name ? 'selected-thought' : ''}`}
                    onClick={() => onSelect(thought.name)} // Calls handleThoughtSelect
                >
                    <span className="mood-emoji">{thought.emoji}</span> 
                    {thought.name}
                </div>
            ))}
        </div>
    );
};

const JournalEntryModal = ({ onClose }) => {
    // State to manage the visibility and data
    const [moodRating, setMoodRating] = useState(null);
    const [showMoodThought, setShowMoodThought] = useState(false);
    const [moodThought, setMoodThought] = useState(''); // Stores the selected tag name
    const [showJournalText, setShowJournalText] = useState(false);
    const [guidedQuestion, setGuidedQuestion] = useState('');
    const [journalText, setJournalText] = useState('');
    const [isSaving, setIsSaving] = useState(false); 

    const getMoodQuestion = (rating) => {
        if (rating >= 8) {
            return "That's wonderful! What is one thing that contributed to you having such a great day?";
        } else if (rating >= 5) {
            return "It sounds like you have mixed feelings today. What's on your mind?";
        } else {
            return "I'm sorry to hear that. What is one thing that made today feel difficult?";
        }
    };

    // Handler to select the mood rating and transition to the thought selection
    const handleRatingSelect = (rating) => {
        setMoodRating(rating);
        setGuidedQuestion(getMoodQuestion(rating)); // Pre-set the question
        setShowMoodThought(true);
    };

    // Handler to select the mood thought and transition to the main journal step
    const handleThoughtSelect = (thoughtName) => {
        setMoodThought(thoughtName);
        setShowMoodThought(false);
        setShowJournalText(true);
    };

    // Function to handle the saving of the entry
    const saveJournalEntry = async (entryData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Authentication token not found. Cannot save entry.");
            console.warn("Authentication required. Please ensure you are logged in.");
            return false;
        }
        
        const hostname = window.location.hostname;
        const baseURL = (hostname === 'localhost' || hostname === '127.0.0.1')
            ? 'http://localhost:3001'
            : `http://${hostname}:3001`;

        try {
            const response = await axios.post(`${baseURL}/api/journal-entries`, entryData, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            

            if (response.status === 201) {
                console.log("Journal entry saved successfully:", response.data);
                return true;
            }
            return false;

        } catch (error) {
            console.error("Error saving document:", error.response ? error.response.data : error.message);
            console.warn("Failed to save entry. Please ensure you are logged in and try again."); 
            return false;
        }
    };

    // Final Submission Handler
    const handleSubmit = async () => {
        if (journalText.trim() === "") {
             console.warn("Please write something about your day before saving.");
             return;
        }
        
        setIsSaving(true); 

        // Include the selected moodThought in the payload
        const entryData = {
            moodRating,
            moodThought, // New field being saved
            journalText,
        };
        
        const success = await saveJournalEntry(entryData);
        
        setIsSaving(false); 

        if (success) {
            onClose(); 
        } 
    };

    return (
        
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className='form-modal-title'>Log a New Journal Entry</h2>
                    <XIcon className="modal-close-button" onClick={isSaving ? null : onClose} />
                </div>
                
                {/* Step 1: Mood Rating Selection */}
                {moodRating === null && !showMoodThought && !showJournalText && (
                    <div className="modal-step">
                        <p>What is your mood rating today?</p>
                        <div className="mood-rating-container">
                            {[...Array(10)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handleRatingSelect(i + 1)}
                                    className={`mood-rating-button ${moodRating === i + 1 ? 'selected' : ''}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Mood Thought Selection */}
                {showMoodThought && (
                    <div className='modal-step'>
                        <h1>How are you feeling right now, based on your mood rating?</h1>
                        <p className="mood-thought-subtitle">Select the most dominant emotion.</p>
                        
                        {/* Call the component that handles filtering and rendering */}
                        <MoodThoughtSelector 
                            rating={moodRating}
                            selectedThought={moodThought}
                            onSelect={handleThoughtSelect} 
                        />
                    </div>
                )}
                
                {/* Step 3: Guided Question and Journal Text (Final Step) */}
                {showJournalText && (
                    <div className="modal-step">
                        <p className='guided-question-text'>
                            {guidedQuestion}
                        </p>
                        <textarea
                            value={journalText}
                            onChange={(e) => setJournalText(e.target.value)}
                            rows="8"
                            placeholder="Start writing here..."
                            className='form-modal-textarea'
                            disabled={isSaving}
                        ></textarea>
                        
                        <button 
                            className="form-modal-submit-button" 
                            onClick={handleSubmit} 
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Entry'}
                        </button>
                    </div>
                )}
            </div>
        </div>
        
    );
};

export default JournalEntryModal;