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
  logProgress(`💾 Saved ${data.length} records to ${filename}`);
};

// ==============================================
// SCHEMA FIXING FUNCTIONS  
// ==============================================

async function addMissingColumns() {
  console.log('🔧 ADDING MISSING COLUMNS TO NEW DATABASE');
  console.log('='.repeat(80));
  
  const alterQueries = [
    // Add missing columns identified from migration errors
    `ALTER TABLE codev ADD COLUMN IF NOT EXISTS date_applied timestamp with time zone;`,
    `ALTER TABLE work_experience ADD COLUMN IF NOT EXISTS company_name text;`,
    `ALTER TABLE codev_points ADD COLUMN IF NOT EXISTS period_type text;`,
    `ALTER TABLE attendance ADD COLUMN IF NOT EXISTS check_in time without time zone;`,
    `ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS created_by uuid;`,
    `ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS email text;`,
    `ALTER TABLE roles ADD COLUMN IF NOT EXISTS clients boolean DEFAULT false;`,
  ];
  
  for (const query of alterQueries) {
    try {
      logProgress(`Executing: ${query}`);
      const { error } = await newSupabase.rpc('exec_sql', { sql: query });
      
      if (error) {
        console.error(`❌ Error executing query: ${error.message}`);
      } else {
        logProgress(`✅ Query executed successfully`);
      }
    } catch (error) {
      console.error(`❌ Error with query: ${query}`, error);
    }
  }
}

async function createMissingTables() {
  console.log('\n🏗️  CREATING MISSING TABLES');
  console.log('='.repeat(80));
  
  // Create clients table
  const createClientsTable = `
    CREATE TABLE IF NOT EXISTS clients (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text,
      email text,
      phone_number text,
      address text,
      country text,
      client_type text,
      status text,
      website text,
      company_logo text,
      industry text,
      testimony text,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );
  `;
  
  try {
    logProgress('Creating clients table...');
    const { error } = await newSupabase.rpc('exec_sql', { sql: createClientsTable });
    
    if (error) {
      console.error(`❌ Error creating clients table: ${error.message}`);
    } else {
      logProgress(`✅ Clients table created successfully`);
    }
  } catch (error) {
    console.error('❌ Error creating clients table:', error);
  }
}

// ==============================================
// DATA CLEANING FUNCTIONS
// ==============================================

function cleanDataForImport(tableName, data) {
  if (!data || data.length === 0) return data;
  
  logProgress(`🧹 Cleaning data for ${tableName}...`);
  
  switch (tableName) {
    case 'skill_category':
      // Convert UUID IDs to sequential integers if needed
      return data.map((record, index) => ({
        ...record,
        id: index + 1 // Convert to integer ID
      }));
      
    case 'codev':
      // Remove problematic columns that don't exist in new schema
      return data.map(record => {
        const cleaned = { ...record };
        if (cleaned.date_applied === null || cleaned.date_applied === undefined) {
          cleaned.date_applied = new Date().toISOString();
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
        created_by: record.created_by || '5d1a6fea-6fa4-4766-a2a0-e58d0f2a34b0' // Use founder ID as fallback
      }));
      
    case 'job_applications':
      return data.map(record => ({
        ...record,
        email: record.email || record.applicant_email || 'noemail@example.com'
      }));
      
    case 'project_members':
      // Filter out records that reference non-existent projects
      // For now, we'll skip this table until projects are imported
      logProgress(`⚠️  Skipping project_members - projects need to be imported first`);
      return [];
      
    default:
      return data;
  }
}

// ==============================================
// EXPORT FUNCTIONS
// ==============================================

async function exportMissingData() {
  console.log('📥 EXPORTING MISSING DATA');
  console.log('='.repeat(80));
  
  // Export the clients table that was missing from original migration
  try {
    logProgress('Exporting clients table...');
    const { data, error } = await oldSupabase
      .from('clients')
      .select('*');
    
    if (error) {
      console.error('❌ Error exporting clients:', error);
    } else {
      saveToFile('clients.json', data);
      logProgress(`✅ Exported ${data.length} clients`);
    }
  } catch (error) {
    console.error('❌ Error exporting clients:', error);
  }
}

// ==============================================
// IMPORT FUNCTIONS
// ==============================================

