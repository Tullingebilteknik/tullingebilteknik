-- ============================================
-- MIGRATION: Mechanic Schedule System
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Create mechanics table
CREATE TABLE IF NOT EXISTS mechanics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE mechanics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth read mechanics"
  ON mechanics FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth manage mechanics"
  ON mechanics FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed initial mechanic
INSERT INTO mechanics (name, email) VALUES ('Jesper', 'jesper@tullingebilteknik.se')
ON CONFLICT (email) DO NOTHING;

-- 2. Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  mechanic_id UUID NOT NULL REFERENCES mechanics(id) ON DELETE RESTRICT,
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_mechanic ON bookings(mechanic_id, scheduled_date);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth read bookings"
  ON bookings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth manage bookings"
  ON bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Update leads status constraint
UPDATE leads SET status = 'completed' WHERE status = 'done';
UPDATE leads SET status = 'new' WHERE status = 'contacted';

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'booked', 'in_progress', 'completed'));
