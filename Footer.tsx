import React from 'react';
import { ShieldCheck, PhoneCall, Globe, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'track' | 'reports' | 'dashboard' | 'about') => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLogin }) => {
  return (
    <footer className="bg-white border-t border-stone-200 mt-20 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>FoodTrace</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Food Contamination Detection and Traceability Management System. Ensuring purity, verifiable origins, and zero unverified safety claims from harvest to consumer.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              System Navigation
            </div>
            <ul className="space-y-1.5 text-stone-600">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  Home & Batch Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  Track Product by Batch ID
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('reports')}
                  className="hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  Inspection & Safety Reports
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  Regulatory Dashboard & Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Compliance */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Accredited Standards
            </div>
            <ul className="space-y-1 text-stone-600">
              <li>• ISO/IEC 17025:2017 Testing</li>
              <li>• Codex Alimentarius Norms</li>
              <li>• FDA 21 CFR Grade A Safety</li>
              <li>• EFSA Rapid Alert System (RASFF)</li>
              <li>• GlobalGAP & Organic NPOP</li>
            </ul>
          </div>

          {/* Emergency Helpline & Admin */}
          <div className="space-y-3 text-xs">
            <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Food Safety Helpline
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <div className="font-bold text-stone-900 flex items-center gap-1.5 text-rose-800">
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span>1-800-555-FOOD-RECALL</span>
              </div>
              <p className="text-[11px] text-stone-500">24/7 National Consumer and Retail Hotline</p>
            </div>
            <div>
              <button
                onClick={onOpenLogin}
                className="text-stone-500 hover:text-stone-900 font-semibold cursor-pointer underline text-[11px]"
              >
                Authorized Officer Sign-In
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <div>
            © 2026 FoodTrace – Food Safety & Traceability Management System. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Demonstration Environment</span>
            <span aria-hidden="true">·</span>
            <span>All demo batches calibrated for evaluation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
