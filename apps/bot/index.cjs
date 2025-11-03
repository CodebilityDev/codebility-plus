require('dotenv').config({ path: '/home/ec2-user/bot/.env' });
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Loaded ✅' : 'Missing ❌');
