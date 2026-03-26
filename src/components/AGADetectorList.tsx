import { AgaDetector } from "@/integrations/supabase/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { useState } from "react";

interface AGADetectorListProps {
  detectors: AgaDetector[];
  onEdit: (detector: AgaDetector) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

export function AGADetectorList({ detectors, onEdit, onDelete, onNew }: AGADetectorListProps) {
  const [search, setSearch] = useState("");

  const filtered = detectors.filter(d => {
    const s = search.toLowerCase();
    return !s ||
      d.tag?.toLowerCase().includes(s) ||
      d.description?.toLowerCase().includes(s) ||
      d.area?.toLowerCase().includes(s) ||
      d.remarks?.toLowerCase().includes(s) ||
      d.abb_tagname?.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Søg tag, beskrivelse, area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button onClick={onNew} className="gap-2 h-9">
          <Plus className="h-4 w-4" />
          Ny Detektor
        </Button>
      </div>

      <div className="rounded-lg border bg-card overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Tag</TableHead>
              <TableHead className="font-semibold">Area</TableHead>
              <TableHead className="font-semibold">Spine</TableHead>
              <TableHead className="font-semibold">Next Calibration</TableHead>
              <TableHead className="font-semibold">Media</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Ingen detektorer fundet
                </TableCell>
              </TableRow>
            )}
            {filtered.map(d => (
              <TableRow key={d.id} className="cursor-pointer hover:bg-muted/30" onClick={() => onEdit(d)}>
                <TableCell className="font-mono text-sm">{d.tag}</TableCell>
                <TableCell className="text-sm">{d.area}</TableCell>
                <TableCell className="text-sm">{d.location}</TableCell>
                <TableCell className="text-sm">{d.calibration_due_date || "-"}</TableCell>
                <TableCell className="text-sm">{d.media}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(d); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(d.id); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} af {detectors.length} detektorer</p>
    </div>
  );
}
