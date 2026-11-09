import React, { useState } from 'react';
import {
  Printer,
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  Phone,
  Sparkles,
  Droplets,
} from 'lucide-react';
import { Transaction } from '../types/pos';
import { formatRupiah, generateWhatsAppText } from '../utils/pos';
import { PuffLogo } from './PuffLogo';

interface ThermalReceiptModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onNewTransaction?: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
  onNewTransaction,
}) => {
  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState('');
  const [showPhoneEditor, setShowPhoneEditor] = useState(false);

  if (!isOpen || !transaction) return null;

  const dateObj = new Date(transaction.createdAt);
  const formattedDate = !isNaN(dateObj.getTime())
    ? `${dateObj.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })} ${dateObj.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    : '-';

  const paymentMethodLabels: Record<string, string> = {
    qris: 'QRIS Puff.id',
    cash: 'TUNAI (CASH)',
    transfer_bca: 'TRANSFER BANK BCA',
    transfer_mandiri: 'TRANSFER BANK MANDIRI',
    ewallet: 'E-WALLET',
  };

  // WhatsApp phone formatting (convert 08... to 628...)
  const getCleanPhone = (phoneRaw: string): string => {
    let clean = phoneRaw.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (clean.startsWith('8')) {
      clean = '628' + clean.slice(1);
    }
    return clean;
  };

  const targetPhone = customPhone || transaction.customer.phone || '';
  const cleanPhone = getCleanPhone(targetPhone);

  const handleSendWhatsApp = () => {
    const text = generateWhatsAppText(transaction);
    const encoded = encodeURIComponent(text);
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyText = async () => {
    const text = generateWhatsAppText(transaction);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt_modal_title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-neutral-900 rounded-3xl border border-neutral-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-900/90 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Printer className="h-4 w-4" />
            </span>
            <h3 id="receipt_modal_title" className="text-sm md:text-base font-bold text-white">
              Struk Thermal 80mm Puff.id
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Struk"
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-neutral-950/60">
          {/* Quick WhatsApp Action Bar */}
          <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-neutral-900 border border-emerald-600/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500 text-neutral-950 font-bold">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-emerald-300">
                  Kirim Struk via WhatsApp
                </p>
                <p className="text-[11px] text-neutral-300">
                  {targetPhone ? (
                    <span>Tujuan: <strong>{targetPhone}</strong></span>
                  ) : (
                    <span>Nomor HP belum diisi</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {!showPhoneEditor && (
                <button
                  type="button"
                  onClick={() => setShowPhoneEditor(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs border border-neutral-700"
                >
                  Ubah No
                </button>
              )}
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Kirim WA Sekarang</span>
              </button>
            </div>
          </div>

          {/* Optional phone editor drawer */}
          {showPhoneEditor && (
            <div className="mb-4 p-3 rounded-2xl bg-neutral-800/90 border border-neutral-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-neutral-400" />
              <input
                type="tel"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="Nomor WhatsApp (contoh: 08123456789)"
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => setShowPhoneEditor(false)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-neutral-950 text-xs font-bold"
              >
                Simpan
              </button>
            </div>
          )}

          {/* Actual Thermal 80mm Receipt Container (Printable) */}
          <div
            id="printable-thermal-receipt"
            className="w-full max-w-[340px] mx-auto bg-white text-neutral-900 p-5 rounded-md shadow-2xl font-mono text-[11px] leading-tight border border-neutral-300 print:border-none print:shadow-none print:w-full print:max-w-none print:p-0"
          >
            {/* Thermal Header with PuffLogo */}
            <div className="text-center pb-3 border-b-2 border-dashed border-neutral-800">
              <PuffLogo variant="receipt" className="mb-2" />
              <p className="text-[10px] font-bold tracking-widest text-neutral-800 uppercase mt-1">
                MOBILE CAR WASH &amp; CARE
              </p>
              <p className="text-[9px] text-neutral-600 mt-0.5">
                WhatsApp: 0812-PUFF-CARE (0812-7833-2273)
              </p>
            </div>

            {/* Receipt Meta */}
            <div className="py-2.5 border-b border-dashed border-neutral-400 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>No. Nota</span>
                <span className="font-bold">{transaction.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Petugas</span>
                <span>{transaction.technicianName || 'Tim Puff.id'}</span>
              </div>
            </div>

            {/* Customer & Vehicle Info */}
            <div className="py-2.5 border-b border-dashed border-neutral-400 space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <span className="font-bold">{transaction.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Kendaraan:</span>
                <span className="font-bold">{transaction.customer.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span>No. Polisi:</span>
                <span className="font-bold text-[11px] uppercase tracking-wider">
                  [{transaction.customer.plateNumber}]
                </span>
              </div>
              {transaction.customer.phone && (
                <div className="flex justify-between">
                  <span>No. HP:</span>
                  <span>{transaction.customer.phone}</span>
                </div>
              )}
            </div>

            {/* Services List */}
            <div className="py-2.5 border-b border-dashed border-neutral-400 space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">
                Layanan &amp; Perawatan:
              </div>
              {transaction.services.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-2">
                  <span className="flex-1 font-semibold">{item.name}</span>
                  <span className="font-bold text-right shrink-0">
                    {formatRupiah(item.price)}
                  </span>
                </div>
              ))}
            </div>

            {/* WATER QUALITY CHECK SECTION (Prominent feature) */}
            <div className="py-2.5 border-b-2 border-dashed border-neutral-800 bg-neutral-100 p-2 my-2 rounded text-[10px] space-y-1">
              <div className="font-extrabold uppercase text-neutral-900 flex items-center justify-between border-b border-neutral-300 pb-1">
                <span>★ WATER QUALITY CHECK:</span>
                <span className="text-[9px] bg-neutral-800 text-white px-1.5 py-0.2 rounded font-bold">
                  SPOT-FREE
                </span>
              </div>
              <div className="flex justify-between">
                <span>Nilai TDS Air:</span>
                <span className="font-bold">
                  {transaction.waterQuality.tdsPpm} ppm (Std &lt;50)
                </span>
              </div>
              <div className="flex justify-between">
                <span>Nilai pH Air:</span>
                <span className="font-bold">
                  {transaction.waterQuality.ph} (Netral 6.8-7.2)
                </span>
              </div>
              <div className="text-[9px] text-neutral-700 italic pt-0.5">
                Status: {transaction.waterQuality.statusText}
              </div>
              <div className="text-[8px] text-neutral-500 leading-tight">
                *Air terpurifikasi demineralisasi bebas kerak mineral kalsium, aman untuk cat nano coating &amp; kaca.
              </div>
            </div>

            {/* Catatan Tambahan */}
            {transaction.additionalNotes && (
              <div className="py-2 border-b border-dashed border-neutral-400 text-[10px] space-y-0.5">
                <span className="font-bold text-neutral-800">Catatan Kondisi Kendaraan:</span>
                <p className="text-neutral-700 italic">{transaction.additionalNotes}</p>
              </div>
            )}

            {/* Totals & Payment */}
            <div className="py-2.5 border-b-2 border-dashed border-neutral-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatRupiah(transaction.subtotal)}</span>
              </div>

              {transaction.discount > 0 && (
                <div className="flex justify-between text-neutral-700">
                  <span>Diskon {transaction.discountCode ? `(${transaction.discountCode})` : ''}:</span>
                  <span>-{formatRupiah(transaction.discount)}</span>
                </div>
              )}

              <div className="flex justify-between font-black text-sm pt-1 border-t border-neutral-300">
                <span>TOTAL:</span>
                <span>{formatRupiah(transaction.total)}</span>
              </div>

              <div className="flex justify-between text-[10px] pt-1">
                <span>Metode Bayar:</span>
                <span className="font-bold uppercase">
                  {paymentMethodLabels[transaction.paymentMethod] || transaction.paymentMethod}
                </span>
              </div>

              {transaction.paymentMethod === 'cash' && transaction.cashGiven && (
                <>
                  <div className="flex justify-between text-[10px]">
                    <span>Tunai Diterima:</span>
                    <span>{formatRupiah(transaction.cashGiven)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Kembalian:</span>
                    <span>{formatRupiah(transaction.cashChange || 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Thermal Footer */}
            <div className="text-center pt-3 text-[9px] text-neutral-600 space-y-1">
              <p className="font-bold text-neutral-800">
                TERIMA KASIH ATAS KUNJUNGAN ANDA!
              </p>
              <p className="leading-tight">
                *Garansi cuci ulang 24 jam jika terkena hujan dalam perjalanan (syarat: simpan struk ini).
              </p>
              <p className="font-mono text-[8px] text-neutral-500 pt-1">
                IG: @puff.id.carwash · www.puff.id
              </p>
              <div className="pt-2 font-mono text-[8px] text-neutral-400">
                ================================
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Controls */}
        <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 border border-neutral-700 transition"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-1.5 border border-neutral-700 transition"
            >
              <Printer className="h-4 w-4 text-cyan-400" />
              <span>Cetak 80mm</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onNewTransaction && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNewTransaction();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-black shadow-md shadow-cyan-500/20 transition active:scale-95"
              >
                + Transaksi Baru
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white text-xs font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
