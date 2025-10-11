const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ==============================================
// CONFIGURATION
// ==============================================

// OLD Supabase (source)
const OLD_SUPABASE_URL = 'https://hibnlysaokybrsufrdwp.supabase.co';
const OLD_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpYm5seXNhb2t5YnJzdWZyZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NjM1NjUsImV4cCI6MjA1MzAzOTU2NX0.7_QnkBcgefEzVcqrC5vFi4yVqbVpdW5qyWSF8QSiL2o';

// NEW Supabase (destination) - Using SERVICE ROLE for full access
const NEW_SUPABASE_URL = 'https://mynmukpnttyyjimymgrk.supabase.co';
const NEW_SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTczNDg2MCwiZXhwIjoyMDc1MzEwODYwfQ.07DYL51U9jyAm-wmQDyNQce6vPxWSzvnVGMmO2IO-8c';

// Create clients
const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);
const newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_KEY);

// ==============================================
// UTILITY FUNCTIONS
// ==============================================

const logProgress = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

const saveToFile = (filename, data) => {
  const filePath = path.join(__dirname, 'exports', filename);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  logProgress(`Saved ${data.length} records to ${filename}`);
};

// ==============================================
// MIGRATION FUNCTIONS
// ==============================================

async function exportTable(tableName) {
  try {
    logProgress(`Exporting ${tableName}...`);
    
    const { count, error: countError } = await oldSupabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error(`Error counting ${tableName}:`, countError);
      return [];
    }

    logProgress(`${tableName} has ${count} records`);
    
    if (count === 0) {
      return [];
    }

    // Get all data in batches
    const batchSize = 1000;
    let allData = [];
    
    for (let offset = 0; offset < count; offset += batchSize) {
      const { data, error } = await oldSupabase
        .from(tableName)
        .select('*')
        .range(offset, offset + batchSize - 1);
      
      if (error) {
        console.error(`Error exporting ${tableName}:`, error);
        continue;
      }
      
      allData = allData.concat(data);
      logProgress(`Exported ${allData.length}/${count} from ${tableName}`);
    }
    
    saveToFile(`${tableName}.json`, allData);
    return allData;
    
  } catch (error) {
    console.error(`Error exporting ${tableName}:`, error);
    return [];
  }
}

async function importTable(tableName, data, options = {}) {
  if (!data || data.length === 0) {
    logProgress(`Skipping ${tableName} - no data`);
    return { success: true, imported: 0, errors: [] };
  }

  try {
    logProgress(`Importing ${data.length} records to ${tableName}...`);
    
    const batchSize = 50; // Smaller batches for better error handling
    let imported = 0;
    const errors = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      const { data: insertedData, error } = await newSupabase
        .from(tableName)
        .insert(batch)
        .select();
      
      if (error) {
        console.error(`Error importing batch to ${tableName}:`, error);
        errors.push({
          batch: i / batchSize + 1,
          error: error.message,
          records: batch.length
        });
        
        // Try individual records if batch fails
        if (options.retryIndividual) {
          for (const record of batch) {
            try {
              const { error: individualError } = await newSupabase
                .from(tableName)
                .insert([record]);
              
              if (!individualError) {
                imported++;
              } else {
                errors.push({
                  record: record.id || record.name || 'unknown',
                  error: individualError.message
                });
              }
            } catch (e) {
              errors.push({
                record: record.id || record.name || 'unknown',
                error: e.message
              });
            }
          }
        }
      } else {
        imported += insertedData ? insertedData.length : batch.length;
        logProgress(`Imported ${imported}/${data.length} to ${tableName}`);
      }
    }
    
    const success = imported > 0;
    logProgress(`${success ? '✅' : '❌'} Completed ${tableName}: ${imported}/${data.length} records imported`);
    
    return { success, imported, errors, total: data.length };
    
  } catch (error) {
    console.error(`Critical error importing ${tableName}:`, error);
    return { success: false, imported: 0, errors: [{ error: error.message }], total: data.length };
  }
}

async function checkAndCreateMissingTables() {
  logProgress('🔍 Checking for missing tables and data...');
  
  const tablesWithMissingData = [
    'skill_category',
    'codev', 
    'project_members',
    'work_experience',
    'codev_points',
    'attendance',
    'job_listings',
    'job_applications',
    'clients' // Found this table in old DB
  ];
  
  const results = {};
  
  for (const table of tablesWithMissingData) {
    // Check if table exists and has data in new DB
    const { count, error } = await newSupabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error(`❌ Table ${table} might not exist:`, error.message);
      results[table] = { exists: false, count: 0, error: error.message };
    } else {
      logProgress(`✅ Table ${table} exists with ${count} records`);
      results[table] = { exists: true, count: count || 0 };
    }
  }
  
  return results;
}

