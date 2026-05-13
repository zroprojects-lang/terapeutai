-- Affiliates system: therapists with paid plans can have referral codes
-- Tracks link clicks and conversions (new registrations from referral)

CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES therapists(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliates_therapist ON affiliates(therapist_id);
CREATE INDEX idx_affiliates_code ON affiliates(code);

-- Track each referral conversion
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  referred_therapist_id UUID REFERENCES therapists(id) ON DELETE SET NULL,
  referred_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'activated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_affiliate ON referrals(affiliate_id);

-- RPC functions for atomic increments
CREATE OR REPLACE FUNCTION increment_affiliate_clicks(affiliate_id UUID)
RETURNS void AS $$
  UPDATE affiliates SET clicks = clicks + 1, updated_at = now() WHERE id = affiliate_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION increment_affiliate_conversions(affiliate_id UUID)
RETURNS void AS $$
  UPDATE affiliates SET conversions = conversions + 1, updated_at = now() WHERE id = affiliate_id;
$$ LANGUAGE sql;

-- No RLS on these tables — admin-only access via service role key
