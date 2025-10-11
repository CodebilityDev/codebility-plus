const { createClient } = require('@supabase/supabase-js');

// ==============================================
// DATABASE CREDENTIALS
// ==============================================

// OLD Supabase (source)
const OLD_SUPABASE_URL = 'https://hibnlysaokybrsufrdwp.supabase.co';
const OLD_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpYm5seXNhb2t5YnJzdWZyZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NjM1NjUsImV4cCI6MjA1MzAzOTU2NX0.7_QnkBcgefEzVcqrC5vFi4yVqbVpdW5qyWSF8QSiL2o';

// NEW Supabase (destination)
const NEW_SUPABASE_URL = 'https://mynmukpnttyyjimymgrk.supabase.co';
const NEW_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MzQ4NjAsImV4cCI6MjA3NTMxMDg2MH0.sapxUfkxAgB7C88vPctvhfthvt9QFCrJsaQ0lytk_LI';

// Create clients
const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY);

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

const logProgress = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// ==============================================
// INVESTIGATION FUNCTIONS
// ==============================================

async function getAllTablesFromDatabase(supabase, databaseName) {
  try {
    logProgress(`Getting all tables from ${databaseName}...`);
    
    // Use RPC to get table information
    const { data, error } = await supabase.rpc('get_table_info', {});
    
    if (error) {
      // Fallback: try direct query
      logProgress(`RPC failed, trying direct query for ${databaseName}...`);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE');
      
      if (fallbackError) {
        console.error(`Error getting tables from ${databaseName}:`, fallbackError);
        return [];
      }
      
      return fallbackData.map(row => row.table_name);
    }
    
    return data;
  } catch (error) {
    console.error(`Error getting tables from ${databaseName}:`, error);
    return [];
  }
}

async function getTableRowCount(supabase, tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      return `Error: ${error.message}`;
    }
    
    return count;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

async function getTableSchema(supabase, tableName) {
  try {
    // Get a sample row to understand the schema
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      return { error: error.message };
    }
    
    if (data && data.length > 0) {
      return { columns: Object.keys(data[0]) };
    }
    
    return { columns: [], note: 'No data in table' };
  } catch (error) {
    return { error: error.message };
  }
}

async function compareKnownTables() {
  logProgress('🔍 Comparing known tables between old and new databases...');
  
  const knownTables = [
    'roles',
    'skill_category', 
    'codev',
    'project',
    'project_members',
    'education',
    'work_experience',
    'codev_points',
    'kanban_board',
    'kanban_column', 
    'kanban_sprint',
    'task',
    'attendance',
    'attendance_summary',
    'job_listings',
    'job_applications'
  ];
  
  console.log('\n📊 TABLE COMPARISON REPORT');
  console.log('='.repeat(80));
  console.log('Table Name'.padEnd(25) + 'Old DB Count'.padEnd(15) + 'New DB Count'.padEnd(15) + 'Status');
  console.log('-'.repeat(80));
  
  let totalOldRecords = 0;
  let totalNewRecords = 0;
  
  for (const table of knownTables) {
    const oldCount = await getTableRowCount(oldSupabase, table);
    const newCount = await getTableRowCount(newSupabase, table);
    
    const oldCountStr = typeof oldCount === 'number' ? oldCount.toString() : oldCount;
    const newCountStr = typeof newCount === 'number' ? newCount.toString() : newCount;
    
    const status = 
      typeof oldCount === 'number' && typeof newCount === 'number' 
        ? (oldCount === newCount ? '✅ Match' : '⚠️  Mismatch')
        : '❌ Error';
    
    console.log(
      table.padEnd(25) + 
      oldCountStr.padEnd(15) + 
      newCountStr.padEnd(15) + 
      status
    );
    
    if (typeof oldCount === 'number') totalOldRecords += oldCount;
    if (typeof newCount === 'number') totalNewRecords += newCount;
  }
  
  console.log('-'.repeat(80));
  console.log(`TOTALS:`.padEnd(25) + `${totalOldRecords}`.padEnd(15) + `${totalNewRecords}`.padEnd(15));
  console.log('='.repeat(80));
}

async function checkForMissingTables() {
  logProgress('🔍 Checking for tables that might exist in old DB but not in our migration list...');
  
  // Try to get a more comprehensive list by testing common table patterns
  const possibleTables = [
    // Authentication related
    'auth.users', 'users', 'profiles', 'user_profiles',
    
    // Additional possible tables
    'certificates', 'achievements', 'notifications', 'messages',
    'files', 'documents', 'uploads', 'media',
    'comments', 'reviews', 'ratings', 'feedback',
    'settings', 'configurations', 'preferences',
    'logs', 'audit_logs', 'activity_logs',
    'tags', 'categories', 'labels',
    'teams', 'groups', 'departments',
    'permissions', 'user_roles', 'role_permissions',
    'sessions', 'tokens', 'api_keys',
    'webhooks', 'integrations', 'apis',
    'reports', 'analytics', 'metrics',
    'subscriptions', 'billing', 'payments',
    'events', 'calendar', 'schedule',
    'inventory', 'assets', 'resources',
    'clients', 'customers', 'vendors',
    'invoices', 'transactions', 'orders',
    
    // Possible variations of existing tables
    'user_skills', 'skills', 'skill_ratings',
    'project_skills', 'project_tasks', 'project_files',
    'codev_skills', 'codev_projects', 'codev_certificates',
    'job_requirements', 'job_skills', 'job_categories',
    'application_status', 'application_notes',
    'attendance_points', 'attendance_rules',
    'kanban_tasks', 'kanban_cards', 'kanban_labels',
    
    // System tables
    'migrations', 'schema_versions', 'database_versions'
  ];
  
  console.log('\n🔍 CHECKING FOR ADDITIONAL TABLES');
  console.log('='.repeat(60));
  
  const foundTables = [];
  
  for (const table of possibleTables) {
    try {
      const count = await getTableRowCount(oldSupabase, table);
      if (typeof count === 'number') {
        foundTables.push({ table, count });
        console.log(`✅ Found: ${table} (${count} records)`);
      }
    } catch (error) {
      // Ignore errors for non-existent tables
    }
  }
  
  if (foundTables.length === 0) {
    console.log('ℹ️  No additional tables found with common names');
  }
  
  return foundTables;
}

