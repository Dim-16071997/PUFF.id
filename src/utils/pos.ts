import {
  BestSellingItem,
  ReportPeriod,
  SalesReportSummary,
  SelectedService,
  Transaction,
  WaterQualityCheck,
} from '../types/pos';

/**
 * Format numeric amount to Indonesian Rupiah (e.g. Rp75.000)
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp0';
  return 'Rp' + Math.round(amount).toLocaleString('id-ID');
}

/**
 * Calculate subtotal from selected services
 */
export function calculateSubtotal(services: SelectedService[]): number {
  return services.reduce((acc, curr) => acc + (curr.price || 0), 0);
}

/**
 * Calculate grand total after discount
 */
export function calculateTotal(subtotal: number, discount: number = 0): number {
  const safeDiscount = Math.max(0, discount);
  return Math.max(0, subtotal - safeDiscount);
}

/**
 * Evaluate water quality based on TDS (ppm) and pH.
 * Puff.id standard:
 * - TDS < 50 ppm: Pure / Spot-Free Rinse (Leaves no mineral marks on vehicle surface)
 * - TDS 50 - 100 ppm: Good / Filtered
 * - TDS > 100 ppm: Caution (Risk of water spotting)
 * - pH 6.5 - 7.5: Neutral & Safe for paint & coating
 */
export function evaluateWaterQuality(
  tdsPpm: number,
  ph: number,
  temperatureC: number = 27
): WaterQualityCheck {
  const safeTds = Number(tdsPpm) || 0;
  const safePh = Number(ph) || 7.0;

  let qualityLevel: 'optimal' | 'good' | 'caution' = 'optimal';
  let statusText = 'Optimal - Bebas Bercak (Spot-Free Certified)';

  if (safeTds <= 50 && safePh >= 6.5 && safePh <= 7.5) {
    qualityLevel = 'optimal';
    statusText = '✨ Sangat Murni & Spot-Free (Aman Cat & Coating)';
  } else if (safeTds <= 120 && safePh >= 6.0 && safePh <= 8.0) {
    qualityLevel = 'good';
    statusText = '💧 Baik & Terfilter (Standar Cuci Berkualitas)';
  } else {
    qualityLevel = 'caution';
    statusText = '⚠️ Perlu Perhatian Filter (Potensi Water Spotting)';
  }

  return {
    tdsPpm: safeTds,
    ph: Number(safePh.toFixed(1)),
    temperatureC,
    sourceNote: 'Air Purifikasi Reverse Osmosis & Deionisasi Puff.id',
    statusText,
    qualityLevel,
  };
}

/**
 * Generate human-readable receipt number
 * Format: PUFF-YYYYMMDD-XXXX
 */
export function generateReceiptNumber(date: Date = new Date(), index: number = 1): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const padIndex = String(index).padStart(3, '0');
  return `PUFF-${year}${month}${day}-${padIndex}`;
}

/**
 * Filter transactions based on period (daily, weekly, monthly, all)
 */
export function filterTransactionsByPeriod(
  transactions: Transaction[],
  period: ReportPeriod,
  referenceDate: Date = new Date()
): Transaction[] {
  const ref = new Date(referenceDate);

  return transactions.filter((tx) => {
    const txDate = new Date(tx.createdAt);
    if (isNaN(txDate.getTime())) return false;

    if (period === 'all') return true;

    if (period === 'daily') {
      return (
        txDate.getFullYear() === ref.getFullYear() &&
        txDate.getMonth() === ref.getMonth() &&
        txDate.getDate() === ref.getDate()
      );
    }

    if (period === 'weekly') {
      // 7 days window up to the reference date
      const startOfWeek = new Date(ref);
      startOfWeek.setDate(ref.getDate() - 6);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(ref);
      endOfWeek.setHours(23, 59, 59, 999);

      return txDate >= startOfWeek && txDate <= endOfWeek;
    }

    if (period === 'monthly') {
      return (
        txDate.getFullYear() === ref.getFullYear() &&
        txDate.getMonth() === ref.getMonth()
      );
    }

    return true;
  });
}

/**
 * Aggregate sales report metrics for the selected transactions
 */
