import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wrench, History, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ServiceLog {
  id: string;
  detector_id: string;
  problem_description: string | null;
  work_performed: string | null;
  new_calibration_date: string | null;
  zero_gas_cert: string | null;
  span_gas_cert: string | null;
  service_date: string;
  created_at: string;
}

interface ServiceLogSectionProps {
  detectorId: string;
  onCalibrationUpdated?: (date: string, zeroGas: string, spanGas: string) => void;
}

export function ServiceLogSection({ detectorId, onCalibrationUpdated }: ServiceLogSectionProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<ServiceLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);

  const [problemDescription, setProblemDescription] = useState("");
  const [workPerformed, setWorkPerformed] = useState("");
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [hasCalibration, setHasCalibration] = useState(false);
  const [calibrationDate, setCalibrationDate] = useState("");
  const [zeroGasCert, setZeroGasCert] = useState("");
  const [spanGasCert, setSpanGasCert] = useState("");

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("service_logs")
      .select("*")
      .eq("detector_id", detectorId)
      .order("service_date", { ascending: false });
    if (!error && data) setHistory(data as ServiceLog[]);
  };

  useEffect(() => { fetchHistory(); }, [detectorId]);

  const resetForm = () => {
    setProblemDescription("");
    setWorkPerformed("");
    setServiceDate(new Date().toISOString().split("T")[0]);
    setHasCalibration(false);
    setCalibrationDate("");
    setZeroGasCert("");
    setSpanGasCert("");
  };

  const handleSave = async () => {
    if (!problemDescription.trim() && !workPerformed.trim()) {
      toast.error("Udfyld mindst problembeskrivelse eller udført arbejde");
      return;
    }
    setSaving(true);

    const { error: insertErr } = await supabase.from("service_logs").insert({
      detector_id: detectorId,
      user_id: user?.id,
      problem_description: problemDescription.trim() || null,
      work_performed: workPerformed.trim() || null,
      service_date: serviceDate,
      new_calibration_date: hasCalibration && calibrationDate ? calibrationDate : null,
      zero_gas_cert: hasCalibration ? (zeroGasCert.trim() || null) : null,
      span_gas_cert: hasCalibration ? (spanGasCert.trim() || null) : null,
    });

    if (insertErr) {
      toast.error("Fejl: " + insertErr.message);
      setSaving(false);
      return;
    }

    if (hasCalibration && calibrationDate) {
      const updateData: { calibration_date: string; zero_gas_cert?: string; span_gas_cert?: string } = { calibration_date: calibrationDate };
      if (zeroGasCert.trim()) updateData.zero_gas_cert = zeroGasCert.trim();
      if (spanGasCert.trim()) updateData.span_gas_cert = spanGasCert.trim();

      const { error: updateErr } = await supabase
        .from("aga_detectors")
        .update(updateData)
        .eq("id", detectorId);

      if (updateErr) {
        toast.error("Fejl ved opdatering af kalibrering: " + updateErr.message);
      } else {
        onCalibrationUpdated?.(calibrationDate, zeroGasCert.trim(), spanGasCert.trim());
      }
    }

    toast.success("Service log gemt");
    setShowForm(false);
    resetForm();
    fetchHistory();
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary border-b border-border pb-1 flex-1">Service</h3>
        <div className="flex gap-2 ml-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => { if (!showForm) resetForm(); setShowForm(!showForm); }}
            className="gap-1 text-xs"
          >
            <Wrench className="h-3 w-3" />
            Ny Service
          </Button>
          {history.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="gap-1 text-xs"
            >
              <History className="h-3 w-3" />
              Service Log ({history.length})
              {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="border border-border rounded-md p-4 bg-muted/30 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">Service Dato</Label>
            <Input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              className="h-9 text-sm w-48"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">Problembeskrivelse</Label>
            <Textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="text-sm min-h-[60px]"
              placeholder="Beskriv problemet..."
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">Udført Arbejde</Label>
            <Textarea
              value={workPerformed}
              onChange={(e) => setWorkPerformed(e.target.value)}
              className="text-sm min-h-[60px]"
              placeholder="Beskriv udført arbejde..."
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Checkbox
              id="has-calibration"
              checked={hasCalibration}
              onCheckedChange={(v) => setHasCalibration(!!v)}
            />
            <Label htmlFor="has-calibration" className="text-xs font-medium cursor-pointer">
              Kalibrering udført
            </Label>
          </div>

          {hasCalibration && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-6 border-l-2 border-primary/20">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Ny Kalibreringsdato</Label>
                <Input
                  type="date"
                  value={calibrationDate}
                  onChange={(e) => setCalibrationDate(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">0 Gas Cert</Label>
                <Input
                  value={zeroGasCert}
                  onChange={(e) => setZeroGasCert(e.target.value)}
                  className="h-9 text-sm"
                  placeholder="Certifikat nr."
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium text-muted-foreground">Span Gas Cert</Label>
                <Input
                  value={spanGasCert}
                  onChange={(e) => setSpanGasCert(e.target.value)}
                  className="h-9 text-sm"
                  placeholder="Certifikat nr."
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Gemmer..." : "Gem service"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); resetForm(); }}>
              Annuller
            </Button>
          </div>
        </div>
      )}

      {showHistory && history.length > 0 && (
        <div className="border border-border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Dato</TableHead>
                <TableHead className="text-xs">Problem</TableHead>
                <TableHead className="text-xs">Udført Arbejde</TableHead>
                <TableHead className="text-xs">Kalibreret</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="text-xs whitespace-nowrap">{h.service_date}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate">{h.problem_description || "-"}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate">{h.work_performed || "-"}</TableCell>
                  <TableCell className="text-xs">
                    {h.new_calibration_date ? h.new_calibration_date : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
