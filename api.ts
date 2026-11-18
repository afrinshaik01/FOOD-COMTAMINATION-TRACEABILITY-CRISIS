import { FoodProductBatch, DashboardStats, AuditLog, AdminUser, SafetyStatus } from '../types/foodTrace';
import { INITIAL_BATCHES, INITIAL_AUDIT_LOGS } from '../data/sampleBatches';

const LOCAL_STORAGE_KEY_BATCHES = 'foodtrace_batches_v1';
const LOCAL_STORAGE_KEY_LOGS = 'foodtrace_logs_v1';
const LOCAL_STORAGE_KEY_USER = 'foodtrace_current_user_v1';

// In-memory fallback if localStorage not accessible
let memoryBatches: FoodProductBatch[] = [...INITIAL_BATCHES];
let memoryLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];

function getLocalBatches(): FoodProductBatch[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_BATCHES);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_STORAGE_KEY_BATCHES, JSON.stringify(INITIAL_BATCHES));
    return INITIAL_BATCHES;
  } catch (e) {
    return memoryBatches;
  }
}

function saveLocalBatches(batches: FoodProductBatch[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_BATCHES, JSON.stringify(batches));
  } catch (e) {
    memoryBatches = batches;
  }
}

function getLocalLogs(): AuditLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_LOGS);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  } catch (e) {
    return memoryLogs;
  }
}

function saveLocalLogs(logs: AuditLog[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (e) {
    memoryLogs = logs;
  }
}

export function getCurrentUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function saveCurrentUser(user: AdminUser | null) {
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    }
  } catch (e) {
    // ignore
  }
}

// Compute client-side stats
function computeLocalStats(batches: FoodProductBatch[]): DashboardStats {
  const totalBatches = batches.length;
  const uniqueProducts = new Set(batches.map((b) => b.productName)).size;
  const safeCount = batches.filter((b) => b.status === 'safe').length;
  const warningCount = batches.filter((b) => b.status === 'warning').length;
  const contaminatedCount = batches.filter((b) => b.status === 'contaminated').length;
  const activeRecalls = batches.filter((b) => b.isRecalled).length;

  const categoryMap: Record<string, { safe: number; warning: number; contaminated: number }> = {};
  batches.forEach((b) => {
    const cat = b.category || 'Other';
    if (!categoryMap[cat]) categoryMap[cat] = { safe: 0, warning: 0, contaminated: 0 };
    if (b.status === 'safe') categoryMap[cat].safe++;
    else if (b.status === 'warning') categoryMap[cat].warning++;
    else if (b.status === 'contaminated') categoryMap[cat].contaminated++;
  });

  const categoryBreakdown = Object.entries(categoryMap).map(([name, counts]) => ({
    name,
    ...counts,
  }));

  const recentAlerts = batches
    .filter((b) => b.status !== 'safe')
    .map((b) => ({
      batchId: b.batchId,
      productName: b.productName,
      status: b.status,
      reason:
        b.status === 'contaminated'
          ? b.safetyReport?.detectedContaminants?.[0] || 'Contamination Detected'
          : b.safetyReport?.detectedContaminants?.[0] || 'Secondary testing required',
      date: b.lastUpdated || b.mfgDate,
      severity: b.isRecalled ? 'Class I Recall' : 'Warning Advisory',
    }));

  const monthlyTrends = [
    { month: 'Jun', tested: 120, safe: 118, flagged: 2 },
    { month: 'Jul', tested: 145, safe: 142, flagged: 3 },
    { month: 'Aug', tested: 160, safe: 156, flagged: 4 },
    { month: 'Sep', tested: 175, safe: 171, flagged: 4 },
    { month: 'Oct', tested: 190, safe: 185, flagged: 5 },
    { month: 'Nov', tested: 130, safe: 127, flagged: 3 },
  ];

  return {
    totalProducts: uniqueProducts,
    totalBatches,
    safeCount,
    warningCount,
    contaminatedCount,
    activeRecalls,
    recentAlerts,
    categoryBreakdown,
    monthlyTrends,
  };
}

