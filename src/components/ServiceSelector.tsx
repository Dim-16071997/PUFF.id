import React from 'react';
import {
  Sparkles,
  Layers,
  Disc,
  Shield,
  Sun,
  Wrench,
  Wind,
  Check,
  Clock,
} from 'lucide-react';
import { SelectedService, ServiceItem, VehicleCategory } from '../types/pos';
import { DEFAULT_SERVICES, VEHICLE_CATEGORIES } from '../data/services';
import { formatRupiah } from '../utils/pos';

interface ServiceSelectorProps {
  vehicleCategory: VehicleCategory;
  onVehicleCategoryChange: (category: VehicleCategory) => void;
  selectedServices: SelectedService[];
  onToggleService: (service: ServiceItem, calculatedPrice: number) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  vehicleCategory,
  onVehicleCategoryChange,
  selectedServices,
  onToggleService,
}) => {
  // Get active size multiplier
  const activeCategoryObj =
    VEHICLE_CATEGORIES.find((c) => c.id === vehicleCategory) || VEHICLE_CATEGORIES[0];

  const getServicePrice = (basePrice: number): number => {
    // Round to nearest 5,000 IDR for clean cashier pricing
    const raw = basePrice * activeCategoryObj.sizeMultiplier;
    return Math.round(raw / 5000) * 5000;
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="h-5 w-5" />;
      case 'Layers':
        return <Layers className="h-5 w-5" />;
      case 'Disc':
        return <Disc className="h-5 w-5" />;
      case 'Shield':
        return <Shield className="h-5 w-5" />;
      case 'Sun':
        return <Sun className="h-5 w-5" />;
      case 'Wrench':
        return <Wrench className="h-5 w-5" />;
      case 'Wind':
        return <Wind className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <section className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-neutral-800 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
            02
          </span>
          <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
            Pilih layanan
          </h2>
          <span className="text-xs bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-800/40">
            {selectedServices.length} dipilih
          </span>
        </div>

        {/* Vehicle Category Picker */}
        <div className="flex items-center gap-1 bg-neutral-800/80 p-1 rounded-xl border border-neutral-700/80 overflow-x-auto">
          {VEHICLE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onVehicleCategoryChange(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                vehicleCategory === cat.id
                  ? 'bg-cyan-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label.split(' / ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-neutral-400 mb-3 flex items-center justify-between">
        <span>Ukuran: <strong className="text-neutral-200">{activeCategoryObj.label}</strong> ({activeCategoryObj.examples})</span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEFAULT_SERVICES.map((srv) => {
          const price = getServicePrice(srv.basePrice);
          const isSelected = selectedServices.some((s) => s.serviceId === srv.id);

          return (
            <button
              key={srv.id}
              type="button"
              onClick={() => onToggleService(srv, price)}
              className={`text-left p-3.5 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/60 to-neutral-900 border-cyan-500/80 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-neutral-800/40 border-neutral-700/70 hover:border-neutral-600 hover:bg-neutral-800/70'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected
                          ? 'bg-cyan-500 text-neutral-950'
                          : 'bg-neutral-800 text-cyan-400'
                      }`}
                    >
                      {getIcon(srv.iconName)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {srv.name}
                      </h3>
                      {srv.popular && (
                        <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/50 inline-block mt-0.5">
                          Favorit
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center border transition ${
                      isSelected
                        ? 'bg-cyan-500 border-cyan-400 text-neutral-950'
                        : 'border-neutral-600 bg-neutral-800/50'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                  {srv.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-neutral-700/50 text-xs">
                <span className="text-neutral-400 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-neutral-500" />
                  ~{srv.durationMinutes} mnt
                </span>
                <span
                  className={`font-black text-sm ${
                    isSelected ? 'text-cyan-300' : 'text-white'
                  }`}
                >
                  {formatRupiah(price)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
