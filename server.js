const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Timer Endzeit (2 Wochen ab Server-Start)
// Achtung: Bei Server-Neustart resetiert sich der Timer!
let endTime = Date.now() + (14 * 24 * 60 * 60 * 1000); // 14 Tage

// API: Aktuelle Restzeit abfragen
app.get('/api/time-left', (req, res) => {
    const now = Date.now();
    const timeLeft = Math.max(0, endTime - now);
    res.json({ 
        timeLeft, 
        endTime,
        success: true 
    });
});

// Admin: Timer zurücksetzen (mit Passwortschutz)
app.post('/api/reset', (req, res) => {
    const { password } = req.body;
    
    // ÄNDERE DIESES PASSWORT!
    if (password === 'admin123') {
        endTime = Date.now() + (14 * 24 * 60 * 60 * 1000);
        res.json({ 
            success: true, 
            message: 'Timer wurde zurückgesetzt!',
            endTime 
        });
    } else {
        res.status(403).json({ 
            success: false, 
            error: 'Falsches Passwort!' 
        });
    }
});

// Admin: Timer Status abfragen
app.get('/api/status', (req, res) => {
    res.json({
        endTime: endTime,
        endTimeReadable: new Date(endTime).toLocaleString('de-DE'),
        serverTime: Date.now(),
        isRunning: endTime > Date.now()
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server läuft auf Port ${PORT}`);
    console.log(`⏰ Timer endet am: ${new Date(endTime).toLocaleString('de-DE')}`);
    console.log(`🌐 Website: http://localhost:${PORT}`);
});
