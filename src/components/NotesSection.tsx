import React from 'react';
import { FileText, UserCheck, Tag, Plus } from 'lucide-react';
import { QUICK_NOTE_SUGGESTIONS, TECHNICIANS } from '../data/services';

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  technicianName: string;
  onTechnicianChange: (name: string) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  onNotesChange,
  technicianName,
  onTechnicianChange,
}) => {
  const handleAddQuickTag = (tag: string) => {
    if (!notes.trim()) {
      onNotesChange(tag);
    } else if (!notes.includes(tag)) {
      onNotesChange(`${notes.trim()}, ${tag}`);
    }
  };

  return (
    <section className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-neutral-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
            04
          </span>
          <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
            Catatan tambahan
          </h2>
        </div>
        <span className="text-xs text-neutral-400">Kondisi &amp; Permintaan</span>
      </div>

      <div className="space-y-4">
        {/* Quick Suggestion Chips */}
        <div>
          <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5 mb-2">
            <Tag className="h-3.5 w-3.5 text-cyan-400" />
            <span>Pilihan catatan cepat (klik untuk menambahkan):</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_NOTE_SUGGESTIONS.map((tag) => {
              const isSelected = notes.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddQuickTag(tag)}
                  className={`px-2.5 py-1 rounded-xl text-xs transition flex items-center gap-1 ${
                    isSelected
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-semibold'
                      : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 hover:border-neutral-600'
                  }`}
                >
                  <Plus className="h-2.5 w-2.5" />
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Free Text Area */}
        <div>
          <div className="relative">
            <div className="pointer-events-none absolute top-3 left-3.5 text-neutral-500">
              <FileText className="h-4 w-4" />
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Tuliskan catatan kondisi awal (misal baret halus pada pintu, jamur kaca, atau aroma parfum yang diminta)..."
              className="w-full rounded-2xl bg-neutral-800/80 border border-neutral-700/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Catatan ini akan dicetak di struk 80mm dan disertakan pada ringkasan WhatsApp pelanggan sebagai transparansi inspeksi.
          </p>
        </div>

        {/* Petugas Teknisi / Detailer */}
        <div>
          <label
            htmlFor="tech_select"
            className="block text-xs font-medium text-neutral-300 mb-1.5"
          >
            Petugas Teknisi / Detailer yang bertugas
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
              <UserCheck className="h-4 w-4" />
            </div>
            <select
              id="tech_select"
              value={technicianName}
              onChange={(e) => onTechnicianChange(e.target.value)}
              className="w-full rounded-2xl bg-neutral-800/80 border border-neutral-700/80 pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            >
              {TECHNICIANS.map((tech) => (
                <option key={tech} value={tech} className="bg-neutral-900 text-white">
                  {tech}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
};
