import { ServiceItem, Transaction, VehicleCategory } from '../types/pos';

export const VEHICLE_CATEGORIES: { id: VehicleCategory; label: string; icon: string; sizeMultiplier: number; examples: string }[] = [
  {
    id: 'small',
    label: 'Small / City Car',
    icon: '🚗',
    sizeMultiplier: 1.0,
    examples: 'Agya, Brio, Ayla, Yaris, Jazz, Raize, Ignis',
  },
  {
    id: 'medium',
    label: 'Medium / MPV & Crossover',
    icon: '🚙',
    sizeMultiplier: 1.15,
    examples: 'Avanza, Xpander, HR-V, Veloz, Ertiga, BR-V',
  },
  {
    id: 'large',
    label: 'Large / SUV & Luxury',
    icon: '🚐',
    sizeMultiplier: 1.35,
    examples: 'Innova Zenix, Fortuner, Pajero, Alphard, CR-V',
  },
  {
    id: 'motor',
    label: 'Sepeda Motor',
    icon: '🛵',
    sizeMultiplier: 0.5,
    examples: 'NMAX, PCX, Vespa, Aerox, Vario, Sport 250cc',
  },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv_wash_light',
    name: 'Cuci Eksterior + Interior Ringan',
    description: 'Snow foam wash touchless, pembersihan velg, vacuum kabin, lap sela pintu & semir ban premium.',
    category: 'all',
    basePrice: 65000,
    durationMinutes: 45,
    iconName: 'Sparkles',
    popular: true,
  },
  {
    id: 'srv_full_detail',
    name: 'Full Detailing & Interior Deep Clean',
    description: 'Cuci menyeluruh, deep vacuum extraction, pembersihan noda jok/plafon, dressing dashboard & conditioning interior.',
    category: 'all',
    basePrice: 150000,
    durationMinutes: 90,
    iconName: 'Layers',
    popular: true,
  },
  {
    id: 'srv_tire_velg',
    name: 'Tire Dressing & Velg Coating',
    description: 'Degreasing kerak brake dust velg & dressing semir ban hydrophobic tahan air dan kilau tahan lama.',
    category: 'all',
    basePrice: 25000,
    durationMinutes: 15,
    iconName: 'Disc',
  },
  {
    id: 'srv_glass_polish',
    name: 'Jamur Kaca & Water Repellent',
    description: 'Pembersihan kerak air/jamur pada kaca depan & spion + pelapis hydrophobic efek daun talas anti hujan deras.',
    category: 'all',
    basePrice: 50000,
    durationMinutes: 30,
    iconName: 'Shield',
    popular: true,
  },
  {
    id: 'srv_wax_express',
    name: 'Wax Express Gloss Protection',
    description: 'Aplikasi carnauba liquid wax / spray sealant untuk kilau basah (wet-look) & proteksi UV cat bodi.',
    category: 'all',
    basePrice: 45000,
    durationMinutes: 25,
    iconName: 'Sun',
  },
  {
    id: 'srv_engine_bay',
    name: 'Engine Bay Detailing',
    description: 'Pembersihan debu & kerak oli ruang mesin menggunakan steam & chemical aman bagi kelistrikan + dressing selang.',
    category: 'all',
    basePrice: 60000,
    durationMinutes: 35,
    iconName: 'Wrench',
  },
  {
    id: 'srv_fogging',
    name: 'Fogging Disinfektan & Anti Bakteri',
    description: 'Pengasapan kabin sterilisasi kuman, virus, dan penghilang aroma apek/rokok dengan aroma segar alami.',
    category: 'all',
    basePrice: 35000,
    durationMinutes: 20,
    iconName: 'Wind',
  },
];

export const QUICK_NOTE_SUGGESTIONS = [
  'Baret halus di bumper depan',
  'Jamur tipis di kaca supir',
  'Velg sangat berdebu & kerak rem',
  'Parfum kabin aroma Bubblegum',
  'Parfum kabin aroma Kopi Bali',
  'Parfum kabin aroma Fresh Vanilla',
  'Jangan semprot langsung ruang mesin',
  'Fokus bersihkan sela jok belakang',
  'Barang berharga telah diamankan pemilik',
  'Pelanggan minta cuci garansi hujan 24 jam',
];

export const TECHNICIANS = [
  'Tim Alpha (Dimas & Budi)',
  'Tim Bravo (Fajar & Rian)',
  'Tim Charlie (Aditya & Eko)',
  'Teknisi Solo (Hendra)',
];

