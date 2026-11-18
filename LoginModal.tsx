import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Lock, X, CheckCircle2 } from 'lucide-react';
import { AdminUser } from '../types/foodTrace';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AdminUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('officer@foodtrace.gov');
  const [password, setPassword] = useState('FoodSafety@2026');
  const [selectedRole, setSelectedRole] = useState<'Chief Food Safety Officer' | 'Quality Control Specialist' | 'Audit Inspector'>('Chief Food Safety Officer');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: 'admin-' + Math.random().toString(36).substring(2, 8),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: selectedRole,
    });
    onClose();
  };

  const handleQuickRole = (role: 'Chief Food Safety Officer' | 'Quality Control Specialist' | 'Audit Inspector', demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('FoodSafety@2026');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl border border-stone-200 shadow-2xl p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Food Safety Authority Portal</h3>
              <p className="text-xs text-stone-500">Authorized personnel sign-in</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Role Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Quick Demo Sign-In Profiles:
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickRole('Chief Food Safety Officer', 'officer.thorne@foodtrace.gov')}
              className={`p-2 rounded-lg text-left text-xs border transition-colors flex items-center justify-between cursor-pointer ${
                selectedRole === 'Chief Food Safety Officer'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div>
                <div>Chief Food Safety Officer</div>
                <div className="text-[11px] text-stone-500 font-mono">officer.thorne@foodtrace.gov</div>
              </div>
              {selectedRole === 'Chief Food Safety Officer' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('Quality Control Specialist', 'qc.melnyk@foodtrace.gov')}
              className={`p-2 rounded-lg text-left text-xs border transition-colors flex items-center justify-between cursor-pointer ${
                selectedRole === 'Quality Control Specialist'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div>
                <div>Quality Control Specialist</div>
                <div className="text-[11px] text-stone-500 font-mono">qc.melnyk@foodtrace.gov</div>
              </div>
              {selectedRole === 'Quality Control Specialist' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('Audit Inspector', 'inspector.goldberg@foodtrace.gov')}
              className={`p-2 rounded-lg text-left text-xs border transition-colors flex items-center justify-between cursor-pointer ${
                selectedRole === 'Audit Inspector'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <div>
                <div>Import & Audit Inspector</div>
                <div className="text-[11px] text-stone-500 font-mono">inspector.goldberg@foodtrace.gov</div>
              </div>
              {selectedRole === 'Audit Inspector' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs pt-2">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Official Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Credentials / Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-lg hover:bg-stone-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              Enter Console
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
