import React, { useState } from 'react';
import { ChevronRight, XIcon } from 'lucide-react';

import './JournalEntryModal.css';

const JournalEntryModal = ({ onClose }) => {
    // State to manage the visibility of each step
    const [moodRating, setMoodRating] = useState(null);
    const [showMoodQuestions, setShowMoodQuestions] = useState(false);
    const [showJournalText, setShowJournalText] = useState(false);
    const [guidedQuestion, setGuidedQuestion] = useState('');
    const [journalText, setJournalText] = useState('');

    const getMoodQuestion = (rating) => {
        if (rating >= 8) {
            return "That's wonderful! What is one thing that contributed to you having such a great day?";
        } else if (rating >= 5) {
            return "It sounds like you have mixed feelings today. What's on your mind?";
        } else {
            return "I'm sorry to hear that. What is one thing that made today feel difficult?";
        }
    };

    const handleRatingSelect = (rating) => {
        setMoodRating(rating);
        setGuidedQuestion(getMoodQuestion(rating));
        setShowMoodQuestions(true);
    };

    const handleNextStep = () => {
        setShowMoodQuestions(false);
        setShowJournalText(true);
    };

    const saveJournalEntry = async (entryData) => {
        try {
            const response = await fetch('http://localhost:3001/api/journal-entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entryData),
            });

            if (!response.ok) {
                throw new Error('Failed to save journal entry.');
            }

            const result = await response.json();
            console.log("Journal entry saved:", result);

        } catch (error) {
            console.error("Error saving document: ", error);
        }
    };

    const handleSubmit = () => {
        const entryData = {
            moodRating,
            journalText,
        };
        saveJournalEntry(entryData);
        onClose(); // Close the modal
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className='form-modal-title'>Log a New Journal Entry</h2>
                    <XIcon className="modal-close-button" onClick={onClose} />
                </div>
                {/* Conditional rendering based on boolean states */}
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
                        <button className="form-modal-next-button" onClick={handleNextStep}>
                            Next <ChevronRight />
                        </button>
                    </div>
                )}
                
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
                        <button className="form-modal-submit-button" onClick={handleSubmit}>
                            Save Entry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JournalEntryModal;