async function investigateTableDifferences() {
  logProgress('🔬 Investigating table schema differences...');
  
  const problematicTables = ['roles', 'codev', 'work_experience', 'codev_points', 'attendance', 'job_listings', 'job_applications'];
  
  console.log('\n🔬 SCHEMA COMPARISON');
  console.log('='.repeat(80));
  
  for (const table of problematicTables) {
    console.log(`\n📋 Table: ${table}`);
    console.log('-'.repeat(40));
    
    const oldSchema = await getTableSchema(oldSupabase, table);
    const newSchema = await getTableSchema(newSupabase, table);
    
    if (oldSchema.columns && newSchema.columns) {
      const oldColumns = new Set(oldSchema.columns);
      const newColumns = new Set(newSchema.columns);
      
      const missingInNew = [...oldColumns].filter(col => !newColumns.has(col));
      const extraInNew = [...newColumns].filter(col => !oldColumns.has(col));
      
      if (missingInNew.length > 0) {
        console.log(`⚠️  Missing in NEW: ${missingInNew.join(', ')}`);
      }
      
      if (extraInNew.length > 0) {
        console.log(`ℹ️  Extra in NEW: ${extraInNew.join(', ')}`);
      }
      
      if (missingInNew.length === 0 && extraInNew.length === 0) {
        console.log(`✅ Schemas match`);
      }
    } else {
      console.log(`❌ Could not compare schemas`);
      if (oldSchema.error) console.log(`  Old DB: ${oldSchema.error}`);
      if (newSchema.error) console.log(`  New DB: ${newSchema.error}`);
    }
  }
}

async function checkDataIntegrity() {
  logProgress('🔍 Checking data integrity by sampling records...');
  
  console.log('\n🧪 DATA SAMPLE COMPARISON');
  console.log('='.repeat(80));
  
  const tablesToSample = ['codev', 'roles', 'job_applications'];
  
  for (const table of tablesToSample) {
    console.log(`\n📊 Sampling ${table}:`);
    
    try {
      // Get first record from old DB
      const { data: oldData, error: oldError } = await oldSupabase
        .from(table)
        .select('*')
        .limit(1);
      
      // Get first record from new DB
      const { data: newData, error: newError } = await newSupabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (oldError || newError) {
        console.log(`❌ Error accessing ${table}`);
        if (oldError) console.log(`  Old: ${oldError.message}`);
        if (newError) console.log(`  New: ${newError.message}`);
        continue;
      }
      
      if (oldData && oldData.length > 0 && newData && newData.length > 0) {
        const oldKeys = Object.keys(oldData[0]);
        const newKeys = Object.keys(newData[0]);
        
        console.log(`  Old columns (${oldKeys.length}): ${oldKeys.slice(0, 5).join(', ')}${oldKeys.length > 5 ? '...' : ''}`);
        console.log(`  New columns (${newKeys.length}): ${newKeys.slice(0, 5).join(', ')}${newKeys.length > 5 ? '...' : ''}`);
        
        const missingKeys = oldKeys.filter(key => !newKeys.includes(key));
        if (missingKeys.length > 0) {
          console.log(`  ⚠️  Missing in new: ${missingKeys.join(', ')}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error sampling ${table}: ${error.message}`);
    }
  }
}

// ==============================================
// MAIN INVESTIGATION FUNCTION
// ==============================================

async function runFullInvestigation() {
  console.log('🕵️  SUPABASE MIGRATION INVESTIGATION');
  console.log('='.repeat(80));
  console.log(`Old DB: ${OLD_SUPABASE_URL}`);
  console.log(`New DB: ${NEW_SUPABASE_URL}`);
  console.log('='.repeat(80));
  
  try {
    // Test connections
    logProgress('Testing database connections...');
    
    const { data: oldTest } = await oldSupabase.from('roles').select('count').limit(1);
    const { data: newTest } = await newSupabase.from('roles').select('count').limit(1);
    
    console.log('✅ Both databases are accessible');
    
    // Run investigations
    await compareKnownTables();
    await checkForMissingTables();
    await investigateTableDifferences();
    await checkDataIntegrity();
    
    console.log('\n🎯 SUMMARY & RECOMMENDATIONS');
    console.log('='.repeat(80));
    console.log('1. Check table count mismatches above');
    console.log('2. Review missing columns in schema comparison');
    console.log('3. Consider running a fresh migration for tables with 0 records in new DB');
    console.log('4. Verify RLS policies are not blocking data visibility');
    console.log('5. Check if service role key is needed for complete data access');
    
  } catch (error) {
    console.error('❌ Investigation failed:', error);
  }
}

// ==============================================
// CLI INTERFACE
// ==============================================

if (require.main === module) {
  runFullInvestigation();
}

module.exports = {
  runFullInvestigation,
  compareKnownTables,
  checkForMissingTables
};