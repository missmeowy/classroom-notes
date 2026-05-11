const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let notes = [];

// Get all saved notes
app.get('/notes', (req, res) => {
    res.json(notes);
});

// Save new note from frontend
app.post('/notes', (req, res) => {
    const { title, content } = req.body;

    const newNote = {
        id: Date.now().toString(),
        title: title || "Lecture Notes",
        content: content || "",
        date: new Date().toISOString()
    };

    notes.unshift(newNote);
    console.log("✅ Note Saved:", newNote.title);

    res.json({ success: true, note: newNote });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});