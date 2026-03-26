-- Create AGA detectors table
CREATE TABLE public.aga_detectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag TEXT,
  abb_tagname TEXT,
  description TEXT,
  recipe TEXT,
  rgu TEXT,
  area TEXT,
  system_status TEXT,
  field_status TEXT,
  unit_serial TEXT,
  calibration_date DATE,
  calibration_due_date DATE,
  serial_no_detector TEXT,
  serial_no_sensor TEXT,
  location TEXT,
  media TEXT,
  sensor_change TEXT,
  calibration_gas TEXT,
  range_min NUMERIC,
  range_max NUMERIC,
  unit TEXT,
  accuracy TEXT,
  trip_point_h TEXT,
  trip_point_hh TEXT,
  zero_gas_cert TEXT,
  span_gas_cert TEXT,
  o_adjust TEXT,
  span_adjust TEXT,
  iq_reprogrammed TEXT,
  remarks TEXT,
  nne_remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.aga_detectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.aga_detectors FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.aga_detectors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.aga_detectors FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.aga_detectors FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_aga_detectors_updated_at
BEFORE UPDATE ON public.aga_detectors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create sensor_changes table
CREATE TABLE public.sensor_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  detector_id uuid REFERENCES public.aga_detectors(id) ON DELETE CASCADE NOT NULL,
  old_serial_no_sensor text,
  new_serial_no_sensor text NOT NULL,
  comment text,
  change_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.sensor_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.sensor_changes FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert" ON public.sensor_changes FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.sensor_changes FOR DELETE TO public USING (true);

-- Create service_logs table
CREATE TABLE public.service_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  detector_id uuid NOT NULL REFERENCES public.aga_detectors(id) ON DELETE CASCADE,
  problem_description text,
  work_performed text,
  new_calibration_date date,
  zero_gas_cert text,
  span_gas_cert text,
  service_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.service_logs FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert" ON public.service_logs FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public delete" ON public.service_logs FOR DELETE TO public USING (true);