import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Building2, FlaskConical, MapPin, Truck } from 'lucide-react';
import { FoodProductBatch } from '../types/foodTrace';

interface HeroSearchProps {
  onSearch: (batchId: string) => void;
  featuredBatches: FoodProductBatch[];
  onSelectBatch: (batchId: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  featuredBatches,
  onSelectBatch,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) {
      setInputError('Please enter a valid Batch ID (e.g. FT2026001)');
      return;
    }
    setInputError('');
    onSearch(trimmed);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background soft ambient gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-stone-50 to-stone-50 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Split Grid: Left Hero & Search, Right Laboratory & Produce Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Heading, Search & Demo Pills */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Trust Kicker without static pill encapsulation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-3">
              <span>National Traceability Ledger</span>
              <span aria-hidden="true">·</span>
              <span>ISO/IEC 17025 Accredited Verification</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] text-balance mb-4">
              Track Your Food. Ensure Your Safety.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed mb-8 max-w-xl">
              Verify the origin of every ingredient, follow each checkpoint across the supply chain, and inspect certified laboratory contamination test results with your unique product Batch ID.
            </p>

            {/* Interactive Search Box */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-white rounded-xl border border-stone-300 shadow-sm focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-600/20 transition-all">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="w-5 h-5 text-stone-400 shrink-0 mr-3" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value);
                      if (inputError) setInputError('');
                    }}
                    placeholder="Enter Batch ID (e.g., FT2026001, FT2026003)..."
                    className="w-full py-2.5 text-stone-900 placeholder-stone-400 font-medium focus:outline-none text-sm sm:text-base font-mono uppercase tracking-wide"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="px-2 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <span>Track Product</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {inputError && (
                <p className="text-xs text-rose-600 font-medium mt-1.5 ml-1">{inputError}</p>
              )}
            </form>

            {/* Quick Sample Batch Buttons */}
            <div className="mt-2">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                Click to Test Verified Sample Batches:
              </p>
              <div className="flex flex-wrap gap-2">
                {featuredBatches.map((batch) => {
                  const isSafe = batch.status === 'safe';
                  const isContaminated = batch.status === 'contaminated';

                  return (
                    <button
                      key={batch.batchId}
                      onClick={() => {
                        setSearchInput(batch.batchId);
                        onSelectBatch(batch.batchId);
                      }}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium border transition-all flex items-center gap-1.5 cursor-pointer text-left ${
                        isContaminated
                          ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100'
                          : !isSafe
                          ? 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-emerald-500 hover:text-emerald-800'
                      }`}
                    >
                      {isContaminated ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      ) : !isSafe ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                      <span className="font-mono font-semibold">{batch.batchId}</span>
                      <span className="text-stone-500 hidden sm:inline">({batch.productName.split(' ')[0]})</span>
                      <span className="text-[10px] font-bold uppercase ml-0.5 opacity-80">
                        {isContaminated ? 'Alert' : !isSafe ? 'Warning' : 'Safe'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Demo Notice */}
            <div className="mt-6 flex items-center gap-2 text-xs text-stone-500 bg-stone-100/80 px-3 py-2 rounded-lg border border-stone-200/80 max-w-xl">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Demonstration Data Environment:</strong> Realistic safety records calibrated for testing milk, grains, juice, oils, and bakery lots.
              </span>
            </div>
          </div>

          {/* Right Column: High-Fidelity Hero Image Asset with Laboratory Context */}
          <div className="lg:col-span-5 relative flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-stone-100">
              <img
                src="/src/assets/images/hero_food_trace_1794004307409.jpg"
                alt="Food safety scientist conducting quality inspection with fresh produce and laboratory testing equipment"
                className="w-full h-80 sm:h-96 lg:h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/30 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                  End-to-End Purity Assurance
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">
                  Multi-Stage Farm-to-Fork Security
                </h3>
                <p className="text-xs text-stone-200 leading-relaxed">
                  Real-time synchronization between agricultural harvesting, temperature-controlled transport, cold chain loggers, and ISO/IEC accredited analytical labs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Key Traceability Pillars */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-stone-900 mb-1">Geolocated Farm Origin</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Verify exact soil coordinates, farmer identity, harvesting date, and ecological certifications.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-stone-900 mb-1">Laboratory Screening</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Real analytical data for chemical residues, microbial pathogens, heavy metals, and mycotoxins.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-stone-900 mb-1">Cold Chain Logistics</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Continuous IoT temperature monitoring logs from processing plants to supermarket shelves.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-stone-900 mb-1">Rapid Recall Network</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Instant alerts and quarantine protocols whenever an anomaly or contaminant is verified.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
