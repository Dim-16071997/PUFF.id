import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed and running in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop PWA prompt available
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-neutral-950 px-3 py-1 text-xs font-black shadow-md transition active:scale-95 cursor-pointer"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Install Aplikasi POS</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/25 px-3 py-1 text-xs font-bold transition"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Install di iPhone</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          >
            <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-700 p-5 shadow-2xl text-left">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-cyan-400" />
                  <span>Pasang PUFF.id di Home Screen</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-neutral-300">
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-bold shrink-0">
                    1
                  </span>
                  <p>
                    Ketuk tombol <strong>Share / Bagikan</strong> (ikon kotak dengan panah ke atas) di bilah bawah peramban Safari.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-bold shrink-0">
                    2
                  </span>
                  <p>
                    Gulir ke bawah lalu pilih menu <strong>&ldquo;Add to Home Screen&rdquo;</strong> (Tambah ke Layar Utama).
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-bold shrink-0">
                    3
                  </span>
                  <p>
                    Aplikasi PUFF.id POS kini dapat dibuka langsung dari layar depan tanpa bilah navigasi browser.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  const [showGeneralGuide, setShowGeneralGuide] = useState(false);

  // Fallback info button for other browsers
  return (
    <>
      <button
        type="button"
        onClick={() => setShowGeneralGuide(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/20 px-2.5 py-0.5 text-[11px] font-semibold transition"
      >
        <Download className="h-3 w-3 text-cyan-200" />
        <span>Install PWA</span>
      </button>

      {showGeneralGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-700 p-5 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Download className="h-4 w-4 text-cyan-400" />
                <span>Instal Aplikasi PUFF.id POS</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowGeneralGuide(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Untuk menginstal PUFF.id ke layar utama:
              <br /><br />
              • <strong>Chrome / Edge (PC & Android):</strong> Klik tombol titik tiga di sudut kanan atas browser, lalu pilih <strong>&ldquo;Instal Aplikasi&rdquo;</strong> atau <strong>&ldquo;Tambahkan ke Layar Utama&rdquo;</strong>.
              <br /><br />
              • Aplikasi akan terpasang layaknya aplikasi Android / Windows native tanpa alamat URL browser.
            </p>

            <button
              type="button"
              onClick={() => setShowGeneralGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-neutral-950 font-bold text-xs"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
