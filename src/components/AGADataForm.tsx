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
              {renderField("Tag", "tag")}
              {renderField("Beskrivelse", "description")}
              {renderField("Area", "area")}
              {renderField("Location", "location")}
            </div>
          </div>

          {/* Enhed & Sensor */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-1">Enhed & Sensor</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {renderField("Serial No. Detector", "serial_no_detector")}
              {renderField("Serial No. Sensor", "serial_no_sensor")}
              {renderField("Media", "media")}
              {renderField("Sensor Change", "sensor_change")}
              {renderField("Kalibrerings Gas", "calibration_gas")}
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
              {renderField("Calibration Date", "calibration_date", "date")}
              {renderField("Calibration Due Date", "calibration_due_date", "date")}
            </div>
          </div>

          {/* Måleområde */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-1">Måleområde & Nøjagtighed</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {renderField("Range Min.", "range_min", "number")}
              {renderField("Range Max.", "range_max", "number")}
              {renderField("Unit", "unit")}
              {renderField("Accuracy", "accuracy")}
              {renderField("Trip Point, H", "trip_point_h")}
              {renderField("Trip Point, HH", "trip_point_hh")}
            </div>
          </div>

          {/* Certifikater & Justering */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-1">Certifikater & Justering</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {renderField("0 Gas Cert", "zero_gas_cert")}
              {renderField("Span Gas Cert", "span_gas_cert")}
              {renderField("O - Adjust", "o_adjust")}
              {renderField("Span - Adjust", "span_adjust")}
              {renderField("IQ Reprogrammed", "iq_reprogrammed")}
            </div>
          </div>

          {/* Status & Bemærkninger */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-primary border-b border-border pb-1">Status & Bemærkninger</h3>
            <div className="grid grid-cols-2 gap-3">
              {renderField("System Status", "system_status")}
              {renderField("Field Status", "field_status")}
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
