const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in the environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  console.log('--- START CONCURRENCY TEST ---');
  
  // 1. Fetch first resource
  const { data: resources, error: resError } = await supabase
    .from('resources')
    .select('*')
    .limit(1);

  if (resError || !resources || resources.length === 0) {
    console.error('Error: Please ensure resources table is seeded.');
    process.exit(1);
  }

  const resource = resources[0];
  console.log(`Using Resource: ${resource.name} (${resource.id})`);

  // Define booking parameters
  const now = new Date();
  const startTime = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 2 days later
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

  const timeRange = `[${startTime.toISOString()}, ${endTime.toISOString()})`;
  console.log(`Requested Time Range: ${timeRange}`);

  // Fetch an existing profile to use for user_id
  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);

  if (profError || !profiles || profiles.length === 0) {
    console.error('Error: Profiles table is empty.');
    process.exit(1);
  }

  const userId = profiles[0].id;
  console.log(`Using User ID: ${userId}`);

  // Create two booking payloads
  const booking1 = {
    resource_id: resource.id,
    user_id: userId,
    time_range: timeRange,
    status: 'approved'
  };

  const booking2 = {
    resource_id: resource.id,
    user_id: userId,
    time_range: timeRange,
    status: 'approved'
  };

  console.log('Sending two simultaneous booking requests...');

  // Fire both requests concurrently using Promise.allSettled
  const results = await Promise.allSettled([
    supabase.from('bookings').insert(booking1),
    supabase.from('bookings').insert(booking2)
  ]);

  let successCount = 0;
  let failCount = 0;
  let exclusionErrorDetected = false;

  results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      const { data, error } = result.value;
      if (error) {
        console.log(`Request ${idx + 1} Failed: Code = ${error.code}, Message = ${error.message}`);
        if (error.code === '23P01') {
          exclusionErrorDetected = true;
        }
        failCount++;
      } else {
        console.log(`Request ${idx + 1} Succeeded!`);
        successCount++;
      }
    } else {
      console.log(`Request ${idx + 1} Rejected:`, result.reason);
      failCount++;
    }
  });

  console.log('\n--- RESULTS ---');
  console.log(`Successful Bookings: ${successCount}`);
  console.log(`Failed Bookings: ${failCount}`);
  
  if (successCount === 1 && failCount === 1 && exclusionErrorDetected) {
    console.log('\nSUCCESS: Database EXCLUDE constraint correctly prevented double booking under concurrency.');
  } else {
    console.log('\nFAILURE: Concurrency test did not behave as expected.');
  }

  // Cleanup: Delete successful booking if any
  const { data: bookingsToDelete } = await supabase
    .from('bookings')
    .select('id')
    .eq('resource_id', resource.id)
    .eq('time_range', timeRange);

  if (bookingsToDelete && bookingsToDelete.length > 0) {
    const ids = bookingsToDelete.map(b => b.id);
    await supabase.from('bookings').delete().in('id', ids);
    console.log('Cleanup: Deleted test bookings.');
  }

  console.log('--- END CONCURRENCY TEST ---');
}

runTest();
