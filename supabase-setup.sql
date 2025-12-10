-- Marketing Learning Platform - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_number INT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  challenge TEXT,
  order_index INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content table (AI-generated, cached)
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('basic', 'advanced')),
  content TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(topic_id, level)
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  basic_completed BOOLEAN DEFAULT FALSE,
  basic_completed_at TIMESTAMP WITH TIME ZONE,
  advanced_completed BOOLEAN DEFAULT FALSE,
  advanced_completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, topic_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_topics_module_id ON topics(module_id);
CREATE INDEX IF NOT EXISTS idx_content_topic_id ON content(topic_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_topic_id ON user_progress(topic_id);

-- Enable Row Level Security (RLS)
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now - can be restricted later)
CREATE POLICY "Allow all access to modules" ON modules FOR ALL USING (true);
CREATE POLICY "Allow all access to topics" ON topics FOR ALL USING (true);
CREATE POLICY "Allow all access to content" ON content FOR ALL USING (true);
CREATE POLICY "Allow all access to user_progress" ON user_progress FOR ALL USING (true);

-- Seed data for modules
INSERT INTO modules (module_number, title, description) VALUES
(0, 'Grounding & First Principles', 'Build a solid foundation with metrics, value equations, and ethical growth mindset'),
(1, 'Customer, Problem, Positioning', 'Define your ideal customer, understand their jobs-to-be-done, and position your offer'),
(2, 'Offers, Copy, and Landing Pages', 'Create irresistible offers and high-converting landing pages'),
(3, 'Organic Foundations (SEO + Content)', 'Build sustainable organic traffic through SEO and content strategy'),
(4, 'Social & Distribution', 'Master social media channels and content distribution'),
(5, 'Paid Acquisition (Essentials)', 'Learn the fundamentals of Google and Meta ads without the guru nonsense'),
(6, 'Lifecycle, CRM & Automation', 'Nurture leads and retain customers with smart automation'),
(7, 'CRO, Experiments & Unit Economics', 'Optimize conversions through testing and understand your numbers'),
(8, 'Growth Loops & Moats', 'Build sustainable growth engines and competitive advantages')
ON CONFLICT (module_number) DO NOTHING;

-- Get module IDs for topic insertion
DO $$
DECLARE
  m0_id UUID;
  m1_id UUID;
  m2_id UUID;
  m3_id UUID;
  m4_id UUID;
  m5_id UUID;
  m6_id UUID;
  m7_id UUID;
  m8_id UUID;
