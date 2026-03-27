import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AgaDetector } from "@/integrations/supabase/helpers";
import { AGADetectorList } from "@/components/AGADetectorList";
import { AGADataForm } from "@/components/AGADataForm";
import { toast } from "sonner";
import { Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

type View = "list" | "form";

const Index = () => {
  const [detectors, setDetectors] = useState<AgaDetector[]>([]);
  const [selected, setSelected] = useState<AgaDetector | null>(null);
  const [view, setView] = useState<View>("list");
  const [loading, setLoading] = useState(false);

  const fetchDetectors = async () => {
    const { data, error } = await supabase
      .from("aga_detectors")
      .select("*")
      .order("tag");
    if (error) {
      toast.error("Kunne ikke hente data: " + error.message);
      return;
    }
    setDetectors((data as AgaDetector[]) || []);
  };

  useEffect(() => { fetchDetectors(); }, []);

  const handleSave = async (formData: Omit<AgaDetector, "id" | "created_at" | "updated_at">) => {
    setLoading(true);
    if (selected) {
      const { error } = await supabase
        .from("aga_detectors")
        .update(formData)
        .eq("id", selected.id);
      if (error) { toast.error("Fejl ved opdatering: " + error.message); }
      else { toast.success("Detektor opdateret"); }
    } else {
      const { error } = await supabase
        .from("aga_detectors")
        .insert(formData);
      if (error) { toast.error("Fejl ved oprettelse: " + error.message); }
      else { toast.success("Detektor oprettet"); }
    }
    setLoading(false);
    setView("list");
    setSelected(null);
    fetchDetectors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Er du sikker på at du vil slette denne detektor?")) return;
    const { error } = await supabase.from("aga_detectors").delete().eq("id", id);
    if (error) { toast.error("Fejl ved sletning: " + error.message); }
    else { toast.success("Detektor slettet"); fetchDetectors(); }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">AGA Detektor Database MA</h1>
              <p className="text-sm text-muted-foreground">Gasdetektorer - Kalibrering & Status</p>
            </div>
          </div>
          {view === "form" && (
            <Button onClick={() => { const formEl = document.querySelector('form'); formEl?.requestSubmit(); }} disabled={loading} className="gap-2">
              <Save className="h-4 w-4" />
              {loading ? "Gemmer..." : "Gem"}
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {view === "list" ? (
          <AGADetectorList
            detectors={detectors}
            onEdit={(d) => { setSelected(d); setView("form"); }}
            onDelete={handleDelete}
            onNew={() => { setSelected(null); setView("form"); }}
          />
        ) : (
          <AGADataForm
            detector={selected}
            onSave={handleSave}
            onCancel={() => { setView("list"); setSelected(null); }}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
