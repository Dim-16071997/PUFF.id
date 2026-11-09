import React from 'react';
import { User, Car, Hash, Phone, MessageSquare } from 'lucide-react';
import { CustomerData, VehicleCategory } from '../types/pos';
import { VEHICLE_PRESETS } from '../data/services';

interface CustomerFormProps {
  data: CustomerData;
  vehicleCategory: VehicleCategory;
  onChange: (field: keyof CustomerData, value: string) => void;
  onVehicleSelect?: (vehicleName: string, category: VehicleCategory) => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  data,
  onChange,
  onVehicleSelect,
}) => {
  return (
    <section className="bg-neutral-900/90 backdrop-blur-md rounded-3xl p-5 md:p-6 border border-neutral-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
            01
          </span>
          <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
            Data pelanggan
          </h2>
        </div>
        <span className="text-xs text-neutral-400">Identitas Kendaraan</span>
      </div>

      <div className="space-y-4">
        {/* Nama Pelanggan */}
        <div>
          <label
            htmlFor="cust_name"
            className="block text-xs font-medium text-neutral-300 mb-1.5"
          >
            Nama pelanggan <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
              <User className="h-4 w-4" />
            </div>
            <input
              id="cust_name"
              type="text"
              required
              value={data.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="Masukkan nama pelanggan"
              className="w-full rounded-2xl bg-neutral-800/80 border border-neutral-700/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>
        </div>

        {/* 2 Kolom: Jenis Kendaraan & Nomor Polisi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Jenis Kendaraan */}
          <div>
            <label
              htmlFor="cust_vehicle"
              className="block text-xs font-medium text-neutral-300 mb-1.5"
            >
              Jenis kendaraan <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                <Car className="h-4 w-4" />
              </div>
              <input
                id="cust_vehicle"
                type="text"
                required
                value={data.vehicleType}
                onChange={(e) => onChange('vehicleType', e.target.value)}
                placeholder="Contoh: Toyota Agya"
                className="w-full rounded-2xl bg-neutral-800/80 border border-neutral-700/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>

            {/* Quick vehicle preset chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[10px] text-neutral-500 self-center">Pilihan cepat:</span>
              {VEHICLE_PRESETS.slice(0, 5).map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    onChange('vehicleType', preset.name);
                    if (onVehicleSelect) onVehicleSelect(preset.name, preset.category);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] text-neutral-300 border border-neutral-700 hover:border-cyan-500/50 transition"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Nomor Polisi */}
          <div>
            <label
              htmlFor="cust_plate"
              className="block text-xs font-medium text-neutral-300 mb-1.5"
            >
              Nomor polisi <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                <Hash className="h-4 w-4" />
              </div>
              <input
                id="cust_plate"
                type="text"
                required
                value={data.plateNumber}
                onChange={(e) => onChange('plateNumber', e.target.value.toUpperCase())}
                placeholder="KT 1234 XX"
                className="w-full rounded-2xl bg-neutral-800/80 border border-neutral-700/80 pl-10 pr-4 py-2.5 text-sm font-semibold tracking-wider text-white placeholder-neutral-500 uppercase focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
            </div>
            <p className="text-[10px] text-neutral-400 mt-1.5 flex items-center gap-1">
              <span>Format plat nomor plat polisi Indonesia (Otomatis kapital)</span>
            </p>
          </div>
        </div>

        {/* Nomor HP / WhatsApp */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="cust_phone"
              className="text-xs font-medium text-neutral-300 flex items-center gap-1.5"
            >
              <span>Nomor HP / WhatsApp</span>
              <span className="text-[10px] font-normal text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/50 flex items-center gap-1">
                <MessageSquare className="h-2.5 w-2.5" />
                Kirim Struk WA
              </span>
            </label>
            <span className="text-[11px] text-neutral-500">(opsional)</span>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
              <Phone className="h-4 w-4" />
            </div>
            <input
              id="cust_phone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="08xxxxxxxxxx (untuk kirim struk WhatsApp)"
              className="w-full rounded-2xl bg-neutral-800/80 border border-neutral-700/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
            />
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Struk digital dan rincian hasil water check dapat dikirim langsung ke WhatsApp pelanggan setelah selesai dicuci.
          </p>
        </div>
      </div>
    </section>
  );
};
