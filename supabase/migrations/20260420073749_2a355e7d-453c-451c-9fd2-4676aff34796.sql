-- Profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add user_id to existing data tables (nullable; data is shared anyway)
ALTER TABLE public.aga_detectors ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.sensor_changes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.service_logs ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Replace public RLS with authenticated-only policies (all users see/edit everything)
DROP POLICY IF EXISTS "Allow public read" ON public.aga_detectors;
DROP POLICY IF EXISTS "Allow public insert" ON public.aga_detectors;
DROP POLICY IF EXISTS "Allow public update" ON public.aga_detectors;
DROP POLICY IF EXISTS "Allow public delete" ON public.aga_detectors;

CREATE POLICY "Authenticated read" ON public.aga_detectors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert" ON public.aga_detectors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON public.aga_detectors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated delete" ON public.aga_detectors FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read" ON public.sensor_changes;
DROP POLICY IF EXISTS "Allow public insert" ON public.sensor_changes;
DROP POLICY IF EXISTS "Allow public delete" ON public.sensor_changes;

CREATE POLICY "Authenticated read" ON public.sensor_changes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert" ON public.sensor_changes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated delete" ON public.sensor_changes FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read" ON public.service_logs;
DROP POLICY IF EXISTS "Allow public insert" ON public.service_logs;
DROP POLICY IF EXISTS "Allow public delete" ON public.service_logs;

CREATE POLICY "Authenticated read" ON public.service_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert" ON public.service_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated delete" ON public.service_logs FOR DELETE TO authenticated USING (true);