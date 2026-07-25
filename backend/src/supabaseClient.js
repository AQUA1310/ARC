require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://aahgtjbfsvhskjvczcfl.supabase.co',
    process.env.sb_publishable_HbNe8gqVtCSRqGHjpcLOug_z34NGbJe   // store this in .env instead of hardcoding
);

module.exports = supabase;