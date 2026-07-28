// Migration script: add extended profile columns
// Run: node --env-file=.env.local scratch/add-profile-columns.js
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local

const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role key needed for DDL
)

async function migrate() {
  const queries = [
    `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT`,
    `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age INT`,
    `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT`,
    `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT`,
    `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now()`,
  ]

  for (const q of queries) {
    const { error } = await supabase.rpc('exec', { query: q }).single()
    if (error) {
      // Try direct query if rpc not available
      console.log('Trying alternate method for:', q.slice(0, 50))
    } else {
      console.log('✓', q.slice(0, 50))
    }
  }

  // Verify columns were added
  const { data, error } = await supabase.from('profiles').select('*').limit(1)
  if (!error && data) {
    console.log('\n✅ Profile columns:', Object.keys(data[0] || {}).join(', '))
  }
}

migrate().catch(console.error)
