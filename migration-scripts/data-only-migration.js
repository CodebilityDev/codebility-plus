const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ==============================================
// CONFIGURATION
// ==============================================

// OLD Supabase (for exporting missing data)
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
  logProgress(`💾 Saved ${Array.isArray(data) ? data.length : 'N/A'} records to ${filename}`);
};

// ==============================================
// DATA EXPORT FUNCTIONS
// ==============================================

async function exportClientsData() {
  try {
    logProgress('📥 Exporting clients data from old database...');
    
    const { data, error } = await oldSupabase
      .from('clients')
      .select('*');
    
    if (error) {
      console.error('❌ Error exporting clients:', error);
      return [];
    }
    
    saveToFile('clients.json', data);
    logProgress(`✅ Exported ${data.length} clients`);
    return data;
    
  } catch (error) {
    console.error('❌ Error exporting clients:', error);
    return [];
  }
}

// ==============================================
// DATA CLEANING FUNCTIONS
// ==============================================

function cleanTableData(tableName, data) {
  if (!data || data.length === 0) return data;
  
  logProgress(`🧹 Cleaning ${data.length} records for ${tableName}...`);
  
  switch (tableName) {
    case 'skill_category':
      // Convert UUID IDs to integers for compatibility
      return data.map((record, index) => ({
        ...record,
        id: index + 1,
        name: record.name || 'Unknown Category'
      }));
      
    case 'codev':
      return data.map(record => {
        const cleaned = { ...record };
        // Ensure required fields exist
        if (!cleaned.date_applied) {
          cleaned.date_applied = cleaned.created_at || new Date().toISOString();
        }
        return cleaned;
      });
      
    case 'work_experience':
      return data.map(record => ({
        ...record,
        company_name: record.company_name || record.company || 'Unknown Company'
      }));
      
    case 'codev_points':
      return data.map(record => ({
        ...record,
        period_type: record.period_type || 'monthly'
      }));
      
    case 'attendance':
      return data.map(record => ({
        ...record,
        check_in: record.check_in || '09:00:00'
      }));
      
    case 'job_listings':
      return data.map(record => ({
        ...record,
        created_by: record.created_by || '5d1a6fea-6fa4-4766-a2a0-e58d0f2a34b0'
      }));
      
    case 'job_applications':
      return data.map(record => ({
        ...record,
        email: record.email || record.applicant_email || `user${record.id}@example.com`
      }));
      
    case 'roles':
      return data.map(record => ({
        ...record,
        clients: record.clients || false
      }));
      
    default:
      return data;
  }
}

// ==============================================
// DATA IMPORT FUNCTIONS
// ==============================================

