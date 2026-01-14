-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create the unified activities table
create table if not exists activities (
  id uuid primary key default uuid_generate_v4(),
  source text not null, -- 'leagues', 'daily', 'tournaments', etc.
  program_name text,
  venue_name text,
  venue_rank text, -- For sorting venues?
  venue_map_url text,
  neighborhood text,
  sport text,
  activity_type text, -- 'League', 'Pickup', 'Drop-In', 'Event'
  
  -- Timing
  start_date_text text,
  start_date timestamp with time zone, -- Parsed if possible
  end_date timestamp with time zone,
  time_start text,
  time_end text,
  day_of_week text,
  weeks_duration integer,
  
  -- Details
  format text,
  skill_levels text[],
  features text[],
  description text,
  
  -- Pricing
  price_person_current numeric,
  price_person_base numeric,
  price_team numeric,
  member_price_current numeric,
  member_price_original numeric,
  
  -- Media / Meta
  image_url text,
  image_alt text,
  banner_message text,
  registration_phase_text text,
  registration_ends_mmdd text,
  perks_more_url text,
  
  -- Original Data Dump (Safe fallback)
  raw_data jsonb,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for common filters
create index if not exists idx_activities_source on activities(source);
create index if not exists idx_activities_sport on activities(sport);
create index if not exists idx_activities_neighborhood on activities(neighborhood);
create index if not exists idx_activities_start_date on activities(start_date);
create index if not exists idx_activities_price on activities(price_person_current);

-- RLS Policies (Public Read, Service Role Write)
alter table activities enable row level security;

create policy "Enable read access for all users"
on activities for select
using (true);

create policy "Enable insert for service role only"
on activities for insert
with check (true); 
-- Note: In practice, you'd restrict write to authenticated admin users, 
-- but for initial seeding/dev we often just use the service_role key.
