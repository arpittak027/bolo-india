-- ============================================================
-- BOLO INDIA DATABASE SCHEMA & MIGRATION (Supabase PostgreSQL)
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ANONYMOUS SESSIONS TABLE
-- Privacy-first: no mandatory login or personal identifiers
CREATE TABLE IF NOT EXISTS anonymous_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preferred_language TEXT NOT NULL DEFAULT 'hi-IN',
    selected_persona TEXT DEFAULT 'General Citizen',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for session queries
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON anonymous_sessions(created_at DESC);

-- 2. VOICE EXPERIMENTS TABLE
-- Tracks voice-vs-typing experiments and playground interactions
CREATE TABLE IF NOT EXISTS voice_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES anonymous_sessions(id) ON DELETE CASCADE,
    task_type TEXT NOT NULL, -- 'message', 'notes', 'creator', 'business', 'custom'
    input_method TEXT NOT NULL, -- 'voice' or 'typing'
    duration_ms INTEGER NOT NULL CHECK (duration_ms >= 0),
    word_count INTEGER NOT NULL CHECK (word_count >= 0),
    transcribed_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_experiments_session_id ON voice_experiments(session_id);
CREATE INDEX IF NOT EXISTS idx_experiments_task_type ON voice_experiments(task_type);

-- 3. GAME RESULTS TABLE (BOLO SPRINT)
-- Tracks mini-game runs, scoring, and completed rounds
CREATE TABLE IF NOT EXISTS game_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES anonymous_sessions(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 300),
    rounds_completed INTEGER NOT NULL CHECK (rounds_completed >= 0 AND rounds_completed <= 3),
    breakdown JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_game_results_session ON game_results(session_id);

-- 4. USER FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES anonymous_sessions(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE anonymous_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Anonymous sessions: Anyone can create; read own session
CREATE POLICY "Allow public inserts on anonymous_sessions"
    ON anonymous_sessions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public select on anonymous_sessions"
    ON anonymous_sessions FOR SELECT
    TO anon, authenticated
    USING (true);

-- Voice experiments: Public inserts, read by session
CREATE POLICY "Allow public inserts on voice_experiments"
    ON voice_experiments FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public select on voice_experiments"
    ON voice_experiments FOR SELECT
    TO anon, authenticated
    USING (true);

-- Game results: Public inserts, public read
CREATE POLICY "Allow public inserts on game_results"
    ON game_results FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public select on game_results"
    ON game_results FOR SELECT
    TO anon, authenticated
    USING (true);

-- User feedback: Public inserts only
CREATE POLICY "Allow public inserts on user_feedback"
    ON user_feedback FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

