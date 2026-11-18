import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  FileSpreadsheet,
  History,
  CheckCircle2,
  AlertOctagon,
  Building,
  FlaskConical,
  X,
  FileCheck,
  ArrowUpRight
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { FoodProductBatch, DashboardStats, AuditLog, AdminUser, SafetyStatus } from '../types/foodTrace';

interface AdminDashboardProps {
  stats: DashboardStats;
  batches: FoodProductBatch[];
  auditLogs: AuditLog[];
  currentUser: AdminUser | null;
  onSelectBatch: (batchId: string) => void;
  onCreateBatch: (batchData: Partial<FoodProductBatch>) => Promise<void>;
  onUpdateStatus: (batchId: string, status: SafetyStatus, notes?: string) => Promise<void>;
  onIssueRecall: (batchId: string, recallData: any) => Promise<void>;
  onResetData: () => Promise<void>;
  onOpenLogin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  batches,
  auditLogs,
  currentUser,
  onSelectBatch,
  onCreateBatch,
  onUpdateStatus,
  onIssueRecall,
  onResetData,
  onOpenLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'batches' | 'logs' | 'alerts'>('batches');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'warning' | 'contaminated'>('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [selectedBatchForRecall, setSelectedBatchForRecall] = useState<FoodProductBatch | null>(null);

  // Form state for new batch
  const [newProductName, setNewProductName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newCategory, setNewCategory] = useState('Dairy');
  const [newBatchId, setNewBatchId] = useState('');
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmerName, setNewFarmerName] = useState('');
  const [newCountry, setNewCountry] = useState('United States');
  const [newStatus, setNewStatus] = useState<SafetyStatus>('safe');

  // Form state for recall
  const [recallContaminant, setRecallContaminant] = useState('');
  const [recallIngredient, setRecallIngredient] = useState('');
  const [recallSeverity, setRecallSeverity] = useState<'Class I (High Risk)' | 'Class II (Medium Risk)' | 'Class III (Low Risk)'>('Class I (High Risk)');
  const [recallLocations, setRecallLocations] = useState('');
  const [recallActions, setRecallActions] = useState('');

  // Auto-generate unique batch ID helper
  const generateNewBatchId = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setNewBatchId(`FT2026${randomNum}`);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const finalBatchId = newBatchId.trim() || `FT2026${Math.floor(100 + Math.random() * 900)}`;

    await onCreateBatch({
      batchId: finalBatchId,
      productName: newProductName.trim(),
      brandName: newBrandName.trim() || 'Verdant Organics',
      category: newCategory,
      status: newStatus,
      origin: {
        country: newCountry,
        state: 'Origin State',
        district: 'Regional District',
        farmName: newFarmName.trim() || 'Valley Agro Co-op',
        farmerDetails: {
          name: newFarmerName.trim() || 'Lead Organic Farmer',
          contactOrId: `FARM-ID-${Math.floor(1000 + Math.random() * 9000)}`,
          certification: 'USDA Organic / GlobalGAP Assured',
          sustainablePractice: 'Integrated pest management and sustainable crop rotation',
        },
        collectionDate: new Date().toISOString(),
        sourceLocation: 'Registered Farmland Zone A',
      },
      imageUrl: '/src/assets/images/product_pure_milk_1794004309309.jpg',
    });