export const foodTraceApi = {
  async getAllBatches(): Promise<FoodProductBatch[]> {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      // Backend request fallback to local store
    }
    return getLocalBatches();
  },

  async trackBatch(batchId: string): Promise<FoodProductBatch | null> {
    const cleanId = batchId.trim().toUpperCase();
    try {
      const res = await fetch(`/api/track/${encodeURIComponent(cleanId)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      // fallback
    }

    const localList = getLocalBatches();
    const found = localList.find(
      (b) =>
        b.batchId.toUpperCase() === cleanId ||
        b.id.toUpperCase() === cleanId ||
        b.batchId.replace(/[^A-Z0-9]/g, '') === cleanId.replace(/[^A-Z0-9]/g, '')
    );
    return found || null;
  },

  async getStats(): Promise<DashboardStats> {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      // fallback
    }
    return computeLocalStats(getLocalBatches());
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      // fallback
    }
    return getLocalLogs();
  },

  async createBatch(batchData: Partial<FoodProductBatch>, actorName = 'Admin', role = 'Chief Food Safety Officer'): Promise<FoodProductBatch> {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...batchData, actor: actorName, role }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      // fallback
    }

    const localList = getLocalBatches();
    const newId = batchData.batchId || `FT2026${String(localList.length + 1).padStart(3, '0')}`;
    const newBatch = {
      ...(INITIAL_BATCHES[0]),
      ...batchData,
      id: 'batch-' + Date.now(),
      batchId: newId,
      status: batchData.status || 'safe',
      isRecalled: batchData.status === 'contaminated',
      lastUpdated: new Date().toISOString(),
    } as FoodProductBatch;

    localList.unshift(newBatch);
    saveLocalBatches(localList);

    const logs = getLocalLogs();
    logs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      batchId: newBatch.batchId,
      action: 'NEW PRODUCT BATCH CREATED',
      actor: actorName,
      role,
      details: `Created batch ${newBatch.batchId} (${newBatch.productName}) with status ${newBatch.status.toUpperCase()}.`,
    });
    saveLocalLogs(logs);

    return newBatch;
  },

  async updateBatchStatus(batchId: string, newStatus: SafetyStatus, notes?: string, actor = 'Safety Officer'): Promise<FoodProductBatch> {
    try {
      const res = await fetch(`/api/batches/${batchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes, actor }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      // fallback
    }

    const localList = getLocalBatches();
    const idx = localList.findIndex((b) => b.batchId.toUpperCase() === batchId.toUpperCase());
    if (idx !== -1) {
      localList[idx].status = newStatus;
      if (newStatus === 'contaminated') localList[idx].isRecalled = true;
      localList[idx].lastUpdated = new Date().toISOString();
      saveLocalBatches(localList);

      const logs = getLocalLogs();
      logs.unshift({
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        batchId: batchId.toUpperCase(),
        action: 'STATUS UPDATED',
        actor,
        role: 'Quality Control Specialist',
        details: `Status set to ${newStatus.toUpperCase()}.${notes ? ' Note: ' + notes : ''}`,
      });
      saveLocalLogs(logs);
      return localList[idx];
    }
    throw new Error('Batch not found');
  },

  async issueRecall(batchId: string, recallData: any, actor = 'Chief Food Safety Officer'): Promise<FoodProductBatch> {
    try {
      const res = await fetch(`/api/batches/${batchId}/recall`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recallNotice: recallData, actor, role: 'Chief Food Safety Officer' }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      // fallback
    }

    const localList = getLocalBatches();
    const idx = localList.findIndex((b) => b.batchId.toUpperCase() === batchId.toUpperCase());
    if (idx !== -1) {
      localList[idx].status = 'contaminated';
      localList[idx].isRecalled = true;
      localList[idx].recallNotice = recallData;
      localList[idx].lastUpdated = new Date().toISOString();
      saveLocalBatches(localList);

      const logs = getLocalLogs();
      logs.unshift({
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        batchId: batchId.toUpperCase(),
        action: 'EMERGENCY RECALL ISSUED',
        actor,
        role: 'Chief Food Safety Officer',
        details: `Class I Recall initiated for ${batchId}. Contaminant: ${recallData.contaminationType}.`,
      });
      saveLocalLogs(logs);
      return localList[idx];
    }
    throw new Error('Batch not found');
  },

  async resetData(): Promise<void> {
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (e) {
      // fallback
    }
    saveLocalBatches(INITIAL_BATCHES);
    saveLocalLogs(INITIAL_AUDIT_LOGS);
  },
};
