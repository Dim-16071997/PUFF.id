import React, { useState } from 'react';
import {
  Search,
  Printer,
  Share2,
  Trash2,
  Filter,
  Download,
  Calendar,
  Car,
  Droplets,
  CreditCard,
  User,
} from 'lucide-react';
import { PaymentMethod, Transaction } from '../types/pos';
import { formatRupiah, generateTransactionsCsv } from '../utils/pos';

interface HistoryViewProps {
  transactions: Transaction[];
  onViewReceipt: (transaction: Transaction) => void;
  onSendWhatsApp: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  transactions,
  onViewReceipt,
  onSendWhatsApp,
  onDeleteTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  const filteredTransactions = transactions.filter((tx) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      tx.customer.name.toLowerCase().includes(q) ||
      tx.customer.plateNumber.toLowerCase().includes(q) ||
      tx.customer.vehicleType.toLowerCase().includes(q) ||
      tx.receiptNumber.toLowerCase().includes(q);

    const matchesMethod =
      selectedMethod === 'all' || tx.paymentMethod === selectedMethod;

    return matchesSearch && matchesMethod;
  });

  const handleDownloadCsv = () => {
    const csvContent = generateTransactionsCsv(filteredTransactions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Riwayat_Transaksi_PUFF_ID_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-5 border border-neutral-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-wide">
              Riwayat Transaksi
            </h2>
            <span className="text-xs text-neutral-400 bg-neutral-800 px-2.5 py-0.5 rounded-full border border-neutral-700">
              Total {filteredTransactions.length} dari {transactions.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="self-start md:self-auto px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 border border-neutral-700 transition"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama pelanggan, plat nomor (KT 1234 XX), atau nomor nota..."
              className="w-full rounded-2xl bg-neutral-800/80 border border-neutral-700/80 pl-10 pr-4 py-2 text-xs md:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Payment Method Filter */}
          <div className="relative">
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full rounded-2xl bg-neutral-800/80 border border-neutral-700/80 px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="all">Semua Metode Bayar</option>
              <option value="qris">QRIS</option>
              <option value="cash">Tunai (Cash)</option>
              <option value="transfer_bca">Transfer BCA</option>
              <option value="transfer_mandiri">Transfer Mandiri</option>
              <option value="ewallet">E-Wallet</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-neutral-900/60 rounded-3xl p-12 text-center border border-neutral-800 text-neutral-400">
          <p className="text-sm font-medium">Tidak ada transaksi yang cocok dengan pencarian.</p>
          <p className="text-xs text-neutral-500 mt-1">
            Gunakan tombol &quot;+ Transaksi&quot; untuk mencatat pelanggan baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredTransactions.map((tx) => {
            const dateObj = new Date(tx.createdAt);
            const dateStr = !isNaN(dateObj.getTime())
              ? dateObj.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-';

            return (
              <div
                key={tx.id}
                className="bg-neutral-900/90 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-neutral-800 hover:border-neutral-700 transition shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Customer and Vehicle Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-400">
                      {tx.receiptNumber}
                    </span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-xs text-neutral-400">{dateStr}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                      {tx.paymentMethod}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="text-sm md:text-base font-extrabold text-white">
                      {tx.customer.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-neutral-800 font-mono text-xs font-bold text-cyan-400 border border-neutral-700">
                      {tx.customer.plateNumber}
                    </span>
                    <span className="text-xs text-neutral-300">
                      ({tx.customer.vehicleType})
                    </span>
                  </div>

                  {/* Services summary */}
                  <div className="text-xs text-neutral-400 flex flex-wrap gap-1 items-center">
                    <span className="text-neutral-500">Layanan:</span>
                    {tx.services.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-neutral-800/80 text-neutral-300 px-2 py-0.5 rounded text-[11px]"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>

                  {/* Water Quality & Notes badge */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 text-[11px] bg-emerald-950/70 border border-emerald-800/40 text-emerald-300 px-2 py-0.5 rounded-full">
                      <Droplets className="h-3 w-3" />
                      <span>
                        Water Check: {tx.waterQuality.tdsPpm} ppm (pH {tx.waterQuality.ph})
                      </span>
                    </div>

                    {tx.additionalNotes && (
                      <span className="text-[11px] text-neutral-400 italic truncate max-w-xs">
                        Catatan: &ldquo;{tx.additionalNotes}&rdquo;
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Price & Quick Action Buttons */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-800 shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-neutral-400 block">Total Pembayaran</span>
                    <span className="text-lg md:text-xl font-black text-cyan-400 block">
                      {formatRupiah(tx.total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View/Print Receipt */}
                    <button
                      type="button"
                      onClick={() => onViewReceipt(tx)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-1.5 border border-neutral-700 transition"
                    >
                      <Printer className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Cetak Struk</span>
                    </button>

                    {/* Send WhatsApp */}
                    <button
                      type="button"
                      onClick={() => onSendWhatsApp(tx)}
                      className="p-1.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 transition"
                      title="Kirim Struk via WhatsApp"
                      aria-label={`Kirim WhatsApp ke ${tx.customer.name}`}
                    >
                      <Share2 className="h-4 w-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus transaksi ${tx.receiptNumber} (${tx.customer.name})?`)) {
                          onDeleteTransaction(tx.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-neutral-800 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-neutral-700 hover:border-red-800/40 transition"
                      title="Hapus Transaksi"
                      aria-label={`Hapus ${tx.receiptNumber}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
