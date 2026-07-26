require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const checkAuth = require('./middleware/checkAuth');
const requireRole = require('./middleware/requireRole');
const checkAuthNoProfileRequired = require('./middleware/checkAuthNoProfileRequired');
const app = express();
app.use(cors());
app.use(express.json());

// Check if a roll number already exists (used during signup)
app.get('/api/profile/check-roll/:rollNumber', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id FROM profiles WHERE roll_number = $1',
            [req.params.rollNumber]
        );
        res.json({ exists: result.rows.length > 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Create a profile (used right after signup)
app.post('/api/profile', checkAuthNoProfileRequired, async (req, res) => {
    const { name, role, rollNumber, branch } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO profiles (id, name, role, roll_number, branch)
 VALUES ($1, $2, $3, $4, $5)
 ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    roll_number = EXCLUDED.roll_number,
    branch = EXCLUDED.branch
 RETURNING *`,
            [req.user.id, name, role, rollNumber || null, branch || null]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create profile' });
    }
});

// Get all students (teacher-facing)
app.get('/api/profiles/students', checkAuth, requireRole(['teacher']), async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM profiles WHERE role = 'student'");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all teachers (any authenticated user)
app.get('/api/profiles/teachers', checkAuth, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM profiles WHERE role = 'teacher'");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

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
app.get('/api/profile', checkAuth, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, role, roll_number, year, semester, batch FROM profiles WHERE id = $1',
            [req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profile not found' });
        }
        const profile = result.rows[0];
        res.json({
            id: profile.id,
            type: profile.role,
            name: profile.name,
            email: req.user.email,
            rollNumber: profile.roll_number,
            year: profile.year,
            semester: profile.semester,
            batch: profile.batch
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
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