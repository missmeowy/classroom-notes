// script.js - Fixed & Improved

let recognition = null;
let isRecording = false;
let transcriptText = "";

// Get all elements
const recordBtn = document.getElementById('recordBtn');
const recordText = document.getElementById('recordText');
const status = document.getElementById('status');
const transcriptBox = document.getElementById('transcriptBox');
const summaryBox = document.getElementById('summaryBox');
const mindmapBox = document.getElementById('mindmapBox');

// Tab Switching
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
    });
});

// Recording Logic
recordBtn.addEventListener('click', () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        alert("Please use Chrome or Edge browser for speech recognition.");
        return;
    }

    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

function startRecording() {
    isRecording = true;
    recordBtn.classList.add('recording');
    recordText.textContent = "Stop Recording";
    status.textContent = "🎙️ Listening... Speak now";
    transcriptBox.innerHTML = "<p style='color:#888;'>Listening...</p>";

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + " ";
            }
        }
        if (finalTranscript) {
            transcriptText += finalTranscript;
            transcriptBox.innerHTML = `<p>${transcriptText}</p>`;
            transcriptBox.scrollTop = transcriptBox.scrollHeight;
        }
    };

    recognition.onerror = () => status.textContent = "Error in recognition";
    recognition.onend = () => { if (isRecording) recognition.start(); };

    recognition.start();
}

function stopRecording() {
    isRecording = false;
    recordBtn.classList.remove('recording');
    recordText.textContent = "Start Recording";
    status.textContent = "✅ Recording stopped • Generating notes...";

    if (recognition) recognition.stop();

    // Generate Summary and Mind Map after stopping
    setTimeout(() => {
        generateSummary();
        generateMindMap();
        status.textContent = "✅ Done! Check Summary & Mind Map tabs";
    }, 600);
}

// Generate Summary and Save to Backend
async function generateSummary() {
    const noteTitle = "Class 2 AI - Lecture Notes";
    
    const newNote = {
        title: noteTitle,
        content: transcriptText || "No transcript available"
    };

    try {
        const response = await fetch('http://localhost:5000/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNote)
        });

        const savedNote = await response.json();
        console.log("Note saved:", savedNote);

        summaryBox.innerHTML = `
            <h3>📝 Summary</h3>
            <p>${transcriptText || "No content yet"}</p>
            <small style="color:#888;">✅ Saved to backend with ID: ${savedNote.id}</small>
        `;
    } catch (err) {
        console.error("Failed to save note:", err);
        summaryBox.innerHTML = `<p style="color:red;">Failed to save note. Is backend running?</p>`;
    }
}

// Generate Mind Map
function generateMindMap() {
    mindmapBox.innerHTML = `
        <h3>🧠 Mind Map</h3>
        <div style="background:#1a1a2e; padding:25px; border-radius:12px; text-align:center;">
            <div style="font-size:18px; margin:15px; color:#a5b4fc;">DBMS & Data Storage</div>
            <div style="display:flex; justify-content:center; gap:30px; flex-wrap:wrap;">
                <div style="background:#4f46e5; padding:12px 20px; border-radius:8px; color:white;">Data Security</div>
                <div style="background:#22c55e; padding:12px 20px; border-radius:8px; color:white;">Instruction Sets</div>
                <div style="background:#f59e0b; padding:12px 20px; border-radius:8px; color:white;">Software Sheets</div>
            </div>
        </div>
        <p style="text-align:center; margin-top:20px; color:#888;">Real interactive mind map coming in next update</p>
    `;
}

// Connect Button
document.getElementById('connectBtn').addEventListener('click', () => {
    alert("Smart Device Connected (Simulated)");
});

// Auto switch to transcription tab on load
document.getElementById('transcript').classList.add('active');