export function calculateSalesReport(
  transactions: Transaction[],
  period: ReportPeriod = 'daily',
  referenceDate: Date = new Date()
): SalesReportSummary {
  const filtered = filterTransactionsByPeriod(transactions, period, referenceDate);
  const activeTx = filtered.filter((t) => t.status !== 'cancelled');

  const totalRevenue = activeTx.reduce((sum, t) => sum + (t.total || 0), 0);
  const totalTransactions = activeTx.length;
  const averageOrderValue = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;

  // Best-selling items breakdown
  const itemMap = new Map<string, { count: number; revenue: number }>();
  activeTx.forEach((tx) => {
    tx.services.forEach((s) => {
      const existing = itemMap.get(s.name) || { count: 0, revenue: 0 };
      itemMap.set(s.name, {
        count: existing.count + 1,
        revenue: existing.revenue + (s.price || 0),
      });
    });
  });

  const totalItemCount = Array.from(itemMap.values()).reduce((sum, item) => sum + item.count, 0);

  const bestSellingItems: BestSellingItem[] = Array.from(itemMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
      percentage: totalItemCount > 0 ? Math.round((data.count / totalItemCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count || b.revenue - a.revenue);

  // Water Quality stats
  let totalTds = 0;
  let totalPh = 0;
  let optimalCount = 0;
  let goodCount = 0;
  let cautionCount = 0;

  activeTx.forEach((tx) => {
    if (tx.waterQuality) {
      totalTds += tx.waterQuality.tdsPpm || 0;
      totalPh += tx.waterQuality.ph || 0;
      if (tx.waterQuality.qualityLevel === 'optimal') optimalCount++;
      else if (tx.waterQuality.qualityLevel === 'good') goodCount++;
      else cautionCount++;
    }
  });

  const averageTds = totalTransactions > 0 ? Math.round(totalTds / totalTransactions) : 0;
  const averagePh = totalTransactions > 0 ? Number((totalPh / totalTransactions).toFixed(1)) : 0;

  let startDate = '';
  let endDate = '';
  const ref = new Date(referenceDate);

  if (period === 'daily') {
    startDate = ref.toLocaleDateString('id-ID', { dateStyle: 'long' });
    endDate = startDate;
  } else if (period === 'weekly') {
    const start = new Date(ref);
    start.setDate(ref.getDate() - 6);
    startDate = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    endDate = ref.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } else if (period === 'monthly') {
    startDate = ref.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    endDate = startDate;
  } else {
    startDate = 'Awal Transaksi';
    endDate = 'Sekarang';
  }

  return {
    period,
    startDate,
    endDate,
    totalRevenue,
    totalTransactions,
    averageOrderValue,
    bestSellingItems,
    waterQualityStats: {
      averageTds,
      averagePh,
      optimalCount,
      goodCount,
      cautionCount,
    },
    transactions: filtered,
  };
}

/**
 * Generate formatted WhatsApp receipt text ready to send
 */
export function generateWhatsAppText(tx: Transaction): string {
  const dateObj = new Date(tx.createdAt);
  const dateStr = !isNaN(dateObj.getTime())
    ? `${dateObj.toLocaleDateString('id-ID', { dateStyle: 'full' })} ${dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
    : new Date().toLocaleDateString('id-ID');

  const servicesList = tx.services
    .map((s) => `• ${s.name}: ${formatRupiah(s.price)}`)
    .join('\n');

  const paymentLabel: Record<string, string> = {
    qris: 'QRIS Puff.id',
    cash: 'Tunai (Cash)',
    transfer_bca: 'Transfer BCA',
    transfer_mandiri: 'Transfer Mandiri',
    ewallet: 'E-Wallet',
  };

  return `*PUFF.ID MOBILE CAR WASH & CARE*
_We come, we clean, you shine._
--------------------------------
🧾 *STRUK PEMBAYARAN DIGITAL*
No. Nota: ${tx.receiptNumber}
Waktu: ${dateStr}

👤 *DATA PELANGGAN*
Nama: ${tx.customer.name}
Kendaraan: ${tx.customer.vehicleType}
Plat Nomor: ${tx.customer.plateNumber}
No. HP: ${tx.customer.phone || '-'}

✨ *LAYANAN & PERAWATAN*
${servicesList}

Subtotal: ${formatRupiah(tx.subtotal)}${
    tx.discount > 0 ? `\nDiskon: -${formatRupiah(tx.discount)}` : ''
  }
*TOTAL: ${formatRupiah(tx.total)}*
Metode Bayar: ${paymentLabel[tx.paymentMethod] || tx.paymentMethod}

💧 *HASIL WATER QUALITY CHECK*
TDS Air: ${tx.waterQuality.tdsPpm} ppm (Standar Spot-Free <50 ppm)
pH Air: ${tx.waterQuality.ph} (Netral & Aman Cat/Coating)
Status: ${tx.waterQuality.statusText}
_Garansi air terpurifikasi murni bebas bercak kerak kalsium._

📝 *CATATAN KENDARAAN:*
${tx.additionalNotes || 'Pemeriksaan standar selesai, unit bersih berkilau.'}
Petugas Teknisi: ${tx.technicianName || 'Tim Puff.id'}

--------------------------------
Terima kasih telah mempercayakan kendaraan Anda kepada PUFF.id!
Follow IG: @puff.id.carwash`;
}

/**
 * Generate CSV content for transactions
 */
export function generateTransactionsCsv(transactions: Transaction[]): string {
  const headers = [
    'No. Nota',
    'Tanggal/Waktu',
    'Pelanggan',
    'Kendaraan',
    'No. Polisi',
    'No. HP',
    'Layanan',
    'Total (Rp)',
    'Metode Bayar',
    'TDS Air (ppm)',
    'pH Air',
    'Status Kualitas Air',
    'Catatan Tambahan',
    'Teknisi',
  ];

  const rows = transactions.map((tx) => [
    `"${tx.receiptNumber}"`,
    `"${new Date(tx.createdAt).toLocaleString('id-ID')}"`,
    `"${tx.customer.name.replace(/"/g, '""')}"`,
    `"${tx.customer.vehicleType.replace(/"/g, '""')}"`,
    `"${tx.customer.plateNumber.replace(/"/g, '""')}"`,
    `"${tx.customer.phone || '-'}"`,
    `"${tx.services.map((s) => s.name).join('; ')}"`,
    tx.total,
    `"${tx.paymentMethod}"`,
    tx.waterQuality.tdsPpm,
    tx.waterQuality.ph,
    `"${tx.waterQuality.qualityLevel}"`,
    `"${(tx.additionalNotes || '-').replace(/"/g, '""')}"`,
    `"${(tx.technicianName || '-').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
