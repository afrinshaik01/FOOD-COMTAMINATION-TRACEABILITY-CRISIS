import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Building,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  Sparkles,
  QrCode,
  FileText,
  X,
  ExternalLink,
  Info,
  Thermometer,
  UserCheck,
  PhoneCall
} from 'lucide-react';
import { FoodProductBatch, SupplyChainStage } from '../types/foodTrace';

interface ProductTrackerProps {
  batch: FoodProductBatch;
  onBackToSearch?: () => void;
  onSelectAlternativeBatch?: (batchId: string) => void;
}

export const ProductTracker: React.FC<ProductTrackerProps> = ({
  batch,
  onBackToSearch,
  onSelectAlternativeBatch,
}) => {
  const [selectedStage, setSelectedStage] = useState<SupplyChainStage | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'microbial' | 'chemical' | 'metals' | 'physical'>('microbial');

  const isSafe = batch.status === 'safe';
  const isContaminated = batch.status === 'contaminated';
  const isWarning = batch.status === 'warning';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb & Back Link */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button
            onClick={onBackToSearch}
            className="hover:text-emerald-800 transition-colors font-medium cursor-pointer"
          >
            Traceability Search
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-stone-700 font-mono font-semibold uppercase">{batch.batchId}</span>
          <span aria-hidden="true">/</span>
          <span className="text-stone-900 font-medium">{batch.productName}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCertificateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Safety Certificate</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* ---------------- SECTION H: CONTAMINATION WARNING / RECALL NOTICE ---------------- */}
      {isContaminated && batch.recallNotice && (
        <section
          aria-labelledby="contamination-alert-heading"
          className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-6 sm:p-8 text-rose-950 shadow-sm transition-all"
        >
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="w-14 h-14 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-200 pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
                    <span>Active Regulatory Action</span>
                    <span aria-hidden="true">·</span>
                    <span>{batch.recallNotice.severity}</span>
                  </div>
                  <h2 id="contamination-alert-heading" className="text-xl sm:text-2xl font-extrabold text-rose-950 mt-0.5">
                    Contamination Detected — Immediate Product Recall
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-xs text-rose-700 font-medium">Notice Issued</div>
                  <div className="text-xs font-mono font-bold text-rose-950">
                    {new Date(batch.recallNotice.alertDate).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Contamination details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="bg-white/80 p-3 rounded-lg border border-rose-200">
                  <div className="text-rose-700 font-semibold mb-0.5">Affected Batch ID</div>
                  <div className="font-mono font-bold text-stone-900 text-sm">{batch.batchId}</div>
                  <div className="text-stone-500 mt-1">
                    Related lots: {batch.recallNotice.affectedLots.join(', ')}
                  </div>
                </div>

                <div className="bg-white/80 p-3 rounded-lg border border-rose-200">
                  <div className="text-rose-700 font-semibold mb-0.5">Contamination Category</div>
                  <div className="font-bold text-stone-900 text-sm">{batch.recallNotice.contaminationType}</div>
                  <div className="text-stone-600 mt-1">
                    {batch.safetyReport.detectedContaminants[0] || 'Mycotoxin concentration breach'}
                  </div>
                </div>

                <div className="bg-white/80 p-3 rounded-lg border border-rose-200">
                  <div className="text-rose-700 font-semibold mb-0.5">Identified Ingredient Source</div>
                  <div className="font-bold text-stone-900 text-sm">
                    {batch.recallNotice.contaminatedIngredient}
                  </div>
                  <div className="text-stone-600 mt-1">Origin Farm: {batch.origin.farmName}</div>
                </div>
              </div>

              {/* Affected Locations & Facilities */}
              <div className="bg-rose-100/70 p-4 rounded-xl border border-rose-200 text-xs">
                <div className="font-bold text-rose-900 mb-1.5">Affected Manufacturing & Distribution Locations:</div>
                <ul className="list-disc list-inside space-y-1 text-rose-950">
                  {batch.recallNotice.affectedLocations.map((loc, i) => (
                    <li key={i}>{loc}</li>
                  ))}
                </ul>
              </div>

              {/* Recommended Consumer Safety Actions */}
              <div className="bg-white p-4 rounded-xl border border-rose-300 text-xs space-y-2">
                <div className="font-bold text-stone-900 uppercase tracking-wide text-xs flex items-center gap-1.5 text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Mandatory Consumer Safety Guidelines:</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-stone-700">
                  {batch.recallNotice.consumerActions.map((action, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-bold text-rose-700">•</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-rose-900 font-semibold">
                    <PhoneCall className="w-4 h-4 text-rose-700" />
                    <span>Emergency Consumer Assistance Line: {batch.recallNotice.authorityHelpline}</span>
                  </div>
                  <span className="text-stone-500">Reported by: {batch.recallNotice.reportingAgency}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Warning Notice if status is 'warning' */}
      {isWarning && (
        <section
          aria-labelledby="warning-advisory-heading"
          className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 sm:p-8 text-amber-950 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <span>Quality Hold</span>
                <span aria-hidden="true">·</span>
                <span>Investigation In Progress</span>
              </div>
              <h2 id="warning-advisory-heading" className="text-xl font-bold text-amber-950">
                Warning: Further Testing & Secondary Verification Required
              </h2>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                {batch.safetyReport.detectedContaminants[0] || 'Preliminary testing detected parameter deviations.'} This batch has been placed under temporary retail distribution hold. Final clearance is pending secondary laboratory Gas Chromatography analysis.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- SECTION A: BASIC PRODUCT INFORMATION ---------------- */}
      <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Product Image Column */}
          <div className="lg:col-span-4 relative bg-stone-100 flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-stone-200">
            <div className="w-full max-w-sm rounded-xl overflow-hidden border border-stone-200 shadow-xs bg-white">
              <img
                src={batch.imageUrl}
                alt={batch.productName}
                className="w-full h-64 object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Visual Barcode / QR Simulation Badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs p-2 rounded-lg border border-stone-200 shadow-xs text-center flex flex-col items-center">
              <QrCode className="w-7 h-7 text-stone-800" />
              <span className="text-[9px] font-mono font-bold text-stone-600 mt-0.5">{batch.batchId}</span>
            </div>
          </div>

          {/* Product Overview Details */}
          <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category, Brand & Status Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                  <span className="text-stone-800 font-semibold">{batch.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{batch.brandName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{batch.netWeight}</span>
                </div>

                {/* Status Indicator (Green/Yellow/Red) */}
                <div
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-bold text-xs uppercase tracking-wide border ${
                    isSafe
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : isWarning
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-rose-50 text-rose-900 border-rose-300'
                  }`}
                >
                  {isSafe ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Safe / Verified Pure</span>
                    </>
                  ) : isWarning ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Warning / Further Testing</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Contamination Detected / Unsafe</span>
                    </>
                  )}
                </div>
              </div>

              {/* Title & Batch ID */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
                {batch.productName}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mb-6">
                <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1 rounded-md">
                  <span className="font-semibold text-stone-700">Batch ID:</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">{batch.batchId}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  <span>Mfg Date: <strong className="font-mono text-stone-800">{batch.mfgDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <span>Expiry Date: <strong className="font-mono text-stone-800">{batch.expiryDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Mfg Year: <strong className="font-mono text-stone-800">{batch.mfgYear}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-stone-200 text-xs">
              <div>
                <div className="text-stone-400 font-medium">Origin Nation</div>
                <div className="font-bold text-stone-900 mt-0.5">{batch.origin.country}</div>
              </div>
              <div>
                <div className="text-stone-400 font-medium">Lab Status</div>
                <div className="font-bold text-stone-900 mt-0.5">{batch.safetyReport.inspectionStatus}</div>
              </div>
              <div>
                <div className="text-stone-400 font-medium">Cold Chain Integrity</div>
                <div className="font-bold text-stone-900 mt-0.5">
                  {batch.supplyChain.some((s) => s.status === 'flagged') ? 'Anomalies Noted' : '100% Maintained'}
                </div>
              </div>
              <div>
                <div className="text-stone-400 font-medium">Certificate Ref</div>
                <div className="font-mono font-bold text-stone-900 mt-0.5 truncate" title={batch.safetyReport.certificateNumber}>
                  {batch.safetyReport.certificateNumber}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- SECTION B & D: ORIGIN & MANUFACTURING SPECIFICATIONS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SECTION B: Product Origin Information */}
        <section className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Product Origin Information</h3>
            </div>
            <span className="text-xs text-stone-500 font-mono">Stage 1 of Supply Chain</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-stone-400">Farm / Source Name</div>
              <div className="font-bold text-stone-900 text-sm mt-0.5">{batch.origin.farmName}</div>
            </div>
            <div>
              <div className="text-stone-400">Primary Farmer / Producer</div>
              <div className="font-bold text-stone-900 text-sm mt-0.5">{batch.origin.farmerDetails.name}</div>
              <div className="text-stone-500 font-mono text-[11px]">ID: {batch.origin.farmerDetails.contactOrId}</div>
            </div>
            <div>
              <div className="text-stone-400">Country & State</div>
              <div className="font-semibold text-stone-800 mt-0.5">
                {batch.origin.district}, {batch.origin.state}, {batch.origin.country}
              </div>
            </div>
            <div>
              <div className="text-stone-400">Raw Harvest Date</div>
              <div className="font-mono font-semibold text-stone-800 mt-0.5">
                {new Date(batch.origin.collectionDate).toLocaleDateString()}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-stone-400">Source Address / Farm Location</div>
              <div className="font-medium text-stone-800 mt-0.5">{batch.origin.sourceLocation}</div>
              {batch.origin.coordinates && (
                <div className="text-stone-500 font-mono text-[11px] mt-0.5">
                  GPS Coordinates: {batch.origin.coordinates.lat}°N, {batch.origin.coordinates.lng}°W
                </div>
              )}
            </div>
            <div className="sm:col-span-2 bg-stone-50 p-3 rounded-lg border border-stone-200">
              <div className="text-stone-500 font-medium">Agricultural Certification & Method:</div>
              <div className="font-semibold text-emerald-900 mt-0.5">{batch.origin.farmerDetails.certification}</div>
              <div className="text-stone-600 text-[11px] mt-0.5">{batch.origin.farmerDetails.sustainablePractice}</div>
            </div>
          </div>
        </section>

        {/* SECTION D: Manufacturing Information */}
        <section className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-stone-900">Manufacturing & Facility Details</h3>
            </div>
            <span className="text-xs text-stone-500 font-mono">Stage 4 of Supply Chain</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-stone-400">Manufacturing Entity</div>
              <div className="font-bold text-stone-900 text-sm mt-0.5">{batch.manufacturing.company}</div>
            </div>
            <div>
              <div className="text-stone-400">Facility Location</div>
              <div className="font-bold text-stone-900 text-sm mt-0.5">{batch.manufacturing.facilityName}</div>
              <div className="text-stone-500 text-[11px]">{batch.manufacturing.factoryLocation}</div>
            </div>
            <div>
              <div className="text-stone-400">Processing Date</div>
              <div className="font-mono font-semibold text-stone-800 mt-0.5">
                {new Date(batch.manufacturing.mfgDate).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-stone-400">Packaging Date</div>
              <div className="font-mono font-semibold text-stone-800 mt-0.5">
                {new Date(batch.manufacturing.packagingDate).toLocaleDateString()}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-stone-400">Processing Methodology</div>
              <div className="font-medium text-stone-800 mt-0.5 leading-relaxed">
                {batch.manufacturing.processingDetails}
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-stone-400">Preservation & Storage Conditions</div>
              <div className="font-semibold text-stone-800 mt-0.5">{batch.manufacturing.storageConditions}</div>
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
              <span className="text-stone-500 font-medium">Facility Audits:</span>
              {batch.manufacturing.facilityCertifications.map((cert, i) => (
                <span key={i} className="text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px] font-medium">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ---------------- SECTION C: INGREDIENTS & COMPONENTS BREAKDOWN ---------------- */}
      <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-6 sm:p-7 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-stone-900">Ingredients & Component Traceability</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Individual origin, supplier accountability, and quality status for every formulation component.
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-500">
            Total Components: {batch.ingredients.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Ingredient Name</th>
                <th className="py-3 px-4">Composition (%)</th>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">Supplier Origin</th>
                <th className="py-3 px-4">Supplier Lot ID</th>
                <th className="py-3 px-4 text-right">Quality Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {batch.ingredients.map((ing) => {
                const isIngContaminated = ing.qualityStatus === 'Contaminated';
                const isIngWarning = ing.qualityStatus === 'Under Investigation';

                return (
                  <tr
                    key={ing.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      isIngContaminated ? 'bg-rose-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-1.5">
                        {isIngContaminated && <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />}
                        {isIngWarning && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                        <span>{ing.name}</span>
                      </div>
                      {ing.notes && <div className="text-[11px] text-stone-500 mt-0.5">{ing.notes}</div>}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{ing.percentage}</td>
                    <td className="py-3 px-4">{ing.supplierName}</td>
                    <td className="py-3 px-4">{ing.supplierOrigin}</td>
                    <td className="py-3 px-4 font-mono text-stone-600">{ing.supplierLotId}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          isIngContaminated
                            ? 'bg-rose-100 text-rose-800'
                            : isIngWarning
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ing.qualityStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- SECTION E & G: SUPPLY CHAIN TRACKING & INTERACTIVE TIMELINE ---------------- */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <span>End-to-End Chain of Custody</span>
              <span aria-hidden="true">·</span>
              <span>Chronological Checkpoints</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mt-0.5">
              Supply Chain Tracking & Verification Journey
            </h3>
          </div>
          <div className="text-xs text-stone-500">
            Total Tracked Milestones: <strong className="font-mono text-stone-800">8 / 8</strong>
          </div>
        </div>

        {/* Horizontal Visual Timeline Bar (Step sequence) */}
        <div className="relative">
          <div className="hidden lg:flex items-center justify-between relative mb-6 before:absolute before:top-4 before:left-6 before:right-6 before:h-0.5 before:bg-stone-200 before:-z-0">
            {batch.supplyChain.map((stage) => {
              const isFlagged = stage.status === 'flagged';
              const isQuarantined = stage.status === 'quarantined';
              const isSelected = selectedStage?.stepNumber === stage.stepNumber;

              return (
                <button
                  key={stage.stepNumber}
                  onClick={() => setSelectedStage(stage)}
                  className="flex flex-col items-center group relative z-10 cursor-pointer"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isSelected
                        ? 'ring-4 ring-emerald-500/20 scale-110 shadow-sm'
                        : ''
                    } ${
                      isQuarantined
                        ? 'bg-rose-600 text-white'
                        : isFlagged
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-700 text-white group-hover:bg-emerald-800'
                    }`}
                  >
                    {stage.stepNumber}
                  </div>
                  <span className="text-[11px] font-semibold text-stone-800 mt-2 max-w-[100px] text-center leading-tight">
                    {stage.title}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono mt-0.5">
                    {stage.timestamp.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Vertical Stages List */}
          <div className="space-y-4">
            {batch.supplyChain.map((stage) => {
              const isFlagged = stage.status === 'flagged';
              const isQuarantined = stage.status === 'quarantined';
              const isSelected = selectedStage?.stepNumber === stage.stepNumber;

              return (
                <div
                  key={stage.stepNumber}
                  onClick={() => setSelectedStage(stage)}
                  className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-600/10 bg-emerald-50/20'
                      : isQuarantined
                      ? 'border-rose-300 bg-rose-50/30 hover:bg-rose-50/60'
                      : isFlagged
                      ? 'border-amber-300 bg-amber-50/30 hover:bg-amber-50/60'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start sm:items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isQuarantined
                            ? 'bg-rose-600 text-white'
                            : isFlagged
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-700 text-white'
                        }`}
                      >
                        {stage.stepNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-stone-900">{stage.title}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isQuarantined
                                ? 'bg-rose-100 text-rose-800'
                                : isFlagged
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {stage.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5 flex flex-wrap items-center gap-2">
                          <span>{stage.location}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-stone-700">{stage.facilityOrVehicle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs shrink-0 pl-10 sm:pl-0">
                      {stage.temperatureMonitoring && (
                        <div className="flex items-center gap-1 text-stone-600 font-mono bg-stone-100 px-2.5 py-1 rounded">
                          <Thermometer className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{stage.temperatureMonitoring}</span>
                        </div>
                      )}
                      <div className="text-stone-500 font-mono">{stage.timestamp}</div>
                    </div>
                  </div>

                  {/* Inspector notes & operator */}
                  <div className="mt-3 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="text-stone-600 italic">
                      &quot;{stage.notes}&quot;
                    </div>
                    <div className="text-stone-500 shrink-0 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                      <span>Certified Operator: <strong>{stage.operatorOrInspector}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION F: FOOD SAFETY & CONTAMINATION REPORTS ---------------- */}
      <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-6 sm:p-7 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              <span>ISO/IEC 17025 Accredited Laboratory Findings</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 mt-0.5">
              Food Safety & Contamination Test Results
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                isSafe
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : isWarning
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-rose-50 text-rose-900 border-rose-300'
              }`}
            >
              Overall: {batch.safetyReport.overallSafetyStatus}
            </span>
          </div>
        </div>

        {/* Laboratory Credentials Header */}
        <div className="bg-stone-50/70 p-4 sm:p-6 border-b border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-stone-400 font-medium">Testing Laboratory</div>
            <div className="font-bold text-stone-900 mt-0.5">{batch.safetyReport.laboratory.name}</div>
          </div>
          <div>
            <div className="text-stone-400 font-medium">Accreditation Standard</div>
            <div className="font-semibold text-stone-800 mt-0.5">{batch.safetyReport.laboratory.accreditation}</div>
          </div>
          <div>
            <div className="text-stone-400 font-medium">Certificate Ref ID</div>
            <div className="font-mono font-bold text-stone-900 mt-0.5">{batch.safetyReport.certificateNumber}</div>
          </div>
          <div>
            <div className="text-stone-400 font-medium">Chief Analyst</div>
            <div className="font-semibold text-stone-800 mt-0.5">{batch.safetyReport.laboratory.chiefAnalyst}</div>
          </div>
        </div>

        {/* Tabbed Test Categories */}
        <div className="border-b border-stone-200 bg-stone-100/50 px-6 py-2.5 flex items-center gap-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveReportTab('microbial')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeReportTab === 'microbial'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Microbial Pathogens ({batch.safetyReport.microbialTests.length})
          </button>
          <button
            onClick={() => setActiveReportTab('chemical')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeReportTab === 'chemical'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Chemical Residues & Mycotoxins ({batch.safetyReport.chemicalResidues.length})
          </button>
          <button
            onClick={() => setActiveReportTab('metals')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeReportTab === 'metals'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Heavy Metals Screen ({batch.safetyReport.heavyMetals.length})
          </button>
          <button
            onClick={() => setActiveReportTab('physical')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeReportTab === 'physical'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Physical & Organoleptic Integrity
          </button>
        </div>

        {/* Tab Content Tables */}
        <div className="p-6">
          {activeReportTab === 'microbial' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-stone-400 font-semibold uppercase tracking-wider border-b border-stone-200 pb-2">
                  <tr>
                    <th className="py-2.5 px-3">Pathogen / Indicator</th>
                    <th className="py-2.5 px-3">Test Result</th>
                    <th className="py-2.5 px-3">Statutory Regulatory Limit</th>
                    <th className="py-2.5 px-3 text-right">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {batch.safetyReport.microbialTests.map((t, idx) => (
                    <tr key={idx} className={t.status === 'Failed' ? 'bg-rose-50/60 font-semibold' : ''}>
                      <td className="py-2.5 px-3 font-medium text-stone-900">{t.pathogen}</td>
                      <td className="py-2.5 px-3 font-mono font-bold">{t.result}</td>
                      <td className="py-2.5 px-3 text-stone-600">{t.standardRequirement}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            t.status === 'Pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeReportTab === 'chemical' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-stone-400 font-semibold uppercase tracking-wider border-b border-stone-200 pb-2">
                  <tr>
                    <th className="py-2.5 px-3">Compound / Analyte</th>
                    <th className="py-2.5 px-3">Detected Concentration</th>
                    <th className="py-2.5 px-3">Max Allowable Residue Limit (MRL)</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {batch.safetyReport.chemicalResidues.map((c, idx) => (
                    <tr
                      key={idx}
                      className={
                        c.status === 'Exceeded'
                          ? 'bg-rose-50/60 font-semibold'
                          : c.status === 'Trace (Monitor)'
                          ? 'bg-amber-50/60 font-medium'
                          : ''
                      }
                    >
                      <td className="py-2.5 px-3 font-medium text-stone-900">{c.substance}</td>
                      <td className="py-2.5 px-3 font-mono font-bold">{c.detectedValue}</td>
                      <td className="py-2.5 px-3 text-stone-600">{c.maxAllowableLimit}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            c.status === 'Pass'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'Trace (Monitor)'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeReportTab === 'metals' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-stone-400 font-semibold uppercase tracking-wider border-b border-stone-200 pb-2">
                  <tr>
                    <th className="py-2.5 px-3">Toxic Metal</th>
                    <th className="py-2.5 px-3">Detected Level</th>
                    <th className="py-2.5 px-3">Codex Alimentarius Limit</th>
                    <th className="py-2.5 px-3 text-right">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {batch.safetyReport.heavyMetals.map((m, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-medium text-stone-900">{m.metal}</td>
                      <td className="py-2.5 px-3 font-mono font-bold">{m.detected}</td>
                      <td className="py-2.5 px-3 text-stone-600">{m.limit}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeReportTab === 'physical' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-400 font-semibold mb-1">Particulate & Foreign Body Inspection</div>
                <div className="font-medium text-stone-900 leading-relaxed">
                  {batch.safetyReport.physicalInspection.foreignParticles}
                </div>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-400 font-semibold mb-1">Organoleptic (Color & Odour) Profile</div>
                <div className="font-medium text-stone-900 leading-relaxed">
                  {batch.safetyReport.physicalInspection.colorAndOdour}
                </div>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-stone-400 font-semibold mb-1">Packaging Hermetic Seal Integrity</div>
                <div className="font-medium text-stone-900 leading-relaxed">
                  {batch.safetyReport.physicalInspection.packagingIntegrity}
                </div>
              </div>
            </div>
          )}

          {/* Expert Analyst Recommendation */}
          <div className="mt-6 pt-5 border-t border-stone-200 flex items-start gap-3 text-xs bg-stone-50 p-4 rounded-xl">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-stone-900 mb-0.5">Laboratory Executive Directive:</div>
              <p className="text-stone-700 leading-relaxed">{batch.safetyReport.recommendations}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- OFFICIAL SAFETY CERTIFICATE MODAL ---------------- */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none">
            {/* Certificate Header */}
            <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                    Official Certificate of Analysis & Safety Compliance
                  </div>
                  <h2 className="text-xl font-extrabold text-stone-900">Food Safety Verification Dossier</h2>
                  <div className="text-xs text-stone-500 font-mono">
                    Accreditation: {batch.safetyReport.laboratory.accreditation}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-md no-print cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Content Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="text-stone-400 font-medium">Product Name</div>
                <div className="font-bold text-stone-900 mt-0.5">{batch.productName}</div>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="text-stone-400 font-medium">Batch Number</div>
                <div className="font-mono font-bold text-emerald-900 mt-0.5">{batch.batchId}</div>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="text-stone-400 font-medium">Certificate Ref</div>
                <div className="font-mono font-bold text-stone-900 mt-0.5">{batch.safetyReport.certificateNumber}</div>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="text-stone-400 font-medium">Date of Testing</div>
                <div className="font-mono font-bold text-stone-900 mt-0.5">{batch.safetyReport.testingDate}</div>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="text-stone-400 font-medium">Overall Determination</div>
                <div className="font-bold text-stone-900 mt-0.5">{batch.safetyReport.overallSafetyStatus}</div>
              </div>
              <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                <div className="text-stone-400 font-medium">Testing Authority</div>
                <div className="font-semibold text-stone-900 mt-0.5">{batch.safetyReport.laboratory.name}</div>
              </div>
            </div>

            {/* Summary Findings */}
            <div className="border border-stone-200 rounded-xl p-4 text-xs space-y-3">
              <div className="font-bold text-stone-900 text-sm">Summary of Laboratory Findings:</div>
              <p className="text-stone-700 leading-relaxed">{batch.safetyReport.recommendations}</p>
              {batch.safetyReport.detectedContaminants.length > 0 && (
                <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 text-rose-900">
                  <div className="font-bold">Detected Anomalies / Contaminants:</div>
                  <ul className="list-disc list-inside mt-1">
                    {batch.safetyReport.detectedContaminants.map((dc, idx) => (
                      <li key={idx}>{dc}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Signatures & Seal */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-mono font-bold text-stone-900">
                  Digitally Certified by: {batch.safetyReport.laboratory.chiefAnalyst}
                </div>
                <div className="text-stone-500 font-mono text-[11px]">
                  Sign Hash: SHA-256:{batch.batchId.toLowerCase()}99402ab84ce22
                </div>
              </div>
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold hover:bg-emerald-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold hover:bg-stone-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
