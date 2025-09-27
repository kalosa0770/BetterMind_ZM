import React, { useState } from 'react';
import { ChevronRight, XIcon } from 'lucide-react';
// **FIX**: Import axios for consistent API calls, as used in Dashboard.js
import axios from 'axios'; 

import './JournalEntryModal.css';

const moodThoughts = [
   { depressed: 'depressed'},
   { anxious : 'anxious'},
    {sad: 'sad'},
    {grateful: 'grateful'},
    {calm: 'calm'},
     {motivated: 'motivated'},
    {frustrated: 'frustrated'},
   {heartbroken: 'heartbroken'},
   {happy: 'happy'},
    {loved: 'loved'},
    {other: 'other'},  
];

const JournalEntryModal = ({ onClose }) => {
    // State to manage the visibility of each step
    const [moodRating, setMoodRating] = useState(null);
    const [showMoodThought, setShowMoodThought] = useState(false);
    const [moodThought, setMoodThought] = useState('')
    const [showMoodQuestions, setShowMoodQuestions] = useState(false);
    const [showJournalText, setShowJournalText] = useState(false);
    const [guidedQuestion, setGuidedQuestion] = useState('');
    const [journalText, setJournalText] = useState('');
    const [isSaving, setIsSaving] = useState(false); // New state for loading indicator

    const getMoodQuestion = (rating) => {
        if (rating >= 8) {
            return "That's wonderful! What is one thing that contributed to you having such a great day?";
        } else if (rating >= 5) {
            return "It sounds like you have mixed feelings today. What's on your mind?";
        } else {
            return "I'm sorry to hear that. What is one thing that made today feel difficult?";
        }
    };

    const getMoodThought = (thought) => {
        if (thought >= 8) {
            return moodThoughts.map((index) => {
                <>
                    <div className='card'>{index.calm}</div>
                    <div className='card'>{index.grateful}</div>
                    <div className='card'>{index.happy}</div>
                    <div className='card'>{index.loved}</div>
                    <div className='card'>{index.motivated}</div>
                    <div className='card'>{index.other}</div>

                </>
            });
        }
    }

    const handleRatingSelect = (rating) => {
        setMoodRating(rating);
        setShowMoodThought(true);
        getMoodThought();
    };

    const handleNextStep = () => {
        setShowMoodQuestions(false);
        setShowJournalText(true);
    };

    

    // **FIX**: Updated function to use axios, include the token, and use dynamic URL
    const saveJournalEntry = async (entryData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Authentication token not found. Cannot save entry.");
            return false;
        }
        
        // Match the baseURL logic used in Dashboard.js
        const hostname = window.location.hostname;
        const baseURL = (hostname === 'localhost' || hostname === '127.0.0.1')
            ? 'http://localhost:3001'
            : `http://${hostname}:3001`;

        try {
            const response = await axios.post(`${baseURL}/api/journal-entries`, entryData, {
                headers: {
                    // **CRITICAL FIX**: Include the JWT token for authentication
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
            // In a real app, you would show an error message here instead of an alert
            alert("Failed to save entry. Please ensure you are logged in and try again."); 
            return false;
        }
    };

    // **FIX**: Updated handleSubmit to only call onClose (and thus fetchData) upon success
    const handleSubmit = async () => {
        if (journalText.trim() === "") {
             alert("Please write something about your day before saving.");
             return;
        }
        
        setIsSaving(true); // Start saving indicator

        const entryData = {
            moodRating,
            journalText,
        };
        
        const success = await saveJournalEntry(entryData);
        
        setIsSaving(false); // Stop saving indicator

        if (success) {
            // **CRITICAL FIX**: Close the modal ONLY upon successful save. 
            // This triggers the dashboard's fetchData to update the graph.
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
                {!moodRating && !showMoodQuestions && (
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

                {/* Show the mood thoughts */}
                {
                    showMoodThought && 
                    <div className='mood-thought-section'>
                        <h1>How are you feeling?</h1>
                        {getMoodThought}

                    </div>
                }
                
                {/* Step 2: Guided Question and Textarea */}
                {showMoodQuestions && (
                    <div className="modal-step">
                        <p>{guidedQuestion}</p>
                        <textarea
                            value={journalText}
                            onChange={(e) => setJournalText(e.target.value)}
                            rows="8"
                            placeholder="Write your thoughts here..."
                            className='form-modal-textarea'
                        ></textarea>
                        <button className="form-modal-next-button" onClick={handleNextStep} disabled={isSaving}>
                            Next <ChevronRight />
                        </button>
                    </div>
                )}
                
                {/* Step 3: Final Submission */}
                {showJournalText && (
                    <div className="modal-step">
                        <p>Any other thoughts on your mind?</p>
                        <textarea
                            value={journalText}
                            onChange={(e) => setJournalText(e.target.value)}
                            rows="8"
                            placeholder="Continue writing here..."
                            className='form-modal-textarea'
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
