import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  calculateSubtotal,
  calculateTotal,
  evaluateWaterQuality,
  generateReceiptNumber,
  filterTransactionsByPeriod,
  calculateSalesReport,
  generateWhatsAppText,
} from './pos';
import { Transaction } from '../types/pos';

test('formatRupiah formats currency correctly in IDR', () => {
  assert.equal(formatRupiah(0), 'Rp0');
  assert.equal(formatRupiah(65000), 'Rp65.000');
  assert.equal(formatRupiah(150000), 'Rp150.000');
  assert.equal(formatRupiah(NaN), 'Rp0');
});

test('calculateSubtotal and calculateTotal calculate amounts correctly', () => {
  const services = [
    { serviceId: 's1', name: 'Cuci Eksterior', price: 50000, category: 'all' as const },
    { serviceId: 's2', name: 'Tire Dressing', price: 15000, category: 'all' as const },
  ];
  const subtotal = calculateSubtotal(services);
  assert.equal(subtotal, 65000);

  const total = calculateTotal(subtotal, 10000);
  assert.equal(total, 55000);

  // Discount greater than subtotal shouldn't go negative
  const zeroTotal = calculateTotal(subtotal, 100000);
  assert.equal(zeroTotal, 0);
});

test('evaluateWaterQuality grades TDS and pH accurately according to car wash standard', () => {
  // Pure / Spot-Free (< 50 ppm, pH neutral 6.5 - 7.5)
  const optimal = evaluateWaterQuality(18, 7.0);
  assert.equal(optimal.qualityLevel, 'optimal');
  assert.equal(optimal.tdsPpm, 18);
  assert.equal(optimal.ph, 7.0);
  assert.match(optimal.statusText, /Sangat Murni/);

  // Good filtered water (51 - 120 ppm)
  const good = evaluateWaterQuality(75, 7.2);
  assert.equal(good.qualityLevel, 'good');

  // Caution (High mineral or extreme pH)
  const caution = evaluateWaterQuality(180, 8.5);
  assert.equal(caution.qualityLevel, 'caution');
});

test('generateReceiptNumber produces formatted receipt identifier', () => {
  const fixedDate = new Date(2026, 10, 10); // Nov 10, 2026
  const id = generateReceiptNumber(fixedDate, 5);
  assert.equal(id, 'PUFF-20261110-005');
});

test('calculateSalesReport calculates sales, best items, and water quality correctly', () => {
  const sampleTransactions: Transaction[] = [
    {
      id: 'tx1',
      receiptNumber: 'PUFF-20261110-001',
      createdAt: '2026-11-10T10:00:00.000Z',
      customer: {
        name: 'Dimas',
        vehicleType: 'Toyota Agya',
        plateNumber: 'KT 1234 XX',
        phone: '08123456789',
      },
      services: [
        { serviceId: 's1', name: 'Cuci Eksterior + Interior Ringan', price: 65000, category: 'all' },
        { serviceId: 's2', name: 'Tire Dressing', price: 15000, category: 'all' },
      ],
      vehicleCategory: 'small',
      waterQuality: {
        tdsPpm: 18,
        ph: 7.0,
        sourceNote: 'Air Purifikasi',
        statusText: 'Optimal',
        qualityLevel: 'optimal',
      },
      additionalNotes: 'Baret halus bumper depan',
      technicianName: 'Tim 1',
      subtotal: 80000,
      discount: 0,
      total: 80000,
      paymentMethod: 'qris',
      status: 'completed',
    },
    {
      id: 'tx2',
      receiptNumber: 'PUFF-20261110-002',
      createdAt: '2026-11-10T11:00:00.000Z',
      customer: {
        name: 'Siti',
        vehicleType: 'Honda HR-V',
        plateNumber: 'B 4567 CD',
        phone: '08987654321',
      },
      services: [
        { serviceId: 's1', name: 'Cuci Eksterior + Interior Ringan', price: 75000, category: 'all' },
        { serviceId: 's3', name: 'Jamur Kaca Depan', price: 45000, category: 'all' },
      ],
      vehicleCategory: 'medium',
      waterQuality: {
        tdsPpm: 22,
        ph: 7.1,
        sourceNote: 'Air Purifikasi',
        statusText: 'Optimal',
        qualityLevel: 'optimal',
      },
      additionalNotes: 'Kaca berjamur',
      technicianName: 'Tim 2',
      subtotal: 120000,
      discount: 10000,
      total: 110000,
      paymentMethod: 'cash',
      status: 'completed',
    },
  ];

  const report = calculateSalesReport(sampleTransactions, 'all', new Date('2026-11-10T12:00:00.000Z'));

  assert.equal(report.totalTransactions, 2);
  assert.equal(report.totalRevenue, 190000);
  assert.equal(report.averageOrderValue, 95000);

  // Best selling items: 'Cuci Eksterior + Interior Ringan' should be rank 1 with 2 counts
  assert.equal(report.bestSellingItems[0].name, 'Cuci Eksterior + Interior Ringan');
  assert.equal(report.bestSellingItems[0].count, 2);

  // Water quality average
  assert.equal(report.waterQualityStats.averageTds, 20); // (18 + 22) / 2
  assert.equal(report.waterQualityStats.optimalCount, 2);
});

test('generateWhatsAppText contains brand tagline, water quality and customer data', () => {
  const sampleTx: Transaction = {
    id: 'tx1',
    receiptNumber: 'PUFF-20261110-001',
    createdAt: '2026-11-10T10:00:00.000Z',
    customer: {
      name: 'Budi Santoso',
      vehicleType: 'Innova Zenix',
      plateNumber: 'B 1234 ABC',
      phone: '08123456789',
    },
    services: [
      { serviceId: 's1', name: 'Cuci Eksterior + Interior Ringan', price: 75000, category: 'all' },
    ],
    vehicleCategory: 'medium',
    waterQuality: {
      tdsPpm: 15,
      ph: 7.0,
      sourceNote: 'Air Purifikasi',
      statusText: 'Optimal',
      qualityLevel: 'optimal',
    },
    additionalNotes: 'Velg kinclong maksimal',
    technicianName: 'Tim Alpha',
    subtotal: 75000,
    discount: 0,
    total: 75000,
    paymentMethod: 'qris',
    status: 'completed',
  };

  const text = generateWhatsAppText(sampleTx);
  assert.match(text, /PUFF\.ID MOBILE CAR WASH & CARE/);
  assert.match(text, /We come, we clean, you shine/);
  assert.match(text, /Budi Santoso/);
  assert.match(text, /B 1234 ABC/);
  assert.match(text, /15 ppm/);
  assert.match(text, /pH Air: 7/);
  assert.match(text, /Velg kinclong maksimal/);
});
