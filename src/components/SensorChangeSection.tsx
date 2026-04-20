import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, History, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface SensorChange {
  id: string;
  detector_id: string;
  old_serial_no_sensor: string | null;
  new_serial_no_sensor: string;
  comment: string | null;
  change_date: string;
  created_at: string;
}

interface SensorChangeSectionProps {
  detectorId: string;
  currentSensorSerial: string | null;
  onSensorChanged: (newSerial: string, changeDate: string) => void;
}

export function SensorChangeSection({ detectorId, currentSensorSerial, onSensorChanged }: SensorChangeSectionProps) {
  const { user } = useAuth();
  const [history, setHistory] = useState<SensorChange[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newSerial, setNewSerial] = useState("");
  const [comment, setComment] = useState("");
  const [changeDate, setChangeDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("sensor_changes")
      .select("*")
      .eq("detector_id", detectorId)
      .order("change_date", { ascending: false });
    if (!error && data) setHistory(data as SensorChange[]);
  };

  useEffect(() => { fetchHistory(); }, [detectorId]);

  const handleSave = async () => {
    if (!newSerial.trim()) {
      toast.error("Indtast nyt sensor serienummer");
      return;
    }
    setSaving(true);

    const { error: insertErr } = await supabase.from("sensor_changes").insert({
      detector_id: detectorId,
      user_id: user?.id,
      old_serial_no_sensor: currentSensorSerial || null,
      new_serial_no_sensor: newSerial.trim(),
      comment: comment.trim() || null,
      change_date: changeDate,
    });

    if (insertErr) {
      toast.error("Fejl: " + insertErr.message);
      setSaving(false);
      return;
    }

    const { error: updateErr } = await supabase
      .from("aga_detectors")
      .update({
        serial_no_sensor: newSerial.trim(),
        sensor_change: changeDate,
      })
      .eq("id", detectorId);

    if (updateErr) {
      toast.error("Fejl ved opdatering: " + updateErr.message);
    } else {
      toast.success("Sensor skiftet");
      onSensorChanged(newSerial.trim(), changeDate);
      setShowForm(false);
      setNewSerial("");
      setComment("");
      fetchHistory();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-primary border-b border-border pb-1 flex-1">Sensor Skift</h3>
        <div className="flex gap-2 ml-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="gap-1 text-xs"
          >
            <Plus className="h-3 w-3" />
            Ny Sensor
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
              Historik ({history.length})
              {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>
          )}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Nuværende sensor: <span className="font-medium text-foreground">{currentSensorSerial || "Ingen"}</span>
      </div>

      {showForm && (
        <div className="border border-border rounded-md p-4 bg-muted/30 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Nyt Serial No. Sensor</Label>
              <Input
                value={newSerial}
                onChange={(e) => setNewSerial(e.target.value)}
                className="h-9 text-sm"
                placeholder="Indtast serienummer"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Dato for skift</Label>
              <Input
                type="date"
                value={changeDate}
                onChange={(e) => setChangeDate(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground">Kommentar</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-sm min-h-[60px]"
              placeholder="Årsag til sensorskift..."
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Gemmer..." : "Gem sensorskift"}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
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
                <TableHead className="text-xs">Gammel Sensor</TableHead>
                <TableHead className="text-xs">Ny Sensor</TableHead>
                <TableHead className="text-xs">Kommentar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="text-xs">{h.change_date}</TableCell>
                  <TableCell className="text-xs">{h.old_serial_no_sensor || "-"}</TableCell>
                  <TableCell className="text-xs">{h.new_serial_no_sensor}</TableCell>
                  <TableCell className="text-xs">{h.comment || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
