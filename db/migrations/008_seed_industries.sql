-- Seed industry_taxonomy with the 10 hardcoded industries used in the listing wizard
-- These match the INDUSTRIES array in step-basics.tsx

INSERT INTO public.industry_taxonomy (industry_code, parent_code, display_name, anzsic_code, description, is_active)
VALUES
  ('cafe', NULL, 'Cafés & Coffee Shops', 'H4511', 'Specialty coffee shops, cafes, and tea houses.', true),
  ('restaurant', NULL, 'Restaurants & Hospitality', 'H4511', 'Restaurants, bars, catering, and food service businesses.', true),
  ('retail', NULL, 'Retail Store', 'G4000', 'Physical retail stores across all categories.', true),
  ('ecommerce', NULL, 'E-commerce Business', 'G4310', 'Online retail businesses, DTC and marketplace models.', true),
  ('professional_services', NULL, 'Professional Services', 'M6962', 'Consulting, marketing, accounting, legal, and agency businesses.', true),
  ('trades', NULL, 'Trades & Construction Services', 'E3000', 'Building, plumbing, electrical, landscaping, and trade services.', true),
  ('health_wellness', NULL, 'Health & Wellness', 'Q8500', 'Gyms, clinics, allied health, and wellness businesses.', true),
  ('saas', NULL, 'SaaS / Software', 'J5800', 'Subscription-based software businesses.', true),
  ('manufacturing', NULL, 'Manufacturing & Wholesale', 'C1000', 'Manufacturing, production, and wholesale distribution.', true),
  ('beauty', NULL, 'Beauty & Personal Care', 'S9511', 'Hair salons, beauty therapists, spas, and personal care.', true),
  ('other', NULL, 'Other', 'X0000', 'Other industries not listed above.', true)
ON CONFLICT (industry_code) DO NOTHING;
