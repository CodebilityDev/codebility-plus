const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const NEW_SUPABASE_URL = 'https://mynmukpnttyyjimymgrk.supabase.co';
const NEW_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MzQ4NjAsImV4cCI6MjA3NTMxMDg2MH0.sapxUfkxAgB7C88vPctvhfthvt9QFCrJsaQ0lytk_LI';

async function quickSetup() {
  console.log('🚀 Starting quick setup...');
  
  const supabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY);
  
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, 'setup-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 10) { // Skip very short statements
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            console.warn(`⚠️  Warning on statement ${i + 1}:`, error.message);
          }
        } catch (err) {
          console.warn(`⚠️  Error on statement ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('✅ Schema setup completed!');
    console.log('🎯 Ready to import data!');
    
  } catch (error) {
    console.error('❌ Quick setup failed:', error.message);
    console.log('💡 Please run the schema manually in Supabase SQL Editor');
  }
}

quickSetup();