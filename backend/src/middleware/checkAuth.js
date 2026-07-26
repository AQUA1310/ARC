const supabase = require('../supabaseClient');
const pool = require('../db');

async function checkAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    try {
        const result = await pool.query(
            'SELECT id, name, role FROM profiles WHERE id = $1',
            [data.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No profile found for this user' });
        }

        req.user = {
            id: data.user.id,
            email: data.user.email,
            name: result.rows[0].name,
            role: result.rows[0].role
        };
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error while fetching profile' });
    }
}

module.exports = checkAuth;