    setShowAddModal(false);
    setNewProductName('');
    setNewBrandName('');
    setNewBatchId('');
    setNewFarmName('');
    setNewFarmerName('');
  };

  const handleOpenRecall = (batch: FoodProductBatch) => {
    setSelectedBatchForRecall(batch);
    setRecallIngredient(batch.ingredients[0]?.name || 'Primary raw harvest component');
    setRecallContaminant('Microbiological or chemical residue exceeding statutory maximum tolerance');
    setRecallLocations('Central Distribution Depot, Regional Supermarket Chains');
    setRecallActions('Immediately halt sale; pull inventory from retail shelves; issue customer notification');
    setShowRecallModal(true);
  };

  const handleRecallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForRecall) return;

    await onIssueRecall(selectedBatchForRecall.batchId, {
      severity: recallSeverity,
      alertDate: new Date().toISOString(),
      contaminationType: 'Microbiological',
      contaminatedIngredient: recallIngredient,
      affectedLots: [selectedBatchForRecall.batchId],
      affectedLocations: recallLocations.split(',').map((l) => l.trim()),
      consumerActions: recallActions.split(';').map((a) => a.trim()),
      authorityHelpline: '1-800-555-FOOD-RECALL',
      reportingAgency: 'National Food Safety & Traceability Authority',
    });

    setShowRecallModal(false);
    setSelectedBatchForRecall(null);
  };

  // Filter batches
  const filteredBatches = batches.filter((b) => {
    const matchSearch =
      b.batchId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.productName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.brandName.toLowerCase().includes(searchFilter.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Recharts data
  const statusPieData = [
    { name: 'Safe', value: stats.safeCount, color: '#10b981' },
    { name: 'Warning', value: stats.warningCount, color: '#f59e0b' },
    { name: 'Contaminated / Recall', value: stats.contaminatedCount, color: '#f43f5e' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Control Zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>Regulatory & Manufacturer Console</span>
            <span aria-hidden="true">·</span>
            <span>Food Traceability Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
            Food Safety & Traceability Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Logged in as:</span>
              <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {currentUser.role}
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Sign In as Safety Officer
            </button>
          )}

          <button
            onClick={() => {
              generateNewBatchId();
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Food Product</span>
          </button>

          <button
            onClick={onResetData}
            title="Reset to 5 rich demo products"
            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200 bg-white cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ---------------- 6 KEY METRICS STRIP ---------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-stone-400 text-xs font-medium">Total Products</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1 tabular-nums">
            {stats.totalProducts}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Distinct SKUs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="text-stone-400 text-xs font-medium">Total Batches</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1 tabular-nums font-mono">
            {stats.totalBatches}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">Unique lots logged</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <div className="text-emerald-700 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Safe Batches</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 mt-1 tabular-nums font-mono">
            {stats.safeCount}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">
            {Math.round((stats.safeCount / (stats.totalBatches || 1)) * 100)}% Pass Rate
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs bg-amber-50/20">
          <div className="text-amber-800 text-xs font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Under Review</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1 tabular-nums font-mono">
            {stats.warningCount}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">Secondary verification</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-xs bg-rose-50/20">
          <div className="text-rose-700 text-xs font-semibold flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            <span>Contaminated</span>
          </div>
          <div className="text-2xl font-extrabold text-rose-900 mt-1 tabular-nums font-mono">
            {stats.contaminatedCount}
          </div>
          <div className="text-[11px] text-rose-700 mt-0.5">Failed safety tests</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-300 shadow-xs bg-rose-50/40">
          <div className="text-rose-800 text-xs font-bold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Active Recalls</span>
          </div>
          <div className="text-2xl font-extrabold text-rose-950 mt-1 tabular-nums font-mono">
            {stats.activeRecalls}
          </div>
          <div className="text-[11px] text-rose-800 mt-0.5">Class I Action</div>
        </div>
      </div>

      {/* ---------------- SECTION 4: CHARTS GRID ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Safety Distribution Donut */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Batch Safety Distribution</h3>
            <p className="text-xs text-stone-500 mt-0.5">Compliance breakdown across active inventory</p>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} Batches`, 'Count']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around text-xs pt-3 border-t border-stone-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-stone-600">Safe ({stats.safeCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-stone-600">Warning ({stats.warningCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-stone-600">Recalled ({stats.contaminatedCount})</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Inspection & Contamination Trend Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Inspection & Testing Volume Trend</h3>
              <p className="text-xs text-stone-500 mt-0.5">Total lab screenings vs flagged batches (6-month period)</p>
            </div>
            <div className="text-xs text-stone-500 font-mono">ISO 17025 Analytics</div>
          </div>

          <div className="h-56 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFlagged" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="tested" name="Total Tested" stroke="#047857" fillOpacity={1} fill="url(#colorTested)" />
                <Area type="monotone" dataKey="flagged" name="Contaminants Flagged" stroke="#e11d48" fillOpacity={1} fill="url(#colorFlagged)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 flex items-center justify-between">
            <span>Historical baseline: 97.4% overall compliance</span>
            <span>Automated alert triggering enabled</span>
          </div>
        </div>
      </div>

      {/* ---------------- MAIN MANAGEMENT TABS & WORKSPACE ---------------- */}
      <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {/* Segmented Tab Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
            <button
              onClick={() => setActiveTab('batches')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'batches' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Food Batches & Products ({batches.length})
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts' ? 'bg-white text-rose-900 shadow-xs font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Contamination Alerts</span>
              {stats.contaminatedCount + stats.warningCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'logs' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Audit Trail ({auditLogs.length})
            </button>
          </div>

          {/* Search & Filter inside Batches Tab */}
          {activeTab === 'batches' && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter batches..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 w-44 sm:w-56"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="safe">Safe Only</option>
                <option value="warning">Warning Only</option>
                <option value="contaminated">Contaminated Only</option>
              </select>
            </div>
          )}
        </div>

        {/* TAB 1: BATCHES LIST */}
        {activeTab === 'batches' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Source Farm & Origin</th>
                  <th className="py-3 px-4">Mfg / Expiry</th>
                  <th className="py-3 px-4">Safety Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredBatches.map((batch) => {
                  const isSafe = batch.status === 'safe';
                  const isContaminated = batch.status === 'contaminated';
                  const isWarning = batch.status === 'warning';

                  return (
                    <tr
                      key={batch.batchId}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        isContaminated ? 'bg-rose-50/40' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        <button
                          onClick={() => onSelectBatch(batch.batchId)}
                          className="hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{batch.batchId}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-60" />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{batch.productName}</div>
                        <div className="text-[11px] text-stone-500">{batch.brandName}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-700">{batch.category}</td>
                      <td className="py-3 px-4">
                        <div>{batch.origin.farmName}</div>
                        <div className="text-[11px] text-stone-500">{batch.origin.country}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-600">
                        <div>{batch.mfgDate}</div>
                        <div className="text-[10px] text-stone-400">Exp: {batch.expiryDate}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            isSafe
                              ? 'bg-emerald-100 text-emerald-800'
                              : isWarning
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isSafe ? 'Safe' : isWarning ? 'Warning' : 'Recall Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick change status dropdown */}
                          <select
                            value={batch.status}
                            onChange={(e) => onUpdateStatus(batch.batchId, e.target.value as SafetyStatus)}
                            className="text-[11px] bg-white border border-stone-200 rounded px-1.5 py-1 text-stone-700 focus:outline-none cursor-pointer"
                          >
                            <option value="safe">Mark Safe</option>
                            <option value="warning">Set Warning</option>
                            <option value="contaminated">Flag Contaminated</option>
                          </select>

                          {/* Issue Recall Button */}
                          {!batch.isRecalled ? (
                            <button
                              onClick={() => handleOpenRecall(batch)}
                              className="px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded cursor-pointer"
                            >
                              Issue Recall
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-2 py-1 rounded">
                              Recalled
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: CONTAMINATION ALERTS FEED */}
        {activeTab === 'alerts' && (
          <div className="p-6 space-y-4">
            {stats.recentAlerts.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                No active contamination alerts or recall orders at this time. All tested lots within limits.
              </div>
            ) : (
              stats.recentAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    alert.status === 'contaminated'
                      ? 'bg-rose-50/70 border-rose-300 text-rose-950'
                      : 'bg-amber-50/70 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        alert.status === 'contaminated' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                      }`}
                    >
                      {alert.status === 'contaminated' ? (
                        <ShieldAlert className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm">{alert.batchId}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold">{alert.productName}</span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            alert.status === 'contaminated' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 mt-1">{alert.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-11 sm:pl-0">
                    <button
                      onClick={() => onSelectBatch(alert.batchId)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 text-stone-800 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      View Full Dossier
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: AUDIT LOGS TABLE */}
        {activeTab === 'logs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Batch ID</th>
                  <th className="py-3 px-4">Officer / Inspector</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-mono text-stone-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-900 whitespace-nowrap">
                      {log.batchId}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-stone-900">{log.actor}</div>
                      <div className="text-[11px] text-stone-500">{log.role}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-md">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---------------- MODAL 1: ADD NEW FOOD PRODUCT BATCH ---------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-stone-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Add New Food Product & Batch</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="e.g. Organic Raw Honey"
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="e.g. Pure Meadow Naturals"
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Unique Batch ID</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newBatchId}
                      onChange={(e) => setNewBatchId(e.target.value)}
                      placeholder="e.g. FT2026119"
                      className="w-full p-2 font-mono font-bold bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={generateNewBatchId}
                      className="p-2 text-stone-500 hover:text-stone-900 bg-stone-100 rounded-lg cursor-pointer shrink-0"
                      title="Generate ID"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Dairy">Dairy</option>
                    <option value="Grains & Cereals">Grains & Cereals</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Oils & Fats">Oils & Fats</option>
                    <option value="Baked Goods">Baked Goods</option>
                    <option value="Produce & Fruits">Produce & Fruits</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Initial Safety Status</label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none cursor-pointer"
                  >
                    <option value="safe">Safe (Passed)</option>
                    <option value="warning">Warning (Hold)</option>
                    <option value="contaminated">Contaminated (Recall)</option>
                  </select>
                </div>
              </div>

              {/* Farm & Origin details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Farm / Estate Name</label>
                  <input
                    type="text"
                    value={newFarmName}
                    onChange={(e) => setNewFarmName(e.target.value)}
                    placeholder="e.g. Blue Ridge Bee Sanctuary"
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Farmer / Producer</label>
                  <input
                    type="text"
                    value={newFarmerName}
                    onChange={(e) => setNewFarmerName(e.target.value)}
                    placeholder="e.g. Thomas Higgins"
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Country of Origin</label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    placeholder="e.g. United States"
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-lg hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 text-white font-semibold rounded-lg hover:bg-emerald-900 cursor-pointer"
                >
                  Register Batch & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: ISSUE IMMEDIATE RECALL ALERT ---------------- */}
      {showRecallModal && selectedBatchForRecall && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl border-2 border-rose-500 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-rose-950">Issue Emergency Product Recall</h3>
              </div>
              <button
                onClick={() => setShowRecallModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 text-xs text-rose-900">
              Target Batch: <strong className="font-mono">{selectedBatchForRecall.batchId}</strong> ({selectedBatchForRecall.productName}). This will immediately broadcast a contamination warning and update public verification status.
            </div>

            <form onSubmit={handleRecallSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Recall Severity Class</label>
                <select
                  value={recallSeverity}
                  onChange={(e: any) => setRecallSeverity(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-rose-600 focus:outline-none"
                >
                  <option value="Class I (High Risk)">Class I (High Risk — Dangerous Health Hazard)</option>
                  <option value="Class II (Medium Risk)">Class II (Medium Risk — Temporary Health Hazard)</option>
                  <option value="Class III (Low Risk)">Class III (Low Risk — Regulatory Violation)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Contaminant / Anomaly Description *</label>
                <input
                  type="text"
                  required
                  value={recallContaminant}
                  onChange={(e) => setRecallContaminant(e.target.value)}
                  placeholder="e.g. Patulin mycotoxin exceeding 50 ug/kg threshold"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Contaminated Ingredient Source</label>
                <input
                  type="text"
                  value={recallIngredient}
                  onChange={(e) => setRecallIngredient(e.target.value)}
                  placeholder="e.g. Valencia Orange Lot #B44"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Affected Locations (Comma separated)</label>
                <input
                  type="text"
                  value={recallLocations}
                  onChange={(e) => setRecallLocations(e.target.value)}
                  placeholder="e.g. Distribution Center 4, Southeast Retail Hubs"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Recommended Consumer Safety Actions (Semicolon separated)</label>
                <textarea
                  rows={3}
                  value={recallActions}
                  onChange={(e) => setRecallActions(e.target.value)}
                  placeholder="Do not consume; Return to store for 100% refund; Contact physician if symptoms occur"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg focus:border-rose-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecallModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-lg hover:bg-stone-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Publish Emergency Recall Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
