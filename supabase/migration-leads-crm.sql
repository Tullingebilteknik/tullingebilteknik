-- Migration: Upgrade leads to CRM-style management
-- Run this in Supabase SQL Editor

-- 1. Update status values on existing leads BEFORE changing constraint
UPDATE public.leads SET status = 'ska_kontaktas' WHERE status = 'new';
UPDATE public.leads SET status = 'bokad' WHERE status = 'booked';
UPDATE public.leads SET status = 'affar' WHERE status IN ('in_progress', 'completed');

-- 2. Drop old constraint and add new one with updated statuses
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('ska_kontaktas', 'bokad', 'ej_affar', 'affar'));

-- 3. Add deal_value column
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS deal_value integer;

-- 4. Create contact attempts table
CREATE TABLE IF NOT EXISTS public.lead_contact_attempts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  method text NOT NULL CHECK (method IN ('phone', 'sms', 'email')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_contact_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage contact attempts"
  ON public.lead_contact_attempts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_contact_attempts_lead
  ON public.lead_contact_attempts(lead_id);

-- 5. Update default status for new leads
ALTER TABLE public.leads ALTER COLUMN status SET DEFAULT 'ska_kontaktas';
