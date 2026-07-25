require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('DEBUG - key exists:', !!process.env.SUPABASE_ANON_KEY);
console.log('DEBUG - key length:', process.env.SUPABASE_ANON_KEY?.length);

const supabase = createClient(
    'https://aahgtjbfsvhskjvczcfl.supabase.co',
    process.env.sb_publishable_HbNe8gqVtCSRqGHjpcLOug_z34NGbJe   // store this in .env instead of hardcoding
);

module.exports = supabase;
