import React from 'react';
import { Droplets, ShieldCheck, AlertCircle, Info, Sparkles } from 'lucide-react';
import { WaterQualityCheck } from '../types/pos';
import { evaluateWaterQuality } from '../utils/pos';

interface WaterQualitySectionProps {
  value: WaterQualityCheck;
  onChange: (updated: WaterQualityCheck) => void;
}

export const WaterQualitySection: React.FC<WaterQualitySectionProps> = ({
  value,
  onChange,
}) => {
  const handleTdsChange = (newTds: number) => {
    const updated = evaluateWaterQuality(newTds, value.ph, value.temperatureC);
    onChange(updated);
  };

  const handlePhChange = (newPh: number) => {
    const updated = evaluateWaterQuality(value.tdsPpm, newPh, value.temperatureC);
    onChange(updated);
  };

  const handlePresetSelect = (tds: number, ph: number) => {
    const updated = evaluateWaterQuality(tds, ph, value.temperatureC);
    onChange(updated);
  };

  const getBadgeStyle = () => {
    if (value.qualityLevel === 'optimal') {
      return {
        bg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300',
        icon: <ShieldCheck className="h-4 w-4 text-emerald-400" />,
        label: 'Optimal & Spot-Free Certified',
      };
    }
    if (value.qualityLevel === 'good') {
      return {
        bg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300',
        icon: <Droplets className="h-4 w-4 text-cyan-400" />,
        label: 'Baik & Terfilter',
      };
    }
    return {
      bg: 'bg-amber-950/80 border-amber-500/50 text-amber-300',
      icon: <AlertCircle className="h-4 w-4 text-amber-400" />,
      label: 'Perhatian Filter Diperlukan',
    };
  };

  const badge = getBadgeStyle();

  return (
    <section className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-neutral-800 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
            03
          </span>
          <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
            Hasil Water Quality Check
          </h2>
        </div>

        {/* Current status certification badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
        >
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-neutral-800/90 to-neutral-850 p-4 rounded-2xl border border-neutral-700/60 mb-4">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-xs text-neutral-300 leading-relaxed">
            <strong className="text-cyan-300">Standar Air Puff.id:</strong> Kami selalu memeriksa TDS (Total Dissolved Solids) &amp; pH air secara berkala. Air demineralisasi (<strong className="text-white">&lt;50 ppm</strong>) &amp; pH netral (<strong className="text-white">6.5 - 7.5</strong>) menjamin bilasan tanpa kerak mineral putih (spot-free) serta 100% aman untuk cat mobil ber-coating.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* TDS (ppm) Input Card */}
        <div className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700/70">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="tds_input"
              className="text-xs font-bold text-neutral-200 flex items-center gap-1.5"
            >
              <Droplets className="h-3.5 w-3.5 text-cyan-400" />
              <span>Nilai TDS (Kandungan Mineral)</span>
            </label>
            <span className="text-[11px] text-cyan-400 font-mono font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
              {value.tdsPpm} ppm
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <input
              id="tds_input"
              type="number"
              min="0"
              max="500"
              value={value.tdsPpm}
              onChange={(e) => handleTdsChange(Number(e.target.value) || 0)}
              className="w-24 rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-1.5 text-base font-black text-cyan-400 focus:outline-none focus:border-cyan-400"
            />
            <span className="text-xs text-neutral-400">ppm (parts per million)</span>
          </div>

          {/* Preset Buttons for Quick Entry */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-neutral-500">Preset:</span>
            {[12, 18, 25, 45, 80].map((ppm) => (
              <button
                key={ppm}
                type="button"
                onClick={() => handleTdsChange(ppm)}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium transition ${
                  value.tdsPpm === ppm
                    ? 'bg-cyan-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
                }`}
              >
                {ppm} ppm
              </button>
            ))}
          </div>

          <p className="text-[11px] text-neutral-400 mt-2">
            {value.tdsPpm <= 50 ? (
              <span className="text-emerald-400 font-medium">✓ Bebas mineral kerak (Ultra Spot-Free)</span>
            ) : value.tdsPpm <= 120 ? (
              <span className="text-cyan-400 font-medium">✓ Air terfilter standar bersih</span>
            ) : (
              <span className="text-amber-400 font-medium">⚠️ Di atas 120 ppm (Periksa filter)</span>
            )}
          </p>
        </div>

        {/* pH Level Input Card */}
        <div className="bg-neutral-800/60 p-4 rounded-2xl border border-neutral-700/70">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="ph_input"
              className="text-xs font-bold text-neutral-200 flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Nilai pH (Tingkat Keasaman)</span>
            </label>
            <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
              pH {value.ph}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <input
              id="ph_input"
              type="number"
              step="0.1"
              min="4"
              max="10"
              value={value.ph}
              onChange={(e) => handlePhChange(parseFloat(e.target.value) || 7.0)}
              className="w-24 rounded-xl bg-neutral-900 border border-neutral-700 px-3 py-1.5 text-base font-black text-emerald-400 focus:outline-none focus:border-cyan-400"
            />
            <span className="text-xs text-neutral-400">Netral (6.8 - 7.2)</span>
          </div>

          {/* Quick pH presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-neutral-500">Preset:</span>
            {[6.8, 7.0, 7.2, 7.4].map((phVal) => (
              <button
                key={phVal}
                type="button"
                onClick={() => handlePhChange(phVal)}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium transition ${
                  value.ph === phVal
                    ? 'bg-emerald-500 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
                }`}
              >
                pH {phVal}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-neutral-400 mt-2">
            {value.ph >= 6.5 && value.ph <= 7.5 ? (
              <span className="text-emerald-400 font-medium">✓ pH Netral - Tidak mengikis lapisan wax &amp; coating</span>
            ) : (
              <span className="text-amber-400 font-medium">⚠️ pH Non-Netral</span>
            )}
          </p>
        </div>
      </div>

      {/* Summary Note to be printed on receipt */}
      <div className="mt-3.5 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
        <span>Keterangan pada struk: <strong className="text-cyan-300">{value.statusText}</strong></span>
        <button
          type="button"
          onClick={() => handlePresetSelect(14, 7.0)}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 underline"
        >
          Reset ke Standar Lab Puff.id
        </button>
      </div>
    </section>
  );
};
