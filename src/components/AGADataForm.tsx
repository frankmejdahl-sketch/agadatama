import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AgaDetector } from "@/integrations/supabase/helpers";
import { Save, X } from "lucide-react";
import { SensorChangeSection } from "@/components/SensorChangeSection";
import { ServiceLogSection } from "@/components/ServiceLogSection";

type FormData = Omit<AgaDetector, "id" | "created_at" | "updated_at">;

const emptyForm: FormData = {
  tag: "", abb_tagname: "", description: "", recipe: "", rgu: "", area: "",
  system_status: "", field_status: "", unit_serial: "", calibration_date: "",
  calibration_due_date: "", serial_no_detector: "", serial_no_sensor: "",
  location: "", media: "", sensor_change: "", calibration_gas: "",
  range_min: null, range_max: null, unit: "", accuracy: "",
  trip_point_h: "", trip_point_hh: "", zero_gas_cert: "", span_gas_cert: "",
  o_adjust: "", span_adjust: "", iq_reprogrammed: "", remarks: "", nne_remarks: "",
};

interface AGADataFormProps {
  detector?: AgaDetector | null;
  onSave: (data: FormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function AGADataForm({ detector, onSave, onCancel, loading }: AGADataFormProps) {
  const [form, setForm] = useState<FormData>(emptyForm);

  useEffect(() => {
    if (detector) {
      const { id, created_at, updated_at, ...rest } = detector;
      setForm(rest as FormData);
    } else {
      setForm(emptyForm);
    }
  }, [detector]);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    setForm(prev => ({
      ...prev,
      [field]: field === "range_min" || field === "range_max" ? (val === "" ? null : Number(val)) : val,
    }));
  };

  const renderField = (label: string, field: keyof FormData, type = "text") => (
    <div className="space-y-1" key={field}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={form[field] ?? ""}
        onChange={set(field)}
        className="h-9 text-sm"
      />
    </div>
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          {detector ? "Rediger Detektor" : "Ny Detektor"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="space-y-6">
          {/* Identifikation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-1">Identifikation</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label="Tag" field="tag" />
              <Field label="Beskrivelse" field="description" />
              <Field label="Area" field="area" />
              <Field label="Location" field="location" />
            </div>
          </div>

          {/* Enhed & Sensor */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-1">Enhed & Sensor</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label="Serial No. Detector" field="serial_no_detector" />
              <Field label="Serial No. Sensor" field="serial_no_sensor" />
              <Field label="Media" field="media" />
              <Field label="Sensor Change" field="sensor_change" />
              <Field label="Kalibrerings Gas" field="calibration_gas" />
            </div>
          </div>

          {/* Sensor Skift - kun ved redigering */}
          {detector && (
            <SensorChangeSection
              detectorId={detector.id}
              currentSensorSerial={form.serial_no_sensor as string | null}
              onSensorChanged={(newSerial, changeDate) => setForm(prev => ({ ...prev, serial_no_sensor: newSerial, sensor_change: changeDate }))}
            />
          )}

          {/* Service Log - kun ved redigering */}
          {detector && (
            <ServiceLogSection
              detectorId={detector.id}
              onCalibrationUpdated={(date, zeroGas, spanGas) =>
                setForm(prev => ({
                  ...prev,
                  calibration_date: date,
                  ...(zeroGas ? { zero_gas_cert: zeroGas } : {}),
                  ...(spanGas ? { span_gas_cert: spanGas } : {}),
                }))
              }
            />
          )}

          {/* Kalibrering */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-1">Kalibrering</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label="Calibration Date" field="calibration_date" type="date" />
              <Field label="Calibration Due Date" field="calibration_due_date" type="date" />
            </div>
          </div>

          {/* Måleområde */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-1">Måleområde & Nøjagtighed</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <Field label="Range Min." field="range_min" type="number" />
              <Field label="Range Max." field="range_max" type="number" />
              <Field label="Unit" field="unit" />
              <Field label="Accuracy" field="accuracy" />
              <Field label="Trip Point, H" field="trip_point_h" />
              <Field label="Trip Point, HH" field="trip_point_hh" />
            </div>
          </div>

          {/* Certifikater & Justering */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-1">Certifikater & Justering</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Field label="0 Gas Cert" field="zero_gas_cert" />
              <Field label="Span Gas Cert" field="span_gas_cert" />
              <Field label="O - Adjust" field="o_adjust" />
              <Field label="Span - Adjust" field="span_adjust" />
              <Field label="IQ Reprogrammed" field="iq_reprogrammed" />
            </div>
          </div>

          {/* Status & Bemærkninger */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-1">Status & Bemærkninger</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="System Status" field="system_status" />
              <Field label="Field Status" field="field_status" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Remarks</Label>
              <Textarea
                value={form.remarks ?? ""}
                onChange={set("remarks")}
                className="text-sm min-h-[80px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">NNE Remarks</Label>
              <Textarea
                value={form.nne_remarks ?? ""}
                onChange={set("nne_remarks")}
                className="text-sm min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Gemmer..." : "Gem"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="gap-2">
              <X className="h-4 w-4" />
              Annuller
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