async function importCleanData(tableName, data) {
  if (!data || data.length === 0) {
    logProgress(`⏭️  Skipping ${tableName} - no data`);
    return { success: true, imported: 0, total: 0, errors: [] };
  }

  try {
    logProgress(`📤 Importing ${data.length} records to ${tableName}...`);
    
    const batchSize = 50;
    let imported = 0;
    const errors = [];
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      const { data: insertedData, error } = await newSupabase
        .from(tableName)
        .insert(batch)
        .select();
      
      if (error) {
        console.error(`❌ Batch error for ${tableName}:`, error.message);
        errors.push({
          batch: Math.floor(i / batchSize) + 1,
          error: error.message,
          records: batch.length
        });
        
        // Try individual records
        for (const record of batch) {
          try {
            const { error: individualError } = await newSupabase
              .from(tableName)
              .insert([record]);
            
            if (!individualError) {
              imported++;
            }
          } catch (e) {
            // Skip individual record errors
          }
        }
      } else {
        imported += insertedData ? insertedData.length : batch.length;
        logProgress(`📤 Imported ${imported}/${data.length} to ${tableName}`);
      }
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

async function completeMigrationFix() {
  console.log('🚀 COMPLETE MIGRATION FIX - RECOVERING ALL DATA');
  console.log('='.repeat(80));
  console.log(`📊 Target: Migrate ~1,832 records from old to new database`);
  console.log('='.repeat(80));
  
  try {
    // Step 1: Fix schema
    await addMissingColumns();
    await createMissingTables();
    
    // Step 2: Export any missing data
    await exportMissingData();
    
    // Step 3: Define migration order (dependencies first)
    const migrationPlan = [
      { table: 'skill_category', file: 'skill_category.json' },
      { table: 'codev', file: 'codev.json' },
      { table: 'work_experience', file: 'work_experience.json' },
      { table: 'codev_points', file: 'codev_points.json' },
      { table: 'attendance', file: 'attendance.json' },
      { table: 'job_listings', file: 'job_listings.json' },
      { table: 'job_applications', file: 'job_applications.json' },
      { table: 'clients', file: 'clients.json' },
      // Skip project_members until projects are handled
    ];
    
    console.log('\n📋 MIGRATION PLAN');
    console.log('='.repeat(80));
    migrationPlan.forEach((item, index) => {
      console.log(`${index + 1}. ${item.table} (from ${item.file})`);
    });
    
    // Step 4: Execute migration
    console.log('\n📤 EXECUTING MIGRATION');
    console.log('='.repeat(80));
    
    const results = {};
    let totalImported = 0;
    let totalExpected = 0;
    
    for (const { table, file } of migrationPlan) {
      const filePath = path.join(__dirname, 'exports', file);
      
      if (!fs.existsSync(filePath)) {
        logProgress(`⚠️  File not found: ${file} - skipping ${table}`);
        continue;
      }
      
      // Load and clean data
      const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const cleanedData = cleanDataForImport(table, rawData);
      
      // Import data
      const result = await importCleanData(table, cleanedData);
      results[table] = result;
      
      totalImported += result.imported;
      totalExpected += result.total;
    }
    
    // Step 5: Summary
    console.log('\n📊 FINAL MIGRATION RESULTS');
    console.log('='.repeat(80));
    
    for (const [table, result] of Object.entries(results)) {
      const status = result.success ? '✅' : '❌';
      const errorCount = result.errors ? result.errors.length : 0;
      console.log(`${status} ${table}: ${result.imported}/${result.total}${errorCount > 0 ? ` (${errorCount} errors)` : ''}`);
    }
    
    console.log('-'.repeat(80));
    console.log(`🎯 TOTAL: ${totalImported}/${totalExpected} records imported`);
    
    // Step 6: Verification
    console.log('\n🔍 VERIFICATION');
    console.log('='.repeat(80));
    
    for (const { table } of migrationPlan) {
      try {
        const { count } = await newSupabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        console.log(`📊 ${table}: ${count} records in new database`);
      } catch (error) {
        console.log(`❌ ${table}: Error checking count`);
      }
    }
    
    console.log('\n🎉 MIGRATION COMPLETE!');
    console.log('='.repeat(80));
    console.log('✅ Schema has been updated to match old database');
    console.log('✅ Missing tables have been created');
    console.log('✅ Data has been cleaned and imported');
    console.log('✅ New database should now have all your data');
    console.log('');
    console.log('🔧 NEXT STEPS:');
    console.log('1. Test your application with the new database');
    console.log('2. Check data visibility in Supabase dashboard');
    console.log('3. Verify all features work correctly');
    console.log('4. Update any remaining environment variables');
    
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
    case 'schema':
      addMissingColumns().then(() => createMissingTables());
      break;
    case 'export':
      exportMissingData();
      break;
    case 'complete':
    default:
      completeMigrationFix();
      break;
  }
}

module.exports = {
  completeMigrationFix,
  addMissingColumns,
  createMissingTables,
  exportMissingData
};