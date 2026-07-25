require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://aahgtjbfsvhskjvczcfl.supabase.co',
    process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;