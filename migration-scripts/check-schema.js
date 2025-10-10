const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mynmukpnttyyjimymgrk.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTczNDg2MCwiZXhwIjoyMDc1MzEwODYwfQ.07DYL51U9jyAm-wmQDyNQce6vPxWSzvnVGMmO2IO-8c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('🔍 Checking actual database schema...');
  
  try {
    // Get a sample record from codev table to see what columns exist
    const { data, error } = await supabase
      .from('codev')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error accessing codev table:', error.message);
    } else {
      console.log('✅ Codev table structure:');
      if (data && data.length > 0) {
        console.log('Available columns:', Object.keys(data[0]));
      } else {
        console.log('Table exists but is empty');
        
        // Try to insert a minimal test record to see what columns are required/available
        const testRecord = { id: 'test-id-123' };
        const { error: insertError } = await supabase
          .from('codev')
          .insert(testRecord);
        
        if (insertError) {
          console.log('Insert test error:', insertError.message);
          
          // This will tell us what columns are actually available
          console.log('\n🔧 Based on the error, let me check what the actual schema looks like...');
        }
      }
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkSchema();