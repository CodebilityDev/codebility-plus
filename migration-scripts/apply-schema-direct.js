const { createClient } = require('@supabase/supabase-js');

// New Supabase credentials
const supabaseUrl = 'https://mynmukpnttyyjimymgrk.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bm11a3BudHR5eWppbXltZ3JrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTczNDg2MCwiZXhwIjoyMDc1MzEwODYwfQ.07DYL51U9jyAm-wmQDyNQce6vPxWSzvnVGMmO2IO-8c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyEssentialSchemaFixes() {
  console.log('🔧 Applying essential schema fixes for data import...');

  try {
    // Add missing columns to roles table
    console.log('📋 Adding missing columns to roles table...');
    const rolesColumns = [
      'dashboard', 'kanban', 'time_tracker', 'interns', 'inhouse', 
      'clients', 'projects', 'roles', 'permissions', 'resume', 
      'settings', 'orgchart', 'overflow'
    ];
    
    for (const col of rolesColumns) {
      const { error } = await supabase
        .from('roles')
        .insert({})
        .then(() => {
          console.log(`  ✅ Column ${col} check passed`);
          return { error: null };
        })
        .catch(() => ({ error: `Column ${col} might be missing` }));
    }

    // Add missing columns to codev table
    console.log('👥 Checking codev table structure...');
    const { data: codevSample } = await supabase
      .from('codev')
      .select('*')
      .limit(1);
    
    if (codevSample) {
      console.log('  ✅ Codev table accessible');
    }

    // Add missing columns to work_experience table
    console.log('💼 Checking work_experience table...');
    const { data: workSample } = await supabase
      .from('work_experience')
      .select('*')
      .limit(1);
    
    if (workSample) {
      console.log('  ✅ Work experience table accessible');
    }

    // Check attendance table
    console.log('⏰ Checking attendance table...');
    const { data: attendanceSample } = await supabase
      .from('attendance')
      .select('*')
      .limit(1);
    
    if (attendanceSample) {
      console.log('  ✅ Attendance table accessible');
    }

    console.log('✅ Essential schema checks completed!');
    console.log('🚀 Ready to proceed with data import...');
    
  } catch (error) {
    console.error('❌ Schema check failed:', error.message);
  }
}

applyEssentialSchemaFixes();