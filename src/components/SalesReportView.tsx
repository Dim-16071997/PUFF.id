import React, { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  Receipt,
  Droplets,
  DollarSign,
  Award,
  Download,
  Printer,
  FileSpreadsheet,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ReportPeriod, Transaction } from '../types/pos';
import { calculateSalesReport, formatRupiah, generateTransactionsCsv } from '../utils/pos';

interface SalesReportViewProps {
  transactions: Transaction[];
  onViewReceipt: (transaction: Transaction) => void;
  onSendWhatsApp: (transaction: Transaction) => void;
}

export const SalesReportView: React.FC<SalesReportViewProps> = ({
  transactions,
  onViewReceipt,
  onSendWhatsApp,
}) => {
  const [period, setPeriod] = useState<ReportPeriod>('daily');

  const report = calculateSalesReport(transactions, period);

  const handleDownloadCsv = () => {
    const csvContent = generateTransactionsCsv(report.transactions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Penjualan_PUFF_ID_${period}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const periodOptions: { id: ReportPeriod; label: string; desc: string }[] = [
    { id: 'daily', label: 'Harian (Hari Ini)', desc: 'Penjualan per hari ini' },
    { id: 'weekly', label: 'Mingguan (7 Hari)', desc: 'Performa 7 hari terakhir' },
    { id: 'monthly', label: 'Bulanan (Bulan Ini)', desc: 'Akumulasi bulan berjalan' },
    { id: 'all', label: 'Semua Periode', desc: 'Seluruh riwayat transaksi' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-neutral-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <TrendingUp className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Laporan Penjualan Puff.id
                </h2>
                <p className="text-xs text-neutral-400">
                  Periode Aktif: <strong className="text-cyan-300">{report.startDate}</strong>
                  {report.startDate !== report.endDate && (
                    <span> s/d <strong className="text-cyan-300">{report.endDate}</strong></span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Export and Print Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 border border-neutral-700 transition"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 border border-cyan-500/40 transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* Period Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-neutral-800">
          {periodOptions.map((opt) => {
            const isSelected = period === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPeriod(opt.id)}
                className={`p-3 rounded-2xl text-left border transition ${
                  isSelected
                    ? 'bg-cyan-500 text-neutral-950 border-cyan-400 shadow-md shadow-cyan-950/40'
                    : 'bg-neutral-800/60 text-neutral-300 border-neutral-700/60 hover:bg-neutral-800'
                }`}
              >
                <span className="block text-xs font-extrabold">{opt.label}</span>
                <span
                  className={`block text-[10px] mt-0.5 ${
                    isSelected ? 'text-neutral-900 font-medium' : 'text-neutral-400'
                  }`}
                >
                  {opt.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pendapatan */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-850 p-5 rounded-3xl border border-neutral-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Total Pendapatan</span>
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white tracking-tight">
            {formatRupiah(report.totalRevenue)}
          </p>
          <p className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
            <span>Omset bersih periode terpilih</span>
          </p>
        </div>

        {/* Jumlah Transaksi */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-850 p-5 rounded-3xl border border-neutral-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Jumlah Transaksi</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Receipt className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white tracking-tight">
            {report.totalTransactions} <span className="text-sm font-semibold text-neutral-400">kendaraan</span>
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            Unit cuci selesai dikerjakan
          </p>
        </div>

        {/* Rata-rata per Transaksi */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-850 p-5 rounded-3xl border border-neutral-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Rata-rata Order (AOV)</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-white tracking-tight">
            {formatRupiah(report.averageOrderValue)}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">
            Rata-rata belanja per pelanggan
          </p>
        </div>

        {/* Rata-rata Kualitas Air TDS */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-850 p-5 rounded-3xl border border-neutral-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Rata-rata TDS Air</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Droplets className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-400 tracking-tight">
            {report.waterQualityStats.averageTds}{' '}
            <span className="text-sm font-semibold text-neutral-400">ppm</span>
          </p>
          <p className="text-[11px] text-emerald-300/90 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Optimal (&lt;50 ppm Spot-Free)</span>
          </p>
        </div>
      </div>

      {/* Grid: Item Terlaris & Ringkasan Water Quality Check */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Item Terlaris (Best Selling Services) */}
        <div className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-neutral-800 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-white tracking-wide">
                Layanan &amp; Item Terlaris
              </h3>
            </div>
            <span className="text-xs text-neutral-400">Paling Diminati</span>
          </div>

          {report.bestSellingItems.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              Belum ada data penjualan pada periode ini.
            </div>
          ) : (
            <div className="space-y-3.5">
              {report.bestSellingItems.map((item, idx) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-black ${
                          idx === 0
                            ? 'bg-amber-400 text-neutral-950 font-black'
                            : idx === 1
                            ? 'bg-neutral-300 text-neutral-950'
                            : idx === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white">{item.count}x</span>
                      <span className="text-neutral-400 ml-2">
                        ({formatRupiah(item.revenue)})
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                          : idx === 1
                          ? 'bg-gradient-to-r from-cyan-400 to-cyan-500'
                          : 'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      style={{ width: `${Math.max(item.percentage, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ringkasan Water Quality Check */}
        <div className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-neutral-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  Ringkasan Water Quality Check
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
                100% Spot-Free
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Puff.id konsisten mengontrol kualitas air demineralisasi agar bilasan tidak meninggalkan residu kapur/mineral pada bodi dan kaca mobil pelanggan.
            </p>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
                <span className="text-[11px] text-neutral-400 block">Rata-rata TDS Air</span>
                <span className="text-xl font-black text-cyan-300 block mt-0.5">
                  {report.waterQualityStats.averageTds || 15} ppm
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  Standar Murni: &lt;50 ppm
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
                <span className="text-[11px] text-neutral-400 block">Rata-rata pH Air</span>
                <span className="text-xl font-black text-emerald-300 block mt-0.5">
                  pH {report.waterQualityStats.averagePh || 7.0}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">
                  Standar Netral: 6.8 - 7.2
                </span>
              </div>
            </div>

            {/* Quality Distribution */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Sangat Murni / Optimal (Spot-Free)</span>
                </span>
                <span className="font-bold text-white">
                  {report.waterQualityStats.optimalCount} cuci
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span>Baik &amp; Terfilter</span>
                </span>
                <span className="font-bold text-white">
                  {report.waterQualityStats.goodCount} cuci
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>Perlu Perhatian Filter</span>
                </span>
                <span className="font-bold text-white">
                  {report.waterQualityStats.cautionCount} cuci
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400">
            Jaminan Puff.id: Bebas bintik kerak air mineral (Spot-Free Guaranteed).
          </div>
        </div>
      </div>

      {/* Rincian Transaksi Lengkap dalam Periode */}
      <div className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-neutral-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Rincian Transaksi Periode ({report.transactions.length})
            </h3>
            <p className="text-xs text-neutral-400">
              Lengkap dengan rincian inspeksi kualitas air &amp; catatan kendaraan
            </p>
          </div>
        </div>

        {report.transactions.length === 0 ? (
          <div className="text-center py-10 text-neutral-500 text-xs">
            Tidak ada transaksi pada periode {period}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-800/80 text-[11px] uppercase tracking-wider text-neutral-400 border-b border-neutral-700">
                <tr>
                  <th className="py-3 px-3">No. Nota &amp; Waktu</th>
                  <th className="py-3 px-3">Pelanggan &amp; Plat</th>
                  <th className="py-3 px-3">Layanan</th>
                  <th className="py-3 px-3">Water Quality Check</th>
                  <th className="py-3 px-3">Catatan Kendaraan</th>
                  <th className="py-3 px-3 text-right">Total Bayar</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {report.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-neutral-850/50 transition">
                    {/* Nota & Waktu */}
                    <td className="py-3 px-3 align-top whitespace-nowrap">
                      <span className="font-mono font-bold text-white block">
                        {tx.receiptNumber}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">
                        {new Date(tx.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-[10px] text-cyan-400 font-medium uppercase mt-0.5 block">
                        {tx.paymentMethod}
                      </span>
                    </td>

                    {/* Pelanggan & Plat */}
                    <td className="py-3 px-3 align-top">
                      <span className="font-bold text-white block">{tx.customer.name}</span>
                      <span className="text-[11px] text-neutral-400 block">
                        {tx.customer.vehicleType}
                      </span>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-neutral-800 font-mono text-[10px] font-bold text-cyan-300 border border-neutral-700">
                        {tx.customer.plateNumber}
                      </span>
                    </td>

                    {/* Layanan */}
                    <td className="py-3 px-3 align-top max-w-[200px]">
                      <ul className="space-y-0.5">
                        {tx.services.map((s, idx) => (
                          <li key={idx} className="text-neutral-300 truncate">
                            • {s.name}
                          </li>
                        ))}
                      </ul>
                    </td>

                    {/* Water Quality Check */}
                    <td className="py-3 px-3 align-top whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-400 font-mono font-bold">
                          {tx.waterQuality.tdsPpm} ppm
                        </span>
                        <span className="text-neutral-500">|</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          pH {tx.waterQuality.ph}
                        </span>
                      </div>
                      <span
                        className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          tx.waterQuality.qualityLevel === 'optimal'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                            : 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                        }`}
                      >
                        {tx.waterQuality.qualityLevel === 'optimal'
                          ? '✨ Spot-Free'
                          : '💧 Terfilter'}
                      </span>
                    </td>

                    {/* Catatan Kendaraan */}
                    <td className="py-3 px-3 align-top max-w-[180px] text-[11px] text-neutral-400 italic">
                      {tx.additionalNotes || '-'}
                    </td>

                    {/* Total Bayar */}
                    <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                      <span className="font-black text-sm text-cyan-300 block">
                        {formatRupiah(tx.total)}
                      </span>
                      {tx.discount > 0 && (
                        <span className="text-[10px] text-emerald-400 block">
                          Hemat {formatRupiah(tx.discount)}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 align-top text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewReceipt(tx)}
                          aria-label={`Lihat Struk ${tx.receiptNumber}`}
                          className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-300 text-xs font-bold transition border border-neutral-700"
                        >
                          Struk
                        </button>
                        <button
                          type="button"
                          onClick={() => onSendWhatsApp(tx)}
                          aria-label={`Kirim WhatsApp ${tx.receiptNumber}`}
                          className="p-1 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/40 text-[#25D366] transition border border-[#25D366]/40"
                          title="Kirim ke WhatsApp"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