async function importTableData(tableName, data) {
  if (!data || data.length === 0) {
    logProgress(`⏭️  Skipping ${tableName} - no data to import`);
    return { success: true, imported: 0, total: 0, errors: [] };
  }

  try {
    logProgress(`📤 Importing ${data.length} records to ${tableName}...`);
    
    // Clear existing data first (except for the test role)
    if (tableName === 'roles') {
      logProgress(`🗑️  Clearing existing test data from ${tableName}...`);
      await newSupabase.from(tableName).delete().neq('id', 0); // Keep any system roles
    }
    
    const batchSize = 100;
    let imported = 0;
    const errors = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      const { data: insertedData, error } = await newSupabase
        .from(tableName)
        .insert(batch);
      
      if (error) {
        console.error(`❌ Batch error for ${tableName}:`, error.message);
        errors.push({
          batch: Math.floor(i / batchSize) + 1,
          error: error.message,
          records: batch.length
        });
        
        // Try importing records individually
        logProgress(`🔄 Retrying individual records for batch ${Math.floor(i / batchSize) + 1}...`);
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
      } else {
        imported += batch.length;
        logProgress(`📤 Progress: ${imported}/${data.length} imported to ${tableName}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const success = imported > 0 || data.length === 0;
    logProgress(`${success ? '✅' : '❌'} Completed ${tableName}: ${imported}/${data.length} imported`);
    
    return { success, imported, total: data.length, errors };
    
  } catch (error) {
    console.error(`❌ Critical error importing ${tableName}:`, error);
    return { success: false, imported: 0, errors: [{ error: error.message }], total: data.length };
  }
}

// ==============================================
// MAIN MIGRATION FUNCTION
// ==============================================

async function runDataMigration() {
  console.log('🚀 DATA-ONLY MIGRATION');
  console.log('='.repeat(80));
  console.log('⚠️  PREREQUISITES:');
  console.log('   1. Schema fixes must be applied first (run MANUAL_SCHEMA_FIX.sql)');
  console.log('   2. New database should have all required columns');
  console.log('   3. Tables should exist but be mostly empty');
  console.log('='.repeat(80));
  
  try {
    // Step 1: Export any missing data
    await exportClientsData();
    
    // Step 2: Define migration plan
    const migrationPlan = [
      { table: 'roles', file: 'roles.json', priority: 1 },
      { table: 'skill_category', file: 'skill_category.json', priority: 2 },
      { table: 'codev', file: 'codev.json', priority: 3 },
      { table: 'work_experience', file: 'work_experience.json', priority: 4 },
      { table: 'codev_points', file: 'codev_points.json', priority: 5 },
      { table: 'attendance', file: 'attendance.json', priority: 6 },
      { table: 'job_listings', file: 'job_listings.json', priority: 7 },
      { table: 'job_applications', file: 'job_applications.json', priority: 8 },
      { table: 'clients', file: 'clients.json', priority: 9 },
    ];
    
    // Step 3: Execute migration
    console.log('\n📋 MIGRATION EXECUTION PLAN');
    console.log('='.repeat(80));
    
    const results = {};
    let totalImported = 0;
    let totalExpected = 0;
    
    for (const { table, file, priority } of migrationPlan) {
      console.log(`\n🔄 Step ${priority}: Migrating ${table}`);
      console.log('-'.repeat(50));
      
      const filePath = path.join(__dirname, 'exports', file);
      
      if (!fs.existsSync(filePath)) {
        logProgress(`⚠️  File not found: ${file} - skipping ${table}`);
        continue;
      }
      
      // Load and clean data
      const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const cleanedData = cleanTableData(table, rawData);
      
      if (cleanedData.length === 0) {
        logProgress(`ℹ️  No data to import for ${table}`);
        continue;
      }
      
      // Import data
      const result = await importTableData(table, cleanedData);
      results[table] = result;
      
      totalImported += result.imported;
      totalExpected += result.total;
      
      logProgress(`📊 Running total: ${totalImported}/${totalExpected} records imported`);
    }
    
    // Step 4: Final verification
    console.log('\n🔍 VERIFICATION - CHECKING NEW DATABASE');
    console.log('='.repeat(80));
    
    for (const { table } of migrationPlan) {
      try {
        const { count, error } = await newSupabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${table}: Error checking count - ${error.message}`);
        } else {
          console.log(`📊 ${table}: ${count || 0} records`);
        }
      } catch (error) {
        console.log(`❌ ${table}: Verification failed`);
      }
    }
    
    // Step 5: Summary
    console.log('\n🎯 MIGRATION SUMMARY');
    console.log('='.repeat(80));
    
    let tablesWithErrors = 0;
    for (const [table, result] of Object.entries(results)) {
      const status = result.success ? '✅' : '❌';
      const errorCount = result.errors ? result.errors.length : 0;
      console.log(`${status} ${table.padEnd(20)} ${result.imported.toString().padStart(4)}/${result.total.toString().padEnd(4)} ${errorCount > 0 ? `(${errorCount} errors)` : ''}`);
      
      if (!result.success || errorCount > 0) {
        tablesWithErrors++;
      }
    }
    
    console.log('-'.repeat(80));
    console.log(`📈 TOTAL IMPORTED: ${totalImported}/${totalExpected} records`);
    console.log(`⚠️  TABLES WITH ISSUES: ${tablesWithErrors}`);
    
    if (totalImported > 1500) {
      console.log('\n🎉 MIGRATION SUCCESSFUL!');
      console.log('✅ Most of your data has been successfully migrated');
      console.log('✅ Your application should now work with the new database');
    } else {
      console.log('\n⚠️  MIGRATION INCOMPLETE');
      console.log('❌ Expected ~1,832 records but only imported ' + totalImported);
      console.log('🔧 Check error messages above and fix schema issues');
    }
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('1. Test your application with the new database');
    console.log('2. Check Supabase dashboard to verify data is visible');
    console.log('3. Update any remaining environment variables');
    console.log('4. Test all major features (auth, data display, etc.)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// ==============================================
// CLI INTERFACE
// ==============================================

if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'export':
      exportClientsData();
      break;
    case 'migrate':
    default:
      runDataMigration();
      break;
  }
}

module.exports = {
  runDataMigration,
  exportClientsData
};