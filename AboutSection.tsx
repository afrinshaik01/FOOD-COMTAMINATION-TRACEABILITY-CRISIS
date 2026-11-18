import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Building, Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Section */}
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
          <span>Our Mission & Standards</span>
          <span aria-hidden="true">·</span>
          <span>Zero Compromise on Public Health</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
          FoodTrace – Food Safety & Traceability Management
        </h1>
        <p className="text-base text-stone-600 mt-4 leading-relaxed">
          FoodTrace is an interoperable food contamination detection and supply chain tracking platform. We connect agricultural producers, cold-storage carriers, manufacturing factories, certified testing laboratories, and supermarkets into a unified chain of custody.
        </p>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-stone-900">Farm-to-Fork Integrity</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every product batch is tracked with an immutable identifier that maps raw soil coordinates, harvest dates, and temperature history.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-stone-900">Rapid Anomaly Isolation</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            When chemical residues or microbial pathogens are flagged, affected batch lots are quarantined within minutes, preventing nationwide exposure.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-stone-900">Consumer Sovereignty</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Consumers can scan or type the batch number on any package to verify lab reports and ensure genuine, untainted nutritional safety.
          </p>
        </div>
      </div>

      {/* Regulatory Alignment Box */}
      <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-10">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
            International Compliance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Accredited Testing & Strict Analytical Protocols
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            All screening tests are executed in partnership with ISO/IEC 17025 accredited laboratories. We enforce strict test requirements for chemical residues, heavy metal contaminants, aflatoxins, salmonella, listeria, and high-pressure microbial inactivation.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xl font-bold text-stone-900">Contact FoodTrace Authorities</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Have questions about an ongoing food safety recall, batch inquiry, or manufacturer onboarding? Our regulatory compliance desk is available 24/7.
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center gap-3 text-stone-700">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>compliance@foodtrace.org</span>
            </div>
            <div className="flex items-center gap-3 text-stone-700">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>1-800-555-FOOD-RECALL (Toll-Free, 24/7)</span>
            </div>
            <div className="flex items-center gap-3 text-stone-700">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>National Food Safety Agency, Washington DC & Geneva</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
          <h4 className="text-sm font-bold text-stone-900 mb-4">Send a Safety or Verification Query</h4>
          {contactSubmitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs space-y-1">
              <div className="font-bold">Thank you for your message!</div>
              <p>Your inquiry has been logged in the FoodTrace compliance inbox. A safety analyst will respond within 4 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Dr. Emily Harris"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="e.g. emily@foodhealth.org"
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subject / Query Type</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="e.g. Batch Inquiry or Manufacturer Integration"
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Message Details *</label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Describe your inquiry, batch number (if relevant), or concern..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Submit Query</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
