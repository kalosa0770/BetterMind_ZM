const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Define the Journal Entry Schema.
const journalEntrySchema = new mongoose.Schema({
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

// Create the Mongoose model from the schema.
const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

// API route to save a new journal entry.
router.post('/journal-entries', async (req, res) => {
    try {
        const { moodRating, journalText } = req.body;
        
        const newEntry = new JournalEntry({ moodRating, journalText });
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

// New API route to retrieve all journal entries.
router.get('/journal-entries', async (req, res) => {
    try {
        // Find all entries and sort them by timestamp in ascending order.
        const entries = await JournalEntry.find().sort({ timestamp: 1 });
        res.status(200).json(entries);
    } catch (error) {
        console.error('Error fetching journal entries:', error);
        res.status(500).json({ error: 'Failed to fetch journal entries.' });
    }
});

module.exports = router;
