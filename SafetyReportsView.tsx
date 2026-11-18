import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Search, FileText, CheckCircle2, Building, ExternalLink } from 'lucide-react';
import { FoodProductBatch } from '../types/foodTrace';

interface SafetyReportsViewProps {
  batches: FoodProductBatch[];
  onSelectBatch: (batchId: string) => void;
}

export const SafetyReportsView: React.FC<SafetyReportsViewProps> = ({ batches, onSelectBatch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = batches.filter((b) => {
    const matchSearch =
      b.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'All' || b.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const categories = ['All', ...Array.from(new Set(batches.map((b) => b.category)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          <span>Public Safety Records</span>
          <span aria-hidden="true">·</span>
          <span>Regulatory Bulletins</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
          Laboratory Inspection & Contamination Reports
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
          Search independent laboratory test dossiers across all registered batches. Only verified batches with certified analytical data are released to market.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Batch ID, Product, or Brand..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-stone-400 font-medium">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                categoryFilter === cat
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((batch) => {
          const isSafe = batch.status === 'safe';
          const isContaminated = batch.status === 'contaminated';
          const isWarning = batch.status === 'warning';

          return (
            <div
              key={batch.batchId}
              onClick={() => onSelectBatch(batch.batchId)}
              className={`bg-white rounded-2xl border transition-all hover:shadow-md cursor-pointer flex flex-col justify-between overflow-hidden ${
                isContaminated
                  ? 'border-rose-300 ring-1 ring-rose-200'
                  : isWarning
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : 'border-stone-200 hover:border-emerald-500'
              }`}
            >
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    {batch.batchId}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isSafe
                        ? 'bg-emerald-100 text-emerald-800'
                        : isWarning
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isSafe && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {isWarning && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                    {isContaminated && <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />}
                    <span>{isSafe ? 'Passed Safe' : isWarning ? 'Warning Hold' : 'Recall Action'}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900 line-clamp-1">{batch.productName}</h3>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {batch.brandName} · {batch.category}
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1.5">
                  <div className="text-stone-500">
                    Tested by: <strong className="text-stone-800">{batch.safetyReport.laboratory.name.split('(')[0]}</strong>
                  </div>
                  <div className="text-stone-500 font-mono text-[11px]">
                    Cert: {batch.safetyReport.certificateNumber}
                  </div>
                  <div className="text-stone-600 text-[11px] line-clamp-2 italic">
                    &quot;{batch.safetyReport.recommendations}&quot;
                  </div>
                </div>
              </div>

              <div className="p-4 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
                <span>View Full Test Findings & Timeline</span>
                <FileText className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Standards Reference Box */}
      <div className="bg-stone-100/80 p-6 rounded-2xl border border-stone-200 space-y-3">
        <h3 className="text-sm font-bold text-stone-900">National Food Safety Thresholds & Tolerance Limits</h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          FoodTrace strictly abides by Codex Alimentarius, FDA 21 CFR, and EFSA standards. Products are screened for heavy metals (Lead &lt;0.02 mg/kg, Cadmium &lt;0.01 mg/kg), zero-tolerance pathogens (Salmonella, Listeria absent in 25g), and mycotoxins (Aflatoxin M1 &lt;0.5 ppb, Patulin &lt;50 ug/kg). Any batch exceeding these parameters triggers immediate automated retail quarantine.
        </p>
      </div>
    </div>
  );
};