BEGIN
  SELECT id INTO m0_id FROM modules WHERE module_number = 0;
  SELECT id INTO m1_id FROM modules WHERE module_number = 1;
  SELECT id INTO m2_id FROM modules WHERE module_number = 2;
  SELECT id INTO m3_id FROM modules WHERE module_number = 3;
  SELECT id INTO m4_id FROM modules WHERE module_number = 4;
  SELECT id INTO m5_id FROM modules WHERE module_number = 5;
  SELECT id INTO m6_id FROM modules WHERE module_number = 6;
  SELECT id INTO m7_id FROM modules WHERE module_number = 7;
  SELECT id INTO m8_id FROM modules WHERE module_number = 8;

  -- Module 0 Topics
  INSERT INTO topics (module_id, title, subtitle, order_index, challenge) VALUES
  (m0_id, 'North Star Metric (NSM) & One Funnel', 'Keeps you laser-focused on impact', 1, NULL),
  (m0_id, 'Value Equation', 'Dream outcome × Likelihood – Time – Effort – Cost — Design offers that people can''t ignore', 2, NULL),
  (m0_id, 'Fermi Estimates for Market & CAC/LTV', 'Quick maths prevents costly fantasies', 3, NULL),
  (m0_id, 'User Journey Map', 'Aware→Consider→Convert→Retain→Refer — See exactly where to intervene', 4, NULL),
  (m0_id, 'One-Metric Dashboards (GA4/Sheet)', 'Measure what matters, not everything', 5, NULL),
  (m0_id, 'UTM Hygiene', 'Source/medium/campaign — Attribution starts with clean tags', 6, NULL),
  (m0_id, 'Ethics, Privacy, and Spam-Safe Mindset', 'Grow fast without burning trust', 7, NULL),
  (m0_id, 'Musk-Mode Mini-Challenge', 'In 20 minutes, define your NSM, LTV ballpark, and top bottleneck stage', 8, 'In 20 minutes, define your NSM, LTV ballpark, and top bottleneck stage.')
  ON CONFLICT DO NOTHING;

  -- Module 1 Topics
  INSERT INTO topics (module_id, title, subtitle, order_index, challenge) VALUES
  (m1_id, 'ICP (Ideal Customer Profile) in One Paragraph', 'Clarity saves months of trial-and-error', 1, NULL),
  (m1_id, 'Jobs-To-Be-Done Interview Script', 'Hear the real hiring criteria for your product', 2, NULL),
  (m1_id, 'Pain > Desire > Outcome Ladder', 'Write benefits that hit like a train', 3, NULL),
  (m1_id, 'Category & Competitors Map', 'Position to be the obvious choice', 4, NULL),
  (m1_id, 'Unique Mechanism', 'What''s different? — Differentiation boosts CTR and trust', 5, NULL),
  (m1_id, 'One-Line Value Proposition', 'If it''s not clear, it won''t convert', 6, NULL),
  (m1_id, 'Objection Bank (with Counters)', 'Pre-answer doubts, lift conversions fast', 7, NULL),
  (m1_id, 'Mini-Challenge', 'Write a 15-word value prop and 5 objections with crisp counters', 8, 'Write a 15-word value prop and 5 objections with crisp counters.')
  ON CONFLICT DO NOTHING;

  -- Module 2 Topics
  INSERT INTO topics (module_id, title, subtitle, order_index, challenge) VALUES
  (m2_id, 'Core Offer + 2 Bonuses + Risk-Reversal', 'Stacked value outsells features', 1, NULL),
  (m2_id, 'Hero Hook', 'Problem → Promise → Proof → Prompt — First 5 seconds decide fate', 2, NULL),
  (m2_id, 'Proof Assets', 'Testimonials, numbers, demos — Proof turns curiosity into belief', 3, NULL),
  (m2_id, 'Landing Structure (AIDA + FAQs + CTA)', 'A clean flow prints conversions', 4, NULL),
  (m2_id, 'Mobile Speed', 'Pagespeed, image compression — Fast pages = cheaper traffic', 5, NULL),
  (m2_id, 'Form Design & Micro-Copy', 'Fewer fields, more leads', 6, NULL),
  (m2_id, 'Single KPI Per Page', 'No distractions, better signal', 7, NULL),
  (m2_id, 'Mini-Challenge', 'Draft a wireframe on paper; write 3 hero hooks; pick one', 8, 'Draft a wireframe on paper; write 3 hero hooks; pick one.')
  ON CONFLICT DO NOTHING;

  -- Module 3 Topics
  INSERT INTO topics (module_id, title, subtitle, order_index, challenge) VALUES
  (m3_id, 'Keyword Intent', 'Informational vs Transactional — Match intent, win rankings', 1, NULL),
  (m3_id, 'Content Pillars & Topic Clusters', 'Organised content = compounding traffic', 2, NULL),
  (m3_id, 'On-Page Basics', 'Title, H1, alt, schema — Free SEO wins in an hour', 3, NULL),
  (m3_id, 'Helpful Content Outline (E-E-A-T)', 'Trustworthy guides outrank fluff', 4, NULL),
  (m3_id, 'Internal Linking & Pillar Hub', 'Pass authority like a pro', 5, NULL),
  (m3_id, 'Simple Content Calendar', '2 posts/week — Consistency beats bursts', 6, NULL),
  (m3_id, 'ASO Basics (if app)', 'Store pages are your new homepage', 7, NULL),
  (m3_id, 'Mini-Challenge', 'Ship one "pain-to-promise" blog targeting a transactional keyword this week', 8, 'Ship one "pain-to-promise" blog targeting a transactional keyword this week.')
  ON CONFLICT DO NOTHING;

  -- Module 4 Topics
  INSERT INTO topics (module_id, title, subtitle, order_index, challenge) VALUES
  (m4_id, 'Choose Two Channels', 'Home + experimental — Focus multiplies output', 1, NULL),
  (m4_id, 'Format Stack', 'Shorts, carousels, threads — Native formats travel further', 2, NULL),
  (m4_id, 'Hook Library', 'First 2 seconds rule — Win the scroll war early', 3, NULL),
  (m4_id, 'Content Repurposing Workflow', 'One idea → many assets saves time', 4, NULL),
  (m4_id, 'Community Replies & DMs', 'Conversations convert better than posts', 5, NULL),
  (m4_id, 'Creator/Influencer Short-List', 'Borrow audiences, accelerate trust', 6, NULL),
  (m4_id, 'Posting Cadence & Weekly Review', 'Rhythm creates reach', 7, NULL),
  (m4_id, 'Mini-Challenge', 'Repurpose one blog into 5 social assets; post across two channels', 8, 'Repurpose one blog into 5 social assets; post across two channels.')
  ON CONFLICT DO NOTHING;

  -- Module 5 Topics
  INSERT INTO topics (module_id, title, subtitle, order_index, challenge) VALUES
  (m5_id, 'Pixels & Conversions (GA4/Ads Manager)', 'Without signals, money burns', 1, NULL),
  (m5_id, 'Offer-Creative-Audience Triangle', 'Creatives usually move the needle most', 2, NULL),
  (m5_id, 'Google Search Basics', 'Exact, phrase, negatives — Buy high-intent clicks first', 3, NULL),
  (m5_id, 'Meta Ads Basics', 'Creative testing pods — Test messages fast and cheap', 4, NULL),
  (m5_id, 'Account Structure for Learning', 'Fewer, cleaner campaigns = stable scaling', 5, NULL),
  (m5_id, 'Bidding & Budgets', 'Start small, ramp with MER — Protect cash, learn fast', 6, NULL),
  (m5_id, 'Ad Compliance & Landing Congruence', 'Relevance score lowers CPC', 7, NULL),
  (m5_id, 'Mini-Challenge', 'Launch 1 Google exact-match ad group + 3-creative Meta test with clear UTMs', 8, 'Launch 1 Google exact-match ad group + 3-creative Meta test with clear UTMs.')
  ON CONFLICT DO NOTHING;

  -- Module 6 Topics
  INSERT INTO topics (module_id, title, subtitle, order_index, challenge) VALUES
  (m6_id, 'Lead Magnets That Truly Help', 'Give value, earn permission', 1, NULL),
  (m6_id, 'Welcome/Onboarding Email (3-Step)', 'Great first run = higher LTV', 2, NULL),
  (m6_id, 'Nurture Cadence', 'Teach → Case → Ask — Trust builds with rhythm', 3, NULL),
  (m6_id, 'RFM Segmentation', 'Recent, freq, monetary — Talk differently to different users', 4, NULL),
  (m6_id, 'WhatsApp/SMS Use-Cases (India-Friendly)', 'Timely nudges, not spam', 5, NULL),
  (m6_id, 'Cart/Browse Abandonment Flows', 'Recover easy revenue 24×7', 6, NULL),
  (m6_id, 'Review/Referral Request Automation', 'Happy users become your sales team', 7, NULL),
  (m6_id, 'Mini-Challenge', 'Set a 3-email welcome flow and a cart-abandon reminder in one day', 8, 'Set a 3-email welcome flow and a cart-abandon reminder in one day.')
  ON CONFLICT DO NOTHING;

  -- Module 7 Topics
  INSERT INTO topics (module_id, title, subtitle, order_index, challenge) VALUES
  (m7_id, 'Heuristic Audit', 'Clarity, friction, anxiety — Spot fixes without waiting for data', 1, NULL),
  (m7_id, 'A/B Testing Basics', 'One hypothesis rule — Science, not vibes', 2, NULL),
  (m7_id, 'Social Proof & Risk-Reversal Placement', 'Trust near CTAs lifts clicks', 3, NULL),
  (m7_id, 'Speed, UX, and Accessibility Checks', 'Bad UX silently kills ROAS', 4, NULL),
  (m7_id, 'Cohort Metrics', 'CAC payback, LTV curves — Decide scale vs. sustain', 5, NULL),
  (m7_id, 'Attribution Sanity', 'Last vs data-driven — Don''t credit the wrong channel', 6, NULL),
  (m7_id, 'North-Star Review & Next Biggest Constraint', 'Always attack the bottleneck', 7, NULL),
  (m7_id, 'Mini-Challenge', 'Run one A/B test on your most-visited page this week', 8, 'Run one A/B test on your most-visited page this week.')
  ON CONFLICT DO NOTHING;

  -- Module 8 Topics
  INSERT INTO topics (module_id, title, subtitle, order_index, challenge) VALUES
  (m8_id, 'Referral Loop', 'Incentives & triggers — Users bring users, CAC drops', 1, NULL),
  (m8_id, 'Partnerships & Affiliates', 'Borrow trust at scale', 2, NULL),
  (m8_id, 'PR/Launch Moments & Narratives', 'Attention spikes feed the funnel', 3, NULL),
  (m8_id, 'Community & UGC Flywheel', 'Content you don''t have to write', 4, NULL),
  (m8_id, 'Product-Led Growth', 'Aha, habit, hooks — Feature moments that sell themselves', 5, NULL),
  (m8_id, 'Retention Levers', 'Feature, habit, value — LTV growth compounds everything', 6, NULL),
  (m8_id, 'Learning Cadence', 'Weekly post-mortem — Sharpen the axe every 7 days', 7, NULL)
  ON CONFLICT DO NOTHING;
END $$;
