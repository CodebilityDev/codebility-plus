const { createClient } = require('@supabase/supabase-js');

// Database credentials
const OLD_SUPABASE_URL = 'https://hibnlysaokybrsufrdwp.supabase.co';
const OLD_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpYm5seXNhb2t5YnJzdWZyZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NjM1NjUsImV4cCI6MjA1MzAzOTU2NX0.7_QnkBcgefEzVcqrC5vFi4yVqbVpdW5qyWSF8QSiL2o';

const NEW_SUPABASE_URL = 'https://mynmukpnttyyjimymgrk.supabase.co';
const NEW_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MzQ4NjAsImV4cCI6MjA3NTMxMDg2MH0.sapxUfkxAgB7C88vPctvhfthvt9QFCrJsaQ0lytk_LI';

const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY);

async function getTableCount(supabase, tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      return `Error: ${error.message}`;
    }
    
    return count || 0;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

async function quickComparison() {
  console.log('🔍 QUICK DATABASE COMPARISON');
  console.log('================================================================================');
  
  const tables = [
    'roles', 'skill_category', 'codev', 'project', 'project_members',
    'education', 'work_experience', 'codev_points', 'kanban_board',
    'kanban_column', 'kanban_sprint', 'task', 'attendance',
    'attendance_summary', 'job_listings', 'job_applications'
  ];
  
  console.log('Table'.padEnd(20) + 'Old DB'.padEnd(10) + 'New DB'.padEnd(10) + 'Status');
  console.log('-'.repeat(50));
  
  let totalOld = 0;
  let totalNew = 0;
  
  for (const table of tables) {
    const oldCount = await getTableCount(oldSupabase, table);
    const newCount = await getTableCount(newSupabase, table);
    
    const oldStr = typeof oldCount === 'number' ? oldCount.toString() : 'Error';
    const newStr = typeof newCount === 'number' ? newCount.toString() : 'Error';
    
    let status = '❌ Error';
    if (typeof oldCount === 'number' && typeof newCount === 'number') {
      if (oldCount === 0 && newCount === 0) {
        status = '⚪ Empty';
      } else if (oldCount === newCount) {
        status = '✅ Match';
      } else if (newCount === 0) {
        status = '❌ Missing';
      } else {
        status = '⚠️ Partial';
      }
      
      totalOld += oldCount;
      totalNew += newCount;
    }
    
    console.log(table.padEnd(20) + oldStr.padEnd(10) + newStr.padEnd(10) + status);
  }
  
  console.log('-'.repeat(50));
  console.log('TOTAL'.padEnd(20) + totalOld.toString().padEnd(10) + totalNew.toString().padEnd(10));
  console.log('');
  
  // Show which tables are completely missing data
  console.log('❌ TABLES WITH NO DATA IN NEW DB:');
  for (const table of tables) {
    const oldCount = await getTableCount(oldSupabase, table);
    const newCount = await getTableCount(newSupabase, table);
    
    if (typeof oldCount === 'number' && typeof newCount === 'number' && oldCount > 0 && newCount === 0) {
      console.log(`  - ${table}: ${oldCount} records lost`);
    }
  }
}

async function checkForAdditionalTables() {
  console.log('\n🔍 CHECKING FOR ADDITIONAL TABLES IN OLD DB');
  console.log('================================================================================');
  
  // Test some additional common table names
  const additionalTables = [
    'auth', 'users', 'profiles', 'certificates', 'achievements', 
    'notifications', 'messages', 'settings', 'logs', 'skills',
    'user_skills', 'codev_skills', 'project_skills', 'clients',
    'teams', 'departments', 'files', 'uploads'
  ];
  
  const foundTables = [];
  
  for (const table of additionalTables) {
    const count = await getTableCount(oldSupabase, table);
    if (typeof count === 'number' && count > 0) {
      foundTables.push({ table, count });
    }
  }
  
  if (foundTables.length > 0) {
    console.log('📋 ADDITIONAL TABLES FOUND:');
    for (const { table, count } of foundTables) {
      console.log(`  ✅ ${table}: ${count} records`);
    }
  } else {
    console.log('ℹ️  No additional tables found with test names');
  }
  
  return foundTables;
}

async function checkNewDbStatus() {
  console.log('\n🔍 CHECKING NEW DATABASE STATUS');
  console.log('================================================================================');
  
  try {
    // Test if we can access the new database at all
    const { data, error } = await newSupabase
      .from('roles')
      .select('*')
      .limit(5);
    
    if (error) {
      console.log(`❌ Cannot access roles table: ${error.message}`);
    } else {
      console.log(`✅ Can access roles table: ${data.length} sample records`);
      if (data.length > 0) {
        console.log(`📋 Sample role: ${JSON.stringify(data[0], null, 2)}`);
      }
    }
    
    // Check if it's a permissions issue
    const { data: authData, error: authError } = await newSupabase.auth.getSession();
    console.log(`🔐 Auth session: ${authError ? 'No session' : 'Has session'}`);
    
  } catch (error) {
    console.log(`❌ Error checking new database: ${error.message}`);
  }
}

async function main() {
  await quickComparison();
  await checkForAdditionalTables();
  await checkNewDbStatus();
  
  console.log('\n🎯 RECOMMENDATIONS:');
  console.log('================================================================================');
  console.log('1. If tables show "Missing" status, the data needs to be re-migrated');
  console.log('2. Check if RLS (Row Level Security) is blocking data access');
  console.log('3. Verify that the schema exists in the new database');
  console.log('4. Consider using service role key instead of anon key for full access');
  console.log('5. Check Supabase dashboard directly to confirm what data exists');
}

main().catch(console.error);