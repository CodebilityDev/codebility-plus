const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ==============================================
// CONFIGURATION
// ==============================================
const OLD_SUPABASE_URL = 'https://hibnlysaokybrsufrdwp.supabase.co';
const OLD_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpYm5seXNhb2t5YnJzdWZyZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NjM1NjUsImV4cCI6MjA1MzAzOTU2NX0.7_QnkBcgefEzVcqrC5vFi4yVqbVpdW5qyWSF8QSiL2o';

// NEW Supabase project credentials
const NEW_SUPABASE_URL = 'https://mynmukpnttyyjimymgrk.supabase.co';
const NEW_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MzQ4NjAsImV4cCI6MjA3NTMxMDg2MH0.sapxUfkxAgB7C88vPctvhfthvt9QFCrJsaQ0lytk_LI';

// Create clients
const oldSupabase = createClient(OLD_SUPABASE_URL, OLD_SUPABASE_KEY);

// Only create new client if credentials are provided
let newSupabase = null;
if (NEW_SUPABASE_URL !== 'YOUR_NEW_SUPABASE_URL') {
  newSupabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_KEY);
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
// MAIN MIGRATION FUNCTIONS
// ==============================================

async function getTables() {
  logProgress('Using known table list for export...');
  
  // List of tables based on your database schema
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
  
  logProgress(`Will export ${knownTables.length} tables: ${knownTables.join(', ')}`);
  return knownTables;
}

async function exportTable(tableName) {
  try {
    logProgress(`Exporting table: ${tableName}...`);
    
    // Get total count first
    const { count, error: countError } = await oldSupabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error(`Error counting ${tableName}:`, countError);
      return [];
    }

    logProgress(`Table ${tableName} has ${count} records`);
    
    if (count === 0) {
      return [];
    }

    // Export data in batches
    const batchSize = 1000;
    let allData = [];
    
    for (let offset = 0; offset < count; offset += batchSize) {
      const { data, error } = await oldSupabase
        .from(tableName)
        .select('*')
        .range(offset, offset + batchSize - 1);
      
      if (error) {
        console.error(`Error exporting ${tableName} at offset ${offset}:`, error);
        continue;
      }
      
      allData = allData.concat(data);
      logProgress(`Exported ${allData.length}/${count} records from ${tableName}`);
      
      // Rate limiting
      await sleep(100);
    }
    
    // Save to file
    saveToFile(`${tableName}.json`, allData);
    return allData;
    
  } catch (error) {
    console.error(`Error exporting table ${tableName}:`, error);
    return [];
  }
}

async function importTable(tableName, data) {
  if (!data || data.length === 0) {
    logProgress(`Skipping ${tableName} - no data`);
    return;
  }

  if (!newSupabase) {
    logProgress(`⚠️  Cannot import ${tableName} - new Supabase client not configured`);
    return;
  }

  try {
    logProgress(`Importing ${data.length} records to ${tableName}...`);
    
    // Import in batches
    const batchSize = 100;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      const { error } = await newSupabase
        .from(tableName)
        .insert(batch);
      
      if (error) {
        console.error(`Error importing batch to ${tableName}:`, error);
        // Continue with next batch
      } else {
        logProgress(`Imported ${Math.min(i + batchSize, data.length)}/${data.length} records to ${tableName}`);
      }
      
      // Rate limiting
      await sleep(200);
    }
    
    logProgress(`✅ Completed import for ${tableName}`);
    
  } catch (error) {
    console.error(`Error importing to ${tableName}:`, error);
  }
}

async function exportAllData() {
  logProgress('🚀 Starting data export...');
  
  const tables = await getTables();
  const exportedData = {};
  
  for (const table of tables) {
    const data = await exportTable(table);
    exportedData[table] = data;
    
    // Small delay between tables
    await sleep(500);
  }
  
  // Save complete export
  saveToFile('complete_export.json', exportedData);
  logProgress('✅ Export completed');
  
  return exportedData;
}

async function importAllData(exportedData) {
  logProgress('🚀 Starting data import...');
  
  // Define import order (tables with dependencies should come after their dependencies)
  const importOrder = [
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
  
  // Import tables that exist in our data
  for (const tableName of importOrder) {
    if (exportedData[tableName]) {
      await importTable(tableName, exportedData[tableName]);
      await sleep(1000); // Longer delay between tables
    }
  }
  
  // Import any remaining tables not in the ordered list
  for (const [tableName, data] of Object.entries(exportedData)) {
    if (!importOrder.includes(tableName)) {
      await importTable(tableName, data);
      await sleep(1000);
    }
  }
  
  logProgress('✅ Import completed');
}

async function migrateData() {
  try {
    logProgress('🎯 Starting complete data migration...');
    
    // Check if we have a previous export
    const exportFile = path.join(__dirname, 'exports', 'complete_export.json');
    let exportedData;
    
    if (fs.existsSync(exportFile)) {
      logProgress('📁 Found existing export file, using it...');
      exportedData = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
    } else {
      logProgress('📥 No existing export found, starting fresh export...');
      exportedData = await exportAllData();
    }
    
    if (NEW_SUPABASE_URL === 'YOUR_NEW_SUPABASE_URL') {
      logProgress('⚠️  Please update NEW_SUPABASE_URL and NEW_SUPABASE_KEY in this script');
      logProgress('📄 Export completed. Update credentials and run again to import.');
      return;
    }
    
    logProgress('📤 Starting import to new project...');
    await importAllData(exportedData);
    
    logProgress('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// ==============================================
// CLI INTERFACE
// ==============================================
const command = process.argv[2];

switch (command) {
  case 'export':
    exportAllData();
    break;
  case 'import':
    const exportFile = path.join(__dirname, 'exports', 'complete_export.json');
    if (fs.existsSync(exportFile)) {
      const exportedData = JSON.parse(fs.readFileSync(exportFile, 'utf8'));
      importAllData(exportedData);
    } else {
      console.error('No export file found. Run "node migrate-data.js export" first.');
    }
    break;
  case 'migrate':
  default:
    migrateData();
    break;
}

module.exports = {
  exportAllData,
  importAllData,
  migrateData
};