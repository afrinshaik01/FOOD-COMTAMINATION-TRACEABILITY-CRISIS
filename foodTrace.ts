export type SafetyStatus = 'safe' | 'warning' | 'contaminated';

export interface FarmerDetails {
  name: string;
  contactOrId: string;
  certification: string;
  sustainablePractice: string;
}

export interface OriginInfo {
  country: string;
  state: string;
  district: string;
  farmName: string;
  farmerDetails: FarmerDetails;
  collectionDate: string;
  sourceLocation: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Ingredient {
  id: string;
  name: string;
  percentage: string;
  supplierName: string;
  supplierOrigin: string;
  supplierContact: string;
  supplierLotId: string;
  qualityStatus: 'Verified Safe' | 'Under Investigation' | 'Contaminated';
  notes?: string;
}

export interface ManufacturingInfo {
  company: string;
  facilityName: string;
  factoryLocation: string;
  mfgDate: string;
  processingDetails: string;
  packagingDate: string;
  packagingType: string;
  storageConditions: string;
  facilityCertifications: string[];
}

export interface SupplyChainStage {
  stepNumber: number;
  title: string;
  stageKey:
    | 'collection'
    | 'transport_processing'
    | 'intake_inspection'
    | 'manufacturing'
    | 'packaging'
    | 'warehousing'
    | 'distribution'
    | 'retail';
  location: string;
  facilityOrVehicle: string;
  timestamp: string;
  status: 'completed' | 'in_transit' | 'flagged' | 'quarantined';
  temperatureMonitoring?: string;
  operatorOrInspector: string;
  notes: string;
}

export interface ChemicalTest {
  substance: string;
  detectedValue: string;
  maxAllowableLimit: string;
  status: 'Pass' | 'Exceeded' | 'Trace (Monitor)';
}

export interface MicrobialTest {
  pathogen: string;
  result: string;
  standardRequirement: string;
  status: 'Pass' | 'Failed';
}

export interface HeavyMetalTest {
  metal: string;
  detected: string;
  limit: string;
  status: 'Pass' | 'Exceeded';
}

export interface PhysicalInspection {
  foreignParticles: string;
  colorAndOdour: string;
  packagingIntegrity: string;
  status: 'Pass' | 'Failed';
}

export interface LaboratoryInfo {
  name: string;
  accreditation: string;
  licenseNo: string;
  chiefAnalyst: string;
}

export interface SafetyReport {
  overallSafetyStatus: 'Safe' | 'Warning / Further Testing' | 'Contamination Detected / Unsafe';
  inspectionStatus: 'Passed' | 'Under Investigation' | 'Failed - Contamination Found';
  testingDate: string;
  laboratory: LaboratoryInfo;
  certificateNumber: string;
  chemicalResidues: ChemicalTest[];
  microbialTests: MicrobialTest[];
  heavyMetals: HeavyMetalTest[];
  physicalInspection: PhysicalInspection;
  detectedContaminants: string[];
  recommendations: string;
}

export interface RecallNotice {
  severity: 'Class I (High Risk)' | 'Class II (Medium Risk)' | 'Class III (Low Risk)';
  alertDate: string;
  contaminationType: 'Microbiological' | 'Mycotoxin' | 'Chemical Residue' | 'Heavy Metals' | 'Allergen Mislabeling';
  contaminatedIngredient: string;
  affectedLots: string[];
  affectedLocations: string[];
  consumerActions: string[];
  authorityHelpline: string;
  reportingAgency: string;
}

export interface FoodProductBatch {
  id: string;
  batchId: string;
  productName: string;
  brandName: string;
  category: 'Dairy' | 'Grains & Cereals' | 'Beverages' | 'Oils & Fats' | 'Baked Goods' | string;
  imageUrl: string;
  mfgDate: string;
  expiryDate: string;
  mfgYear: number;
  netWeight: string;
  status: SafetyStatus;
  isRecalled: boolean;
  recallNotice?: RecallNotice;
  origin: OriginInfo;
  ingredients: Ingredient[];
  manufacturing: ManufacturingInfo;
  supplyChain: SupplyChainStage[];
  safetyReport: SafetyReport;
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  batchId: string;
  action: string;
  actor: string;
  role: string;
  details: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalBatches: number;
  safeCount: number;
  warningCount: number;
  contaminatedCount: number;
  activeRecalls: number;
  recentAlerts: {
    batchId: string;
    productName: string;
    status: SafetyStatus;
    reason: string;
    date: string;
    severity: string;
  }[];
  categoryBreakdown: { name: string; safe: number; warning: number; contaminated: number }[];
  monthlyTrends: { month: string; tested: number; safe: number; flagged: number }[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Chief Food Safety Officer' | 'Quality Control Specialist' | 'Audit Inspector';
}
