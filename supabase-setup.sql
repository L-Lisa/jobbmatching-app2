-- Run this in Supabase SQL Editor to create the jobs table
-- Go to: Supabase Dashboard → SQL Editor → New Query → Paste this → Run

CREATE TABLE jobs (
  id BIGSERIAL PRIMARY KEY,
  yrke TEXT NOT NULL,
  foretag TEXT,
  omfattning TEXT NOT NULL,
  lon TEXT NOT NULL,
  erfarenhet TEXT,
  utbildning TEXT,
  ovrigt TEXT,
  ansvarig_matchare TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow anyone to read jobs (public access)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read jobs" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert jobs" ON jobs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete jobs" ON jobs
  FOR DELETE USING (true);
