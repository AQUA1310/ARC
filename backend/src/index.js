require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const checkAuth = require('./middleware/checkAuth');
const requireRole = require('./middleware/requireRole');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Test route — confirms actual DB connectivity
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Any authenticated user (student or teacher) can access
app.get('/api/profile', checkAuth, (req, res) => {
    res.json({ message: `Hello ${req.user.name}`, role: req.user.role });
});

// Only teachers can access
app.get('/api/teacher/students', checkAuth, requireRole(['teacher']), (req, res) => {
    res.json({ message: 'Teacher-only data here' });
});

// Only students can access
app.get('/api/student/dashboard', checkAuth, requireRole(['student']), (req, res) => {
    res.json({ message: `Student dashboard for ${req.user.name}` });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));