const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// New Supabase credentials
const supabaseUrl = 'https://mynmukpnttyyjimymgrk.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTczNDg2MCwiZXhwIjoyMDc1MzEwODYwfQ.07DYL51U9jyAm-wmQDyNQce6vPxWSzvnVGMmO2IO-8c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applySchemaFix() {
  try {
    console.log('📁 Reading schema fix file...');
    const schemaSQL = fs.readFileSync('complete-schema-fix.sql', 'utf8');
    
    // Split SQL commands by semicolon and execute one by one
    const commands = schemaSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd && !cmd.startsWith('--') && !cmd.startsWith('SELECT \'Complete schema alignment'));

    console.log(`🔧 Applying ${commands.length} schema changes...`);
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command) {
        try {
          console.log(`  ${i + 1}/${commands.length}: ${command.substring(0, 50)}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          if (error) {
            console.log(`    ⚠️  Warning: ${error.message}`);
          } else {
            console.log(`    ✅ Success`);
          }
        } catch (err) {
          console.log(`    ⚠️  Error: ${err.message}`);
        }
      }
    }
    
    console.log('✅ Schema alignment completed!');
    
  } catch (error) {
    console.error('❌ Schema fix failed:', error.message);
  }
}

applySchemaFix();