import React from 'react';
import { PlusCircle, History, BarChart3 } from 'lucide-react';

export type ActiveTab = 'new_transaction' | 'history' | 'sales_report';

interface NavigationTabsProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav className="flex items-center gap-2 p-1.5 bg-neutral-900/90 backdrop-blur-md rounded-2xl border border-neutral-800 shadow-md">
      {/* + Transaksi button matching reference image */}
      <button
        type="button"
        onClick={() => onTabChange('new_transaction')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
          activeTab === 'new_transaction'
            ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/25'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
        }`}
      >
        <PlusCircle className="h-4 w-4 shrink-0" />
        <span>+ Transaksi</span>
      </button>

      {/* Riwayat button matching reference image */}
      <button
        type="button"
        onClick={() => onTabChange('history')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
          activeTab === 'history'
            ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/25'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
        }`}
      >
        <History className="h-4 w-4 shrink-0" />
        <span>Riwayat</span>
      </button>

      {/* Laporan Penjualan button for the new reporting feature */}
      <button
        type="button"
        onClick={() => onTabChange('sales_report')}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap ${
          activeTab === 'sales_report'
            ? 'bg-cyan-500 text-neutral-950 shadow-md shadow-cyan-500/25'
            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
        }`}
      >
        <BarChart3 className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Laporan Penjualan</span>
        <span className="sm:hidden">Laporan</span>
      </button>
    </nav>
  );
};
