import { createClient } from '@supabase/supabase-js';

// Hard-coded for testing
const supabaseUrl = 'https://tqlljmnyuptehtrafhmk.supabase.co';
const supabaseKey = 'sb_publishable_wfBWy7BIJIc1b5RdyjjXMQ_AWZ3LfWh';

export const supabase = createClient(supabaseUrl, supabaseKey);