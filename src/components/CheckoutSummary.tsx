import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Banknote,
  Building2,
  Wallet,
  Receipt,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { PaymentMethod, SelectedService } from '../types/pos';
import { calculateSubtotal, calculateTotal, formatRupiah } from '../utils/pos';

interface CheckoutSummaryProps {
  services: SelectedService[];
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  discount: number;
  discountCode?: string;
  onApplyDiscount: (code: string, amount: number) => void;
  onClearDiscount: () => void;
  cashGiven: number;
  onCashGivenChange: (amount: number) => void;
  isFormValid: boolean;
  validationError?: string;
  onSubmitTransaction: () => void;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  services,
  paymentMethod,
  onPaymentMethodChange,
  discount,
  discountCode,
  onApplyDiscount,
  onClearDiscount,
  cashGiven,
  onCashGivenChange,
  isFormValid,
  validationError,
  onSubmitTransaction,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const subtotal = calculateSubtotal(services);
  const total = calculateTotal(subtotal, discount);
  const cashChange = Math.max(0, cashGiven - total);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoInput.trim().toUpperCase();
    if (clean === 'PUFFNEW10') {
      const disc = Math.round(subtotal * 0.1);
      onApplyDiscount(clean, disc);
      setPromoMessage('Promo Diskon 10% berhasil digunakan!');
    } else if (clean === 'JUMATBERSIH') {
      onApplyDiscount(clean, 15000);
      setPromoMessage('Promo Bersih Rp15.000 berhasil digunakan!');
    } else if (clean.startsWith('PUFF') || clean.length > 3) {
      onApplyDiscount(clean, 10000);
      setPromoMessage(`Voucher ${clean} potongan Rp10.000 aktif!`);
    } else {
      setPromoMessage('Kode promo tidak valid. Coba: PUFFNEW10');
    }
  };

  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'qris', label: 'QRIS', icon: <QrCode className="h-4 w-4" /> },
    { id: 'cash', label: 'Tunai (Cash)', icon: <Banknote className="h-4 w-4" /> },
    { id: 'transfer_bca', label: 'BCA', icon: <Building2 className="h-4 w-4" /> },
    { id: 'transfer_mandiri', label: 'Mandiri', icon: <Building2 className="h-4 w-4" /> },
    { id: 'ewallet', label: 'E-Wallet', icon: <Wallet className="h-4 w-4" /> },
  ];

  const quickCashOptions = [total, Math.ceil(total / 50000) * 50000, 100000, 200000].filter(
    (v, i, a) => v >= total && a.indexOf(v) === i
  );

  return (
    <section className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-neutral-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
            05
          </span>
          <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
            Kasir &amp; Pembayaran
          </h2>
        </div>
        <span className="text-xs text-neutral-400">Total &amp; Metode</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Metode Pembayaran */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {paymentMethods.map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onPaymentMethodChange(m.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border ${
                      isSelected
                        ? 'bg-cyan-500 text-neutral-950 border-cyan-400 shadow-md shadow-cyan-950/40'
                        : 'bg-neutral-800/80 text-neutral-300 border-neutral-700/80 hover:bg-neutral-750'
                    }`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Payment Details */}
          {paymentMethod === 'cash' && (
            <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/70 space-y-3">
              <div>
                <label
                  htmlFor="cash_input"
                  className="block text-xs font-medium text-neutral-300 mb-1"
                >
                  Uang Diterima dari Pelanggan
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs text-neutral-400 font-bold">
                    Rp
                  </span>
                  <input
                    id="cash_input"
                    type="number"
                    min="0"
                    step="5000"
                    value={cashGiven || ''}
                    onChange={(e) => onCashGivenChange(Number(e.target.value) || 0)}
                    placeholder={String(total)}
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 pl-9 pr-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-neutral-500">Uang Pas / Pecahan:</span>
                {quickCashOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onCashGivenChange(opt)}
                    className="px-2 py-1 rounded-lg text-xs bg-neutral-700/80 hover:bg-neutral-600 text-neutral-200 border border-neutral-600"
                  >
                    {formatRupiah(opt)}
                  </button>
                ))}
              </div>

              {cashGiven >= total && (
                <div className="flex items-center justify-between pt-2 border-t border-neutral-700 text-xs">
                  <span className="text-neutral-400">Kembalian:</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    {formatRupiah(cashChange)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* QRIS preview badge */}
          {paymentMethod === 'qris' && (
            <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-inner shrink-0">
                <QrCode className="h-10 w-10 text-neutral-950" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-cyan-300">QRIS Puff.id Siap Scan</p>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Dukung BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay.
                </p>
              </div>
            </div>
          )}

          {/* Transfer Bank Detail */}
          {(paymentMethod === 'transfer_bca' || paymentMethod === 'transfer_mandiri') && (
            <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/70 text-xs text-neutral-300 space-y-1">
              <p className="font-bold text-white">
                Rekening Resmi PUFF.id (
                {paymentMethod === 'transfer_bca' ? 'BCA' : 'Mandiri'}):
              </p>
              <p className="font-mono text-cyan-300 font-bold tracking-wider">
                {paymentMethod === 'transfer_bca' ? '8830-1234-9988' : '137-00-987654-1'}
              </p>
              <p className="text-[11px] text-neutral-400">a.n. PUFF INDONESIA BERKILAU PT</p>
            </div>
          )}
        </div>

        {/* Right Column: Billing Breakdown & Voucher */}
        <div className="flex flex-col justify-between space-y-4 bg-neutral-800/40 p-4 rounded-2xl border border-neutral-700/60">
          <div>
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="mb-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                    <Tag className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Kode promo (contoh: PUFFNEW10)"
                    className="w-full rounded-xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-1.5 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-xs font-bold text-white transition shrink-0"
                >
                  Terapkan
                </button>
              </div>

              {promoMessage && (
                <p className="text-[11px] text-cyan-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{promoMessage}</span>
                </p>
              )}

              {discountCode && (
                <div className="mt-2 flex items-center justify-between text-xs bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-lg">
                  <span className="text-cyan-300 font-medium">Voucher: {discountCode}</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearDiscount();
                      setPromoMessage(null);
                    }}
                    className="text-neutral-400 hover:text-red-400 text-[11px]"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-2 border-t border-neutral-700/60 pt-3 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal Layanan ({services.length} item)</span>
                <span className="font-medium text-white">{formatRupiah(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Diskon Promo</span>
                  <span className="font-bold">-{formatRupiah(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-neutral-700">
                <span>Total Bayar</span>
                <span className="text-cyan-400 text-lg font-black">{formatRupiah(total)}</span>
              </div>
            </div>
          </div>

          {/* Validation Error Hint */}
          {!isFormValid && validationError && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-950/50 border border-amber-800/40 text-amber-300 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            disabled={!isFormValid}
            onClick={onSubmitTransaction}
            className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 ${
              isFormValid
                ? 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-neutral-950 shadow-lg shadow-cyan-500/25 cursor-pointer active:scale-[0.99]'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
            }`}
          >
            <Receipt className="h-5 w-5" />
            <span>Selesaikan &amp; Cetak Struk (Thermal 80mm)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
