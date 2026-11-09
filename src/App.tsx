import React, { useState, useEffect } from 'react';
import {
  CustomerData,
  PaymentMethod,
  SelectedService,
  ServiceItem,
  Transaction,
  VehicleCategory,
  WaterQualityCheck,
} from './types/pos';
import {
  calculateSubtotal,
  calculateTotal,
  evaluateWaterQuality,
  generateReceiptNumber,
  generateWhatsAppText,
} from './utils/pos';
import { getInitialSeedTransactions, TECHNICIANS } from './data/services';
import { Header } from './components/Header';
import { NavigationTabs, ActiveTab } from './components/NavigationTabs';
import { CustomerForm } from './components/CustomerForm';
import { ServiceSelector } from './components/ServiceSelector';
import { WaterQualitySection } from './components/WaterQualitySection';
import { NotesSection } from './components/NotesSection';
import { CheckoutSummary } from './components/CheckoutSummary';
import { ThermalReceiptModal } from './components/ThermalReceiptModal';
import { HistoryView } from './components/HistoryView';
import { SalesReportView } from './components/SalesReportView';
import { CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'puff_id_transactions_v1';

export default function App() {
  // Persistence state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return getInitialSeedTransactions();
  });

  // Active view tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('new_transaction');

  // Form State for New Transaction
  const [customer, setCustomer] = useState<CustomerData>({
    name: '',
    vehicleType: '',
    plateNumber: '',
    phone: '',
  });

  const [vehicleCategory, setVehicleCategory] = useState<VehicleCategory>('small');

  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([
    {
      serviceId: 'srv_wash_light',
      name: 'Cuci Eksterior + Interior Ringan',
      price: 65000,
      category: 'small',
    },
  ]);

  const [waterQuality, setWaterQuality] = useState<WaterQualityCheck>(() =>
    evaluateWaterQuality(14, 7.0, 26)
  );

  const [additionalNotes, setAdditionalNotes] = useState('');
  const [technicianName, setTechnicianName] = useState(TECHNICIANS[0]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [discount, setDiscount] = useState(0);
  const [discountCode, setDiscountCode] = useState<string | undefined>();
  const [cashGiven, setCashGiven] = useState(0);

  // Modal & Toast State
  const [activeReceiptTx, setActiveReceiptTx] = useState<Transaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [transactions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Calculate today's stats reactively
  const today = new Date();
  const todayTransactions = transactions.filter((t) => {
    if (t.status === 'cancelled') return false;
    const d = new Date(t.createdAt);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  const todayCount = todayTransactions.length;
  const todayRevenue = todayTransactions.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const averageTds =
    todayCount > 0
      ? Math.round(
          todayTransactions.reduce((acc, curr) => acc + curr.waterQuality.tdsPpm, 0) / todayCount
        )
      : 15;

  // Handlers for Customer Form
  const handleCustomerChange = (field: keyof CustomerData, val: string) => {
    setCustomer((prev) => ({ ...prev, [field]: val }));
  };

  const handleVehicleSelect = (vehicleName: string, category: VehicleCategory) => {
    setVehicleCategory(category);
    // Refresh prices for selected services based on new vehicle category multiplier
    const multiplier = category === 'large' ? 1.35 : category === 'medium' ? 1.15 : category === 'motor' ? 0.5 : 1.0;
    setSelectedServices((prev) =>
      prev.map((s) => ({
        ...s,
        price: Math.round((s.price * multiplier) / 5000) * 5000,
        category,
      }))
    );
  };

  // Handlers for Services
  const handleToggleService = (srv: ServiceItem, calculatedPrice: number) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.serviceId === srv.id);
      if (exists) {
        // Don't allow unselecting all if only 1 is selected
        if (prev.length === 1) {
          showToast('Pilih minimal satu layanan cuci');
          return prev;
        }
        return prev.filter((s) => s.serviceId !== srv.id);
      } else {
        return [
          ...prev,
          {
            serviceId: srv.id,
            name: srv.name,
            price: calculatedPrice,
            category: vehicleCategory,
          },
        ];
      }
    });
  };

  // Discount Handlers
  const handleApplyDiscount = (code: string, amount: number) => {
    setDiscount(amount);
    setDiscountCode(code);
    showToast(`Diskon Rp${amount.toLocaleString('id-ID')} berhasil diterapkan!`);
  };

  const handleClearDiscount = () => {
    setDiscount(0);
    setDiscountCode(undefined);
  };

  // Form Validation
  const hasName = Boolean(customer.name.trim());
  const hasVehicle = Boolean(customer.vehicleType.trim());
  const hasPlate = Boolean(customer.plateNumber.trim());
  const hasServices = selectedServices.length > 0;
  const isFormValid = hasName && hasVehicle && hasPlate && hasServices;

  let validationError = '';
  if (!hasName) validationError = 'Masukkan nama pelanggan';
  else if (!hasVehicle) validationError = 'Masukkan jenis kendaraan';
  else if (!hasPlate) validationError = 'Masukkan nomor polisi kendaraan';
  else if (!hasServices) validationError = 'Pilih minimal satu layanan cuci';

  // Submit Transaction Handler
  const handleSubmitTransaction = () => {
    if (!isFormValid) return;

    const subtotal = calculateSubtotal(selectedServices);
    const total = calculateTotal(subtotal, discount);

    const now = new Date();
    const newTxNumber = generateReceiptNumber(now, transactions.length + 1);

    const newTx: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      receiptNumber: newTxNumber,
      createdAt: now.toISOString(),
      customer: { ...customer },
      services: [...selectedServices],
      vehicleCategory,
      waterQuality: { ...waterQuality },
      additionalNotes: additionalNotes.trim(),
      technicianName,
      subtotal,
      discount,
      discountCode,
      total,
      paymentMethod,
      cashGiven: paymentMethod === 'cash' ? cashGiven || total : undefined,
      cashChange: paymentMethod === 'cash' ? Math.max(0, (cashGiven || total) - total) : undefined,
      status: 'completed',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setActiveReceiptTx(newTx);
    showToast(`Transaksi ${newTxNumber} berhasil disimpan!`);
  };

  // Reset Form for New Transaction
  const handleResetForm = () => {
    setCustomer({
      name: '',
      vehicleType: '',
      plateNumber: '',
      phone: '',
    });
    setVehicleCategory('small');
    setSelectedServices([
      {
        serviceId: 'srv_wash_light',
        name: 'Cuci Eksterior + Interior Ringan',
        price: 65000,
        category: 'small',
      },
    ]);
    setWaterQuality(evaluateWaterQuality(14, 7.0, 26));
    setAdditionalNotes('');
    setPaymentMethod('qris');
    setDiscount(0);
    setDiscountCode(undefined);
    setCashGiven(0);
  };

  // Send WhatsApp Action
  const handleDirectWhatsApp = (tx: Transaction) => {
    const text = generateWhatsAppText(tx);
    let phone = tx.customer.phone.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.slice(1);
    } else if (phone.startsWith('8')) {
      phone = '628' + phone.slice(1);
    }
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Transaksi berhasil dihapus.');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-cyan-500 selection:text-neutral-950 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-cyan-500 text-neutral-950 px-4 py-2.5 rounded-2xl shadow-xl font-bold text-xs md:text-sm animate-bounce">
          <CheckCircle2 className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-3.5 py-4 sm:px-6 sm:py-6 space-y-5">
        {/* Header Banner with PuffLogo & live stats */}
        <Header
          todayCount={todayCount}
          todayRevenue={todayRevenue}
          averageTds={averageTds}
        />

        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* View 1: New Transaction Flow */}
        {activeTab === 'new_transaction' && (
          <main className="space-y-5">
            {/* 01 · Data Pelanggan */}
            <CustomerForm
              data={customer}
              vehicleCategory={vehicleCategory}
              onChange={handleCustomerChange}
              onVehicleSelect={handleVehicleSelect}
            />

            {/* 02 · Pilih Layanan */}
            <ServiceSelector
              vehicleCategory={vehicleCategory}
              onVehicleCategoryChange={setVehicleCategory}
              selectedServices={selectedServices}
              onToggleService={handleToggleService}
            />

            {/* 03 · Hasil Water Quality Check */}
            <WaterQualitySection
              value={waterQuality}
              onChange={setWaterQuality}
            />

            {/* 04 · Catatan Tambahan & Petugas */}
            <NotesSection
              notes={additionalNotes}
              onNotesChange={setAdditionalNotes}
              technicianName={technicianName}
              onTechnicianChange={setTechnicianName}
            />

            {/* 05 · Kasir & Pembayaran */}
            <CheckoutSummary
              services={selectedServices}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              discount={discount}
              discountCode={discountCode}
              onApplyDiscount={handleApplyDiscount}
              onClearDiscount={handleClearDiscount}
              cashGiven={cashGiven}
              onCashGivenChange={setCashGiven}
              isFormValid={isFormValid}
              validationError={validationError}
              onSubmitTransaction={handleSubmitTransaction}
            />
          </main>
        )}

        {/* View 2: Riwayat Transaksi */}
        {activeTab === 'history' && (
          <HistoryView
            transactions={transactions}
            onViewReceipt={(tx) => setActiveReceiptTx(tx)}
            onSendWhatsApp={handleDirectWhatsApp}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {/* View 3: Laporan Penjualan (Harian, Mingguan, Bulanan) */}
        {activeTab === 'sales_report' && (
          <SalesReportView
            transactions={transactions}
            onViewReceipt={(tx) => setActiveReceiptTx(tx)}
            onSendWhatsApp={handleDirectWhatsApp}
          />
        )}
      </div>

      {/* 80mm Thermal Receipt Modal with Print & WhatsApp Delivery */}
      <ThermalReceiptModal
        transaction={activeReceiptTx}
        isOpen={Boolean(activeReceiptTx)}
        onClose={() => setActiveReceiptTx(null)}
        onNewTransaction={handleResetForm}
      />
    </div>
  );
}
