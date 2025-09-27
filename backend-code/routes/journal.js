const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// -------------------------------------------------------------------
// IMPORTANT: Replace './authMiddleware' with the correct path to your 
// authentication middleware that sets req.user.id
// -------------------------------------------------------------------
const { protect } = require('../middleware/auth'); 

// ===================================================================
// 1. UPDATED JOURNAL ENTRY SCHEMA
// ===================================================================

const journalEntrySchema = new mongoose.Schema({
    userId: { // <<--- NEW: Links the entry to the user
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    moodRating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    journalText: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);


// ===================================================================
// HELPER FUNCTION (Correct as you implemented it)
// ===================================================================

const getSevenDayCutOff = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    return sevenDaysAgo;
};


// ===================================================================
// 2. API ROUTE TO SAVE A NEW JOURNAL ENTRY (Requires Auth)
// ===================================================================

// Use the 'protect' middleware to ensure the user is logged in
router.post('/journal-entries', protect, async (req, res) => {
    try {
        const { moodRating, journalText } = req.body;
        const userId = req.user.id; // Get ID from the middleware

        const newEntry = new JournalEntry({ moodRating, journalText, userId });
        await newEntry.save();

        res.status(201).json({ 
            message: 'Journal entry saved successfully!', 
            entry: newEntry 
        });
    } catch (error) {
        console.error('Error saving journal entry:', error);
        res.status(500).json({ error: 'Failed to save journal entry.' });
    }
});


// ===================================================================
// 3. CONSOLIDATED API ROUTE TO GET 7-DAY CHART DATA (Requires Auth)
//    - This is the endpoint your dashboard will call.
// ===================================================================

// This single GET route replaces your two previous, conflicting GET routes.
router.get('/journal-entries', protect, async (req, res) => {
    try {
        const sevenDaysAgo = getSevenDayCutOff();
        const userId = req.user.id;

        const sevenDayMoodData = await JournalEntry.find({
            // Secure filter: only entries belonging to the current user
            userId: userId, 
            // Date filter: only entries within the last 7 days
            timestamp: { $gte: sevenDaysAgo }
        })
        .sort ({ timestamp: 1}) // Oldest to newest for correct chart order
        // Select only the fields the frontend needs to minimize data transfer
        .select('timestamp moodRating') 
        .exec();

        res.status(200).json(sevenDayMoodData);
    } catch (error) {
        console.error('Error fetching 7-day journal entries:', error);
        res.status(500).json({ error: 'Failed to fetch journal data.' });
    }
});

module.exports = router;