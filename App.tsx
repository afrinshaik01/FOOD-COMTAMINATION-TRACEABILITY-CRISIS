/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { ProductTracker } from './components/ProductTracker';
import { AdminDashboard } from './components/AdminDashboard';
import { SafetyReportsView } from './components/SafetyReportsView';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { foodTraceApi, getCurrentUser, saveCurrentUser } from './services/api';
import { FoodProductBatch, DashboardStats, AuditLog, AdminUser, SafetyStatus } from './types/foodTrace';
import { Search, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'track' | 'reports' | 'dashboard' | 'about'>('home');
  const [batches, setBatches] = useState<FoodProductBatch[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Tracking state
  const [trackedBatch, setTrackedBatch] = useState<FoodProductBatch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchNotFoundId, setSearchNotFoundId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedBatches, fetchedStats, fetchedLogs] = await Promise.all([
        foodTraceApi.getAllBatches(),
        foodTraceApi.getStats(),
        foodTraceApi.getAuditLogs(),
      ]);
      setBatches(fetchedBatches);
      setStats(fetchedStats);
      setAuditLogs(fetchedLogs);

      // Default tracked batch to the first safe batch if none selected
      if (!trackedBatch && fetchedBatches.length > 0) {
        setTrackedBatch(fetchedBatches[0]);
      }
    } catch (e) {
      console.error('Failed to load food traceability data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUser(getCurrentUser());
    loadData();
  }, []);

  // Handle Search for Batch ID
  const handleSearchBatch = async (id: string) => {
    setSearchQuery(id);
    setIsLoading(true);
    setSearchNotFoundId(null);

    const result = await foodTraceApi.trackBatch(id);
    if (result) {
      setTrackedBatch(result);
      setSearchNotFoundId(null);
      setActiveTab('track');
    } else {
      setTrackedBatch(null);
      setSearchNotFoundId(id);
      setActiveTab('track');
    }
    setIsLoading(false);
  };

  const handleCreateBatch = async (batchData: Partial<FoodProductBatch>) => {
    const newBatch = await foodTraceApi.createBatch(
      batchData,
      currentUser?.name || 'Administrator',
      currentUser?.role || 'Chief Food Safety Officer'
    );
    await loadData();
    setTrackedBatch(newBatch);
  };

  const handleUpdateStatus = async (batchId: string, status: SafetyStatus, notes?: string) => {
    await foodTraceApi.updateBatchStatus(
      batchId,
      status,
      notes,
      currentUser?.name || 'Authorized Officer'
    );
    await loadData();
    if (trackedBatch?.batchId === batchId) {
      const updated = await foodTraceApi.trackBatch(batchId);
      if (updated) setTrackedBatch(updated);
    }
  };

  const handleIssueRecall = async (batchId: string, recallData: any) => {
    await foodTraceApi.issueRecall(
      batchId,
      recallData,
      currentUser?.name || 'Chief Food Safety Officer'
    );
    await loadData();
    if (trackedBatch?.batchId === batchId) {
      const updated = await foodTraceApi.trackBatch(batchId);
      if (updated) setTrackedBatch(updated);
    }
  };

  const handleResetData = async () => {
    await foodTraceApi.resetData();
    await loadData();
    const all = await foodTraceApi.getAllBatches();
    if (all.length > 0) setTrackedBatch(all[0]);
    setSearchNotFoundId(null);
  };

  const handleLogin = (user: AdminUser) => {
    saveCurrentUser(user);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    saveCurrentUser(null);
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onSelectBatch={handleSearchBatch}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div>
            <HeroSearch
              onSearch={handleSearchBatch}
              featuredBatches={batches}
              onSelectBatch={handleSearchBatch}
            />

            {/* Quick Product Showcase on Home */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Registered Food Lots & Verification Status
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Select any sample batch to inspect complete agricultural origin and analytical laboratory reports.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
                >
                  View All Safety Records →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {batches.slice(0, 5).map((b) => {
                  const isSafe = b.status === 'safe';
                  const isContaminated = b.status === 'contaminated';

                  return (
                    <div
                      key={b.batchId}
                      onClick={() => handleSearchBatch(b.batchId)}
                      className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                        isContaminated
                          ? 'border-rose-300 ring-1 ring-rose-200'
                          : !isSafe
                          ? 'border-amber-300 ring-1 ring-amber-200'
                          : 'border-stone-200 hover:border-emerald-500'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                            {b.batchId}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              isContaminated
                                ? 'bg-rose-100 text-rose-800'
                                : !isSafe
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isContaminated ? 'Alert' : !isSafe ? 'Warning' : 'Safe'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{b.productName}</h4>
                        <div className="text-[11px] text-stone-500 mt-0.5">{b.brandName} · {b.category}</div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                        <span>{b.origin.country}</span>
                        <span className="font-semibold text-emerald-800">Inspect →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: TRACK PRODUCT VIEW */}
        {activeTab === 'track' && (
          <div>
            {/* Quick in-page search bar if searching within track view */}
            <div className="bg-stone-100 border-b border-stone-200 py-4 no-print">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) handleSearchBatch(searchQuery.trim());
                  }}
                  className="flex items-center gap-3 max-w-xl"
                >
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter Batch ID (e.g. FT2026001, FT2026003)..."
                      className="w-full pl-9 pr-3 py-2 bg-white text-xs font-mono font-bold uppercase border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    Track
                  </button>
                </form>

                {/* Sample batch quick links */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-stone-500">
                  <span>Samples:</span>
                  {batches.map((b) => (
                    <button
                      key={b.batchId}
                      type="button"
                      onClick={() => handleSearchBatch(b.batchId)}
                      className={`font-mono text-[11px] px-2 py-0.5 rounded border hover:underline cursor-pointer ${
                        b.status === 'contaminated'
                          ? 'border-rose-300 bg-rose-50 text-rose-800'
                          : b.status === 'warning'
                          ? 'border-amber-300 bg-amber-50 text-amber-800'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      {b.batchId} ({b.status})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error state if invalid Batch ID entered */}
            {searchNotFoundId ? (
              <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-stone-900">
                  Batch ID &quot;{searchNotFoundId}&quot; Not Found
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  No verified food traceability records match this Batch ID. Please verify the code printed on the food packaging or choose one of our verified sample batches below.
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
                  {batches.map((b) => (
                    <button
                      key={b.batchId}
                      onClick={() => handleSearchBatch(b.batchId)}
                      className="px-3.5 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono font-bold text-emerald-900 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      Try {b.batchId} ({b.productName.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>
            ) : trackedBatch ? (
              <ProductTracker
                batch={trackedBatch}
                onBackToSearch={() => setActiveTab('home')}
                onSelectAlternativeBatch={handleSearchBatch}
              />
            ) : (
              <div className="text-center py-20 text-stone-500 text-xs">
                Enter a Batch ID above to begin tracking.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAFETY REPORTS */}
        {activeTab === 'reports' && (
          <SafetyReportsView
            batches={batches}
            onSelectBatch={(id) => {
              handleSearchBatch(id);
              setActiveTab('track');
            }}
          />
        )}

        {/* TAB 4: ADMIN DASHBOARD */}
        {activeTab === 'dashboard' && stats && (
          <AdminDashboard
            stats={stats}
            batches={batches}
            auditLogs={auditLogs}
            currentUser={currentUser}
            onSelectBatch={(id) => {
              handleSearchBatch(id);
              setActiveTab('track');
            }}
            onCreateBatch={handleCreateBatch}
            onUpdateStatus={handleUpdateStatus}
            onIssueRecall={handleIssueRecall}
            onResetData={handleResetData}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* TAB 5: ABOUT US & STANDARDS */}
        {activeTab === 'about' && <AboutSection />}
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={setActiveTab}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
