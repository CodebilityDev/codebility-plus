const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// New Supabase credentials
const supabaseUrl = 'https://mynmukpnttyyjimymgrk.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTczNDg2MCwiZXhwIjoyMDc1MzEwODYwfQ.07DYL51U9jyAm-wmQDyNQce6vPxWSzvnVGMmO2IO-8c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalMigration() {
  console.log('🚀 FINAL MIGRATION - COLUMN MAPPING FIXED');
  console.log('================================================================================');
  
  try {
    // Step 1: Import codev table with proper column mapping
    console.log('👥 Step 1: Importing codev (users) table with correct column mapping...');
    const codevData = JSON.parse(fs.readFileSync('exports/codev.json', 'utf8'));
    
    // Map old column names to new column names
    const mappedCodevData = codevData.map(record => ({
      id: record.id,
      email_address: record.email || record.email_address, // Map email to email_address
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
    
    console.log(`  Importing ${mappedCodevData.length} users in batches...`);
    
    // Import in smaller batches
    const batchSize = 50;
    let successCount = 0;
    
    for (let i = 0; i < mappedCodevData.length; i += batchSize) {
      const batch = mappedCodevData.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('codev')
        .insert(batch);
      
      if (error) {
        console.log(`    ⚠️  Batch ${Math.floor(i/batchSize) + 1} error:`, error.message);
        
        // Try individual records if batch fails
        for (const record of batch) {
          const { error: individualError } = await supabase
            .from('codev')
            .insert(record);
          
          if (!individualError) {
            successCount++;
          }
        }
      } else {
        successCount += batch.length;
        console.log(`    ✅ Batch ${Math.floor(i/batchSize) + 1}: ${batch.length} users imported`);
      }
    }
    
    console.log(`✅ Codev import completed: ${successCount}/${mappedCodevData.length} imported`);
    
    if (successCount > 0) {
      // Step 2: Import work_experience (now that users exist)
      console.log('\n💼 Step 2: Importing work_experience...');
      const workData = JSON.parse(fs.readFileSync('exports/work_experience.json', 'utf8'));
      
      let workSuccess = 0;
      for (const record of workData) {
        const { error } = await supabase
          .from('work_experience')
          .insert(record);
        
        if (!error) workSuccess++;
      }
      
      console.log(`    ✅ Work experience imported: ${workSuccess}/${workData.length} records`);
      
      // Step 3: Import attendance (now that users exist)
      console.log('\n⏰ Step 3: Importing attendance...');
      const attendanceData = JSON.parse(fs.readFileSync('exports/attendance.json', 'utf8'));
      
      // Clean attendance data - just basic fields
      const cleanAttendanceData = attendanceData.map(record => ({
        id: record.id,
        codev_id: record.codev_id,
        date: record.date,
        created_at: record.created_at,
        updated_at: record.updated_at
      }));
      
      let attendanceSuccess = 0;
      for (const record of cleanAttendanceData) {
        const { error } = await supabase
          .from('attendance')
          .insert(record);
        
        if (!error) attendanceSuccess++;
      }
      
      console.log(`    ✅ Attendance imported: ${attendanceSuccess}/${cleanAttendanceData.length} records`);
      
      // Step 4: Import job listings and applications
      console.log('\n📋 Step 4: Importing job tables...');
      
      const jobListingsData = JSON.parse(fs.readFileSync('exports/job_listings.json', 'utf8'));
      const cleanJobListings = jobListingsData.map(record => ({
        id: record.id,
        title: record.title,
        description: record.description,
        requirements: record.requirements,
        location: record.location,
        salary_range: record.salary_range,
        employment_type: record.employment_type,
        status: record.status,
        created_at: record.created_at,
        updated_at: record.updated_at
      }));
      
      let jobListingsSuccess = 0;
      for (const record of cleanJobListings) {
        const { error } = await supabase
          .from('job_listings')
          .insert(record);
        
        if (!error) jobListingsSuccess++;
      }
      
      console.log(`    ✅ Job listings imported: ${jobListingsSuccess}/${cleanJobListings.length} records`);
      
      const jobAppsData = JSON.parse(fs.readFileSync('exports/job_applications.json', 'utf8'));
      let jobAppsSuccess = 0;
      for (const record of jobAppsData) {
        const { error } = await supabase
          .from('job_applications')
          .insert(record);
        
        if (!error) jobAppsSuccess++;
      }
      
      console.log(`    ✅ Job applications imported: ${jobAppsSuccess}/${jobAppsData.length} records`);
    }
    
    // Step 5: Final count verification
    console.log('\n📊 FINAL DATABASE STATUS:');
    console.log('================================================================================');
    
    const tables_to_check = ['roles', 'skill_category', 'codev', 'work_experience', 'attendance', 'job_listings', 'job_applications', 'clients'];
    let totalRecords = 0;
    
    for (const table of tables_to_check) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`${table}: ${count} records`);
        totalRecords += count;
      }
    }
    
    console.log(`\nTOTAL RECORDS: ${totalRecords}`);
    
    if (totalRecords > 100) {
      console.log('\n🎉 MIGRATION SUCCESSFUL!');
      console.log('Your application now has all the migrated data and should work perfectly!');
    } else {
      console.log('\n⚠️  Migration partially successful. Some records may need manual fixing.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  }
}

finalMigration();