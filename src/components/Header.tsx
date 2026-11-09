import React from 'react';
import { Sparkles, Droplets } from 'lucide-react';
import { formatRupiah } from '../utils/pos';
import { PuffLogo } from './PuffLogo';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  todayCount: number;
  todayRevenue: number;
  averageTds?: number;
}

export const Header: React.FC<HeaderProps> = ({
  todayCount,
  todayRevenue,
  averageTds = 15,
}) => {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00b4d8] via-[#0096c7] to-[#023e8a] p-5 md:p-6 text-white shadow-xl shadow-cyan-950/20 border border-cyan-400/20">
      {/* Background glow effects */}
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-cyan-300/20 blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-blue-400/20 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-start justify-between">
          <PuffLogo variant="full" />
        </div>

        {/* Right side stats pill cards */}
        <div className="flex items-center gap-3">
          {/* Car illustration badge on desktop */}
          <div className="hidden md:flex items-center justify-center h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-inner">
            <span className="text-4xl" role="img" aria-label="Mobil merah">
              🚗
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 flex-1 md:flex-none">
            {/* Transaksi Hari Ini */}
            <div className="rounded-2xl bg-black/20 backdrop-blur-md p-3 border border-white/15 min-w-[130px]">
              <span className="block text-[11px] font-medium text-cyan-100/90">
                Transaksi hari ini
              </span>
              <span className="block text-xl md:text-2xl font-black text-white mt-0.5">
                {todayCount}
              </span>
            </div>

            {/* Pendapatan Hari Ini */}
            <div className="rounded-2xl bg-black/20 backdrop-blur-md p-3 border border-white/15 min-w-[145px]">
              <span className="block text-[11px] font-medium text-cyan-100/90">
                Pendapatan hari ini
              </span>
              <span className="block text-xl md:text-2xl font-black text-white mt-0.5 truncate">
                {formatRupiah(todayRevenue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Water quality badge banner & PWA Install */}
      <div className="mt-3.5 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs text-cyan-100">
        <div className="flex items-center gap-1.5">
          <Droplets className="h-3.5 w-3.5 text-cyan-200" />
          <span>Spot-Free Water Quality Certified:</span>
          <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
            Avg {averageTds} ppm · pH 7.0 Netral
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[11px] text-cyan-100/80">
            Air RO Demineralisasi
          </span>
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
