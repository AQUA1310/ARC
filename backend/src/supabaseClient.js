require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('DEBUG - key exists:', !!process.env.SUPABASE_ANON_KEY);
console.log('DEBUG - key length:', process.env.SUPABASE_ANON_KEY?.length);

const supabase = createClient(
    'https://aahgtjbfsvhskjvczcfl.supabase.co',
    process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;