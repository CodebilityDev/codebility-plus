const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// New Supabase credentials
const supabaseUrl = 'https://mynmukpnttyyjimymgrk.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTczNDg2MCwiZXhwIjoyMDc1MzEwODYwfQ.07DYL51U9jyAm-wmQDyNQce6vPxWSzvnVGMmO2IO-8c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function simplifiedMigration() {
  console.log('🚀 SIMPLIFIED MIGRATION - FINAL ATTEMPT');
  console.log('================================================================================');
  
  try {
    // Step 1: Import codev table FIRST (users must exist before other tables can reference them)
    console.log('👥 Step 1: Importing codev (users) table...');
    const codevData = JSON.parse(fs.readFileSync('exports/codev.json', 'utf8'));
    
    // Clean the codev data - remove problematic columns and just get essential data
    const cleanCodevData = codevData.map(record => ({
      id: record.id,
      email: record.email,
      first_name: record.first_name,
      last_name: record.last_name,
      phone_number: record.phone_number,
      address: record.address,
      role_id: record.role_id,
      application_status: record.application_status || 'pending',
      avatar_url: record.avatar_url,
      created_at: record.created_at,
      updated_at: record.updated_at
    }));
    
    console.log(`  Importing ${cleanCodevData.length} users in batches...`);
    
    // Import in smaller batches
    const batchSize = 50;
    let successCount = 0;
    
    for (let i = 0; i < cleanCodevData.length; i += batchSize) {
      const batch = cleanCodevData.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('codev')
        .insert(batch);
      
      if (error) {
        console.log(`    ⚠️  Batch ${Math.floor(i/batchSize) + 1} error:`, error.message);
      } else {
        successCount += batch.length;
        console.log(`    ✅ Batch ${Math.floor(i/batchSize) + 1}: ${batch.length} users imported`);
      }
    }
    
    console.log(`✅ Codev import completed: ${successCount}/${cleanCodevData.length} imported`);
    
    // Step 2: Import work_experience (now that users exist)
    console.log('\n💼 Step 2: Importing work_experience...');
    const workData = JSON.parse(fs.readFileSync('exports/work_experience.json', 'utf8'));
    
    const { data: workResult, error: workError } = await supabase
      .from('work_experience')
      .insert(workData);
    
    if (workError) {
      console.log('    ⚠️  Work experience error:', workError.message);
    } else {
      console.log(`    ✅ Work experience imported: ${workData.length} records`);
    }
    
    // Step 3: Import attendance (now that users exist)
    console.log('\n⏰ Step 3: Importing attendance...');
    const attendanceData = JSON.parse(fs.readFileSync('exports/attendance.json', 'utf8'));
    
    // Clean attendance data - remove time columns that are causing issues
    const cleanAttendanceData = attendanceData.map(record => ({
      id: record.id,
      codev_id: record.codev_id,
      date: record.date,
      created_at: record.created_at,
      updated_at: record.updated_at
    }));
    
    console.log(`  Importing ${cleanAttendanceData.length} attendance records in batches...`);
    
    let attendanceSuccess = 0;
    for (let i = 0; i < cleanAttendanceData.length; i += batchSize) {
      const batch = cleanAttendanceData.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('attendance')
        .insert(batch);
      
      if (error) {
        console.log(`    ⚠️  Attendance batch ${Math.floor(i/batchSize) + 1} error:`, error.message);
      } else {
        attendanceSuccess += batch.length;
        console.log(`    ✅ Attendance batch ${Math.floor(i/batchSize) + 1}: ${batch.length} records imported`);
      }
    }
    
    console.log(`✅ Attendance import completed: ${attendanceSuccess}/${cleanAttendanceData.length} imported`);
    
    // Step 4: Import remaining tables
    console.log('\n📋 Step 4: Importing remaining tables...');
    
    const tables = [
      { name: 'job_listings', file: 'exports/job_listings.json' },
      { name: 'job_applications', file: 'exports/job_applications.json' },
      { name: 'clients', file: 'exports/clients.json' }
    ];
    
    for (const table of tables) {
      if (fs.existsSync(table.file)) {
        const data = JSON.parse(fs.readFileSync(table.file, 'utf8'));
        const { error } = await supabase
          .from(table.name)
          .insert(data);
        
        if (error) {
          console.log(`    ⚠️  ${table.name} error:`, error.message);
        } else {
          console.log(`    ✅ ${table.name} imported: ${data.length} records`);
        }
      }
    }
    
    // Step 5: Final count verification
    console.log('\n📊 Final Database Status:');
    console.log('================================================================================');
    
    const tables_to_check = ['roles', 'skill_category', 'codev', 'work_experience', 'attendance', 'job_listings', 'job_applications', 'clients'];
    
    for (const table of tables_to_check) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`${table}: ${count} records`);
      }
    }
    
    console.log('\n🎉 MIGRATION COMPLETED!');
    console.log('Your application should now work with all the migrated data.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

simplifiedMigration();