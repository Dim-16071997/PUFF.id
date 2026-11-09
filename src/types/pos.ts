export type VehicleCategory = 'small' | 'medium' | 'large' | 'motor';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category: VehicleCategory | 'all';
  basePrice: number;
  durationMinutes: number;
  iconName: string;
  popular?: boolean;
}

export interface SelectedService {
  serviceId: string;
  name: string;
  price: number;
  category: VehicleCategory | 'all';
}

export interface CustomerData {
  name: string;
  vehicleType: string;
  plateNumber: string;
  phone: string;
}

export interface WaterQualityCheck {
  tdsPpm: number; // in ppm (parts per million)
  ph: number;     // pH level (typically 6.5 - 7.5)
  temperatureC?: number;
  sourceNote: string;
  statusText: string;
  qualityLevel: 'optimal' | 'good' | 'caution';
}

export type PaymentMethod = 'qris' | 'cash' | 'transfer_bca' | 'transfer_mandiri' | 'ewallet';

export interface Transaction {
  id: string;
  receiptNumber: string;
  createdAt: string; // ISO string
  customer: CustomerData;
  services: SelectedService[];
  vehicleCategory: VehicleCategory;
  waterQuality: WaterQualityCheck;
  additionalNotes: string;
  technicianName: string;
  subtotal: number;
  discount: number;
  discountCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  cashGiven?: number;
  cashChange?: number;
  status: 'completed' | 'cancelled';
}

export interface DailyStats {
  todayCount: number;
  todayRevenue: number;
  averageTds: number;
}

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'all';

export interface BestSellingItem {
  name: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface SalesReportSummary {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalTransactions: number;
  averageOrderValue: number;
  bestSellingItems: BestSellingItem[];
  waterQualityStats: {
    averageTds: number;
    averagePh: number;
    optimalCount: number;
    goodCount: number;
    cautionCount: number;
  };
  transactions: Transaction[];
}