async function fixMigration() {
  console.log('🔧 FIXING MIGRATION - RECOVERING MISSING DATA');
  console.log('='.repeat(80));
  
  try {
    // Check current status
    const tableStatus = await checkAndCreateMissingTables();
    
    // Tables that need data migration
    const tablesToMigrate = [
      'skill_category',
      'codev', 
      'project_members',
      'work_experience',
      'codev_points',
      'attendance',
      'job_listings',
      'job_applications',
      'clients'
    ];
    
    const migrationResults = {};
    
    for (const table of tablesToMigrate) {
      const status = tableStatus[table];
      
      if (!status || !status.exists) {
        logProgress(`⚠️  Skipping ${table} - table doesn't exist`);
        continue;
      }
      
      if (status.count > 0) {
        logProgress(`⚠️  ${table} already has ${status.count} records - skipping`);
        continue;
      }
      
      // Check if we have exported data
      const exportFile = path.join(__dirname, 'exports', `${table}.json`);
      let data;
      
      if (fs.existsSync(exportFile)) {
        logProgress(`📁 Loading existing export for ${table}`);
        data = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
      } else {
        logProgress(`📥 Exporting fresh data for ${table}`);
        data = await exportTable(table);
      }
      
      if (data && data.length > 0) {
        const result = await importTable(table, data, { retryIndividual: true });
        migrationResults[table] = result;
      } else {
        logProgress(`ℹ️  No data found for ${table}`);
        migrationResults[table] = { success: true, imported: 0, total: 0 };
      }
    }
    
    // Summary
    console.log('\n📊 MIGRATION RESULTS');
    console.log('='.repeat(80));
    
    let totalRecordsExpected = 0;
    let totalRecordsImported = 0;
    let tablesWithErrors = 0;
    
    for (const [table, result] of Object.entries(migrationResults)) {
      const status = result.success ? '✅' : '❌';
      const errorCount = result.errors ? result.errors.length : 0;
      
      console.log(`${status} ${table}: ${result.imported}/${result.total} imported${errorCount > 0 ? ` (${errorCount} errors)` : ''}`);
      
      totalRecordsExpected += result.total || 0;
      totalRecordsImported += result.imported || 0;
      
      if (!result.success || errorCount > 0) {
        tablesWithErrors++;
      }
    }
    
    console.log('-'.repeat(80));
    console.log(`TOTAL: ${totalRecordsImported}/${totalRecordsExpected} records imported`);
    console.log(`TABLES WITH ISSUES: ${tablesWithErrors}`);
    
    if (tablesWithErrors > 0) {
      console.log('\n⚠️  DETAILED ERROR REPORT');
      console.log('='.repeat(80));
      
      for (const [table, result] of Object.entries(migrationResults)) {
        if (result.errors && result.errors.length > 0) {
          console.log(`\n❌ ${table} errors:`);
          result.errors.slice(0, 3).forEach(error => {
            console.log(`  - ${error.error}`);
          });
          if (result.errors.length > 3) {
            console.log(`  ... and ${result.errors.length - 3} more errors`);
          }
        }
      }
    }
    
    console.log('\n🎯 NEXT STEPS');
    console.log('='.repeat(80));
    console.log('1. Check the Supabase dashboard to verify data is visible');
    console.log('2. Test your application to ensure it can access the data');
    console.log('3. Check RLS policies if data is not visible in the app');
    console.log('4. Verify environment variables are pointing to the new database');
    
  } catch (error) {
    console.error('❌ Migration fix failed:', error);
  }
}

// ==============================================
// CLI INTERFACE
// ==============================================

if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'check':
      checkAndCreateMissingTables();
      break;
    case 'export':
      const table = process.argv[3];
      if (table) {
        exportTable(table);
      } else {
        console.log('Usage: node fix-migration.js export <table_name>');
      }
      break;
    case 'fix':
    default:
      fixMigration();
      break;
  }
}

module.exports = {
  fixMigration,
  checkAndCreateMissingTables,
  exportTable,
  importTable
};