export const VEHICLE_PRESETS = [
  { name: 'Toyota Agya', category: 'small' as VehicleCategory },
  { name: 'Honda Brio', category: 'small' as VehicleCategory },
  { name: 'Toyota Avanza', category: 'medium' as VehicleCategory },
  { name: 'Mitsubishi Xpander', category: 'medium' as VehicleCategory },
  { name: 'Honda HR-V', category: 'medium' as VehicleCategory },
  { name: 'Toyota Innova Zenix', category: 'large' as VehicleCategory },
  { name: 'Toyota Fortuner', category: 'large' as VehicleCategory },
  { name: 'Mitsubishi Pajero Sport', category: 'large' as VehicleCategory },
  { name: 'Yamaha NMAX', category: 'motor' as VehicleCategory },
  { name: 'Honda PCX', category: 'motor' as VehicleCategory },
  { name: 'Vespa Sprint 150', category: 'motor' as VehicleCategory },
];

/**
 * Initial sample transactions so reports and history have data right away
 */
export function getInitialSeedTransactions(): Transaction[] {
  const now = new Date();
  
  // Create dates for today, yesterday, and 3 days ago
  const dToday1 = new Date(now);
  dToday1.setHours(9, 30, 0, 0);

  const dToday2 = new Date(now);
  dToday2.setHours(11, 15, 0, 0);

  const dYesterday = new Date(now);
  dYesterday.setDate(now.getDate() - 1);
  dYesterday.setHours(14, 0, 0, 0);

  const d2DaysAgo = new Date(now);
  d2DaysAgo.setDate(now.getDate() - 2);
  d2DaysAgo.setHours(10, 20, 0, 0);

  const d5DaysAgo = new Date(now);
  d5DaysAgo.setDate(now.getDate() - 5);
  d5DaysAgo.setHours(16, 45, 0, 0);

  return [
    {
      id: 'tx_seed_1',
      receiptNumber: 'PUFF-20261109-001',
      createdAt: dToday1.toISOString(),
      customer: {
        name: 'Dimas Kurniawan',
        vehicleType: 'Toyota Agya',
        plateNumber: 'KT 1234 XX',
        phone: '081234567890',
      },
      services: [
        {
          serviceId: 'srv_wash_light',
          name: 'Cuci Eksterior + Interior Ringan',
          price: 65000,
          category: 'small',
        },
        {
          serviceId: 'srv_tire_velg',
          name: 'Tire Dressing & Velg Coating',
          price: 25000,
          category: 'all',
        },
      ],
      vehicleCategory: 'small',
      waterQuality: {
        tdsPpm: 14,
        ph: 7.0,
        temperatureC: 26,
        sourceNote: 'Air Purifikasi RO & Deionisasi Puff.id',
        statusText: '✨ Sangat Murni & Spot-Free (Aman Cat & Coating)',
        qualityLevel: 'optimal',
      },
      additionalNotes: 'Baret halus bumper depan kanan, parfum aroma kopi bali.',
      technicianName: 'Tim Alpha (Dimas & Budi)',
      subtotal: 90000,
      discount: 0,
      total: 90000,
      paymentMethod: 'qris',
      status: 'completed',
    },
    {
      id: 'tx_seed_2',
      receiptNumber: 'PUFF-20261109-002',
      createdAt: dToday2.toISOString(),
      customer: {
        name: 'Dr. Sarah Amalia',
        vehicleType: 'Honda HR-V',
        plateNumber: 'B 2389 PQT',
        phone: '081399887766',
      },
      services: [
        {
          serviceId: 'srv_wash_light',
          name: 'Cuci Eksterior + Interior Ringan',
          price: 75000,
          category: 'medium',
        },
        {
          serviceId: 'srv_glass_polish',
          name: 'Jamur Kaca & Water Repellent',
          price: 50000,
          category: 'all',
        },
        {
          serviceId: 'srv_fogging',
          name: 'Fogging Disinfektan & Anti Bakteri',
          price: 35000,
          category: 'all',
        },
      ],
      vehicleCategory: 'medium',
      waterQuality: {
        tdsPpm: 12,
        ph: 6.9,
        temperatureC: 27,
        sourceNote: 'Air Purifikasi RO & Deionisasi Puff.id',
        statusText: '✨ Sangat Murni & Spot-Free (Aman Cat & Coating)',
        qualityLevel: 'optimal',
      },
      additionalNotes: 'Kaca depan berjamur bekas air hujan lama, kabin disterilkan maksimal.',
      technicianName: 'Tim Bravo (Fajar & Rian)',
      subtotal: 160000,
      discount: 10000,
      discountCode: 'PUFFNEW10',
      total: 150000,
      paymentMethod: 'transfer_bca',
      status: 'completed',
    },
    {
      id: 'tx_seed_3',
      receiptNumber: 'PUFF-20261108-003',
      createdAt: dYesterday.toISOString(),
      customer: {
        name: 'Pak Hendra Wijaya',
        vehicleType: 'Innova Zenix Hybrid',
        plateNumber: 'DK 1888 XY',
        phone: '087811223344',
      },
      services: [
        {
          serviceId: 'srv_full_detail',
          name: 'Full Detailing & Interior Deep Clean',
          price: 180000,
          category: 'large',
        },
        {
          serviceId: 'srv_wax_express',
          name: 'Wax Express Gloss Protection',
          price: 45000,
          category: 'all',
        },
      ],
      vehicleCategory: 'large',
      waterQuality: {
        tdsPpm: 18,
        ph: 7.1,
        temperatureC: 28,
        sourceNote: 'Air Purifikasi RO & Deionisasi Puff.id',
        statusText: '✨ Sangat Murni & Spot-Free (Aman Cat & Coating)',
        qualityLevel: 'optimal',
      },
      additionalNotes: 'Mobil baru coating 3 bulan lalu, wajib shampoo pH netral & air demineralisasi.',
      technicianName: 'Tim Alpha (Dimas & Budi)',
      subtotal: 225000,
      discount: 0,
      total: 225000,
      paymentMethod: 'qris',
      status: 'completed',
    },
    {
      id: 'tx_seed_4',
      receiptNumber: 'PUFF-20261107-004',
      createdAt: d2DaysAgo.toISOString(),
      customer: {
        name: 'Rian Pratama',
        vehicleType: 'Yamaha NMAX',
        plateNumber: 'KT 5678 ZZ',
        phone: '085712344321',
      },
      services: [
        {
          serviceId: 'srv_wash_light',
          name: 'Cuci Eksterior + Interior Ringan',
          price: 35000,
          category: 'motor',
        },
        {
          serviceId: 'srv_tire_velg',
          name: 'Tire Dressing & Velg Coating',
          price: 20000,
          category: 'motor',
        },
      ],
      vehicleCategory: 'motor',
      waterQuality: {
        tdsPpm: 22,
        ph: 7.0,
        temperatureC: 27,
        sourceNote: 'Air Purifikasi RO & Deionisasi Puff.id',
        statusText: '✨ Sangat Murni & Spot-Free (Aman Cat & Coating)',
        qualityLevel: 'optimal',
      },
      additionalNotes: 'Kaki-kaki dan velg gold dibersihkan teliti.',
      technicianName: 'Teknisi Solo (Hendra)',
      subtotal: 55000,
      discount: 0,
      total: 55000,
      paymentMethod: 'cash',
      cashGiven: 60000,
      cashChange: 5000,
      status: 'completed',
    },
    {
      id: 'tx_seed_5',
      receiptNumber: 'PUFF-20261104-005',
      createdAt: d5DaysAgo.toISOString(),
      customer: {
        name: 'Ibu Maya Lestari',
        vehicleType: 'Toyota Avanza',
        plateNumber: 'B 1019 KKS',
        phone: '081288990011',
      },
      services: [
        {
          serviceId: 'srv_wash_light',
          name: 'Cuci Eksterior + Interior Ringan',
          price: 75000,
          category: 'medium',
        },
        {
          serviceId: 'srv_wax_express',
          name: 'Wax Express Gloss Protection',
          price: 45000,
          category: 'all',
        },
      ],
      vehicleCategory: 'medium',
      waterQuality: {
        tdsPpm: 16,
        ph: 7.0,
        temperatureC: 26,
        sourceNote: 'Air Purifikasi RO & Deionisasi Puff.id',
        statusText: '✨ Sangat Murni & Spot-Free (Aman Cat & Coating)',
        qualityLevel: 'optimal',
      },
      additionalNotes: 'Aroma kopi, barang di bagasi aman.',
      technicianName: 'Tim Charlie (Aditya & Eko)',
      subtotal: 120000,
      discount: 0,
      total: 120000,
      paymentMethod: 'qris',
      status: 'completed',
    },
  ];
}
