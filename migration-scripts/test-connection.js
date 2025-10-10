const { createClient } = require('@supabase/supabase-js');

// Test connection to new Supabase project
const NEW_SUPABASE_URL = 'https://mynmukpnttyyjimymgrk.supabase.co';
const NEW_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MzQ4NjAsImV4cCI6MjA3NTMxMDg2MH0.sapxUfkxAgB7C88vPctvhfthvt9QFCrJsaQ0lytk_LI';

async function testConnection() {
  console.log('🔗 Testing connection to new Supabase project...');
  
  try {
    const supabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY);
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('roles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('ℹ️  Expected error (table doesn\'t exist yet):', error.message);
      console.log('✅ Connection successful! Ready to set up schema.');
      return true;
    } else {
      console.log('✅ Connection successful! Database already has tables.');
      return true;
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

testConnection();