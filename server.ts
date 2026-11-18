import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Persistent database store file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'foodtrace_db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data if DB file doesn't exist
function getInitialData() {
  return {
    batches: [
      {
        id: 'batch-001',
        batchId: 'FT2026001',
        productName: 'Pure Pasture Organic Whole Milk',
        brandName: 'Verdant Dairy Farms',
        category: 'Dairy',
        imageUrl: '/src/assets/images/product_pure_milk_1794004309309.jpg',
        mfgDate: '2026-10-28',
        expiryDate: '2026-11-18',
        mfgYear: 2026,
        netWeight: '1 Litre (Glass Bottle)',
        status: 'safe',
        isRecalled: false,
        origin: {
          country: 'United States',
          state: 'Vermont',
          district: 'Addison County',
          farmName: 'Green Meadows Pasture Co-op',
          farmerDetails: {
            name: 'Evelyn Miller',
            contactOrId: 'VT-COOP-8821',
            certification: 'USDA 100% Organic, Non-GMO Project Verified',
            sustainablePractice: '100% Grass-Fed rotational grazing, solar-powered dairy parlor'
          },
          collectionDate: '2026-10-27T05:30:00Z',
          sourceLocation: 'Addison Valley Rd, Weybridge, VT 05753',
          coordinates: { lat: 44.0531, lng: -73.2043 }
        },
        ingredients: [
          {
            id: 'ing-1',
            name: 'Fresh Grade-A Whole Cow Milk',
            percentage: '99.85%',
            supplierName: 'Green Meadows Pasture Co-op',
            supplierOrigin: 'Addison, Vermont, USA',
            supplierContact: '+1 (802) 555-0142',
            supplierLotId: 'RAW-MILK-LOT-904',
            qualityStatus: 'Verified Safe',
            notes: 'Cold chilled to 2.8°C within 15 minutes of collection.'
          },
          {
            id: 'ing-2',
            name: 'Vitamin D3 (Cholecalciferol fortification)',
            percentage: '0.15%',
            supplierName: 'NutriPure Bio Labs',
            supplierOrigin: 'Boulder, Colorado, USA',
            supplierContact: '+1 (303) 555-7790',
            supplierLotId: 'VIT-D3-2026-08',
            qualityStatus: 'Verified Safe'
          }
        ],
        manufacturing: {
          company: 'Verdant Dairy Processing Plant #4',
          facilityName: 'Champlain Valley Creamery Facility',
          factoryLocation: 'Middlebury Industrial Park, Middlebury, VT',
          mfgDate: '2026-10-28T09:15:00Z',
          processingDetails: 'Continuous High-Temperature Short-Time (HTST) pasteurization at 72.5°C for 16 seconds followed by centrifugal homogenization and inline micro-filtration.',
          packagingDate: '2026-10-28T14:00:00Z',
          packagingType: 'Sanitized recyclable amber-shielded glass bottles with induction-sealed safety closure.',
          storageConditions: 'Refrigerated cold chain maintained between 1.0°C and 4.0°C at all times. Do not break cold chain.',
          facilityCertifications: ['ISO 22000:2018', 'HACCP Tier 3 Certified', 'FSSC 22000 Approved']
        },
        supplyChain: [
          {
            stepNumber: 1,
            title: 'Raw Material Collection',
            stageKey: 'collection',
            location: 'Green Meadows Pasture, Addison, VT',
            facilityOrVehicle: 'Milking Parlor Unit #3',
            timestamp: '2026-10-27 05:45 AM',
            status: 'completed',
            temperatureMonitoring: '3.1°C (Chilled Storage)',
            operatorOrInspector: 'J. Reynolds (Dairy Lead)',
            notes: 'Somatic cell and rapid antibiotic swab negative.'
          },
          {
            stepNumber: 2,
            title: 'Insulated Bulk Transport',
            stageKey: 'transport_processing',
            location: 'Route 7 Northward Transit',
            facilityOrVehicle: 'Chilled Tanker Truck #TK-410',
            timestamp: '2026-10-27 09:10 AM',
            status: 'completed',
            temperatureMonitoring: '2.4°C constant telemetry',
            operatorOrInspector: 'R. Simmons (Certified Hauler)',
            notes: 'GPS geo-fence logged no stops. Thermal insulation intact.'
          },
          {
            stepNumber: 3,
            title: 'Facility Intake & Analytical Testing',
            stageKey: 'intake_inspection',
            location: 'Middlebury Processing Plant',
            facilityOrVehicle: 'Intake Bay 2 Receiving Lab',
            timestamp: '2026-10-27 11:30 AM',
            status: 'completed',
            temperatureMonitoring: '2.8°C',
            operatorOrInspector: 'Dr. Sarah Lin (QC Chemist)',
            notes: 'Spectroscopy acidity: 0.15% lactic acid. Aflatoxin M1 non-detect.'
          },
          {
            stepNumber: 4,
            title: 'HTST Pasteurization & Homogenization',
            stageKey: 'manufacturing',
            location: 'Processing Hall B',
            facilityOrVehicle: 'HTST Skid Unit #2',
            timestamp: '2026-10-28 09:15 AM',
            status: 'completed',
            temperatureMonitoring: '72.5°C pasteurize / 3.0°C rapid cool',
            operatorOrInspector: 'M. Vance (Processing Engineer)',
            notes: 'Holding tube velocity calibrated. Divert valve verified.'
          },
          {
            stepNumber: 5,
            title: 'Hermetic Glass Bottling',
            stageKey: 'packaging',
            location: 'Clean Packaging Line 1',
            facilityOrVehicle: 'Cleanroom Filler Enclosure',
            timestamp: '2026-10-28 02:00 PM',
            status: 'completed',
            temperatureMonitoring: '2.9°C ambient enclosed',
            operatorOrInspector: 'A. Patel (Packaging Specialist)',
            notes: 'Nitrogen headspace purge; tamper-evident ring seal confirmed.'
          },
          {
            stepNumber: 6,
            title: 'Cold Storage Vault Staging',
            stageKey: 'warehousing',
            location: 'Northeast Logistics Hub',
            facilityOrVehicle: 'Cold Vault Section C-14',
            timestamp: '2026-10-29 08:00 AM',
            status: 'completed',
            temperatureMonitoring: '2.1°C IoT continuous',
            operatorOrInspector: 'K. Hughes (Vault Manager)',
            notes: 'FIFO barcode scanned. Inventory quarantined until lab clearance.'
          },
          {
            stepNumber: 7,
            title: 'Refrigerated Regional Distribution',
            stageKey: 'distribution',
            location: 'Interstate 89 Corridor',
            facilityOrVehicle: 'ThermoKing Fleet #FLT-809',
            timestamp: '2026-10-30 04:30 AM',
            status: 'completed',
            temperatureMonitoring: '2.5°C refrigerated',
            operatorOrInspector: 'D. Miller (Fleet Logistics)',
            notes: 'Zero temperature breaches recorded during 4-hour transit.'
          },
          {
            stepNumber: 8,
            title: 'Retail Store Delivery',
            stageKey: 'retail',
            location: 'Whole Food Market, Boston Central',
            facilityOrVehicle: 'Dairy Display Refrigerator Unit #4',
            timestamp: '2026-10-30 09:15 AM',
            status: 'completed',
            temperatureMonitoring: '3.4°C customer display',
            operatorOrInspector: 'C. Adams (Receiving Manager)',
            notes: 'Inspected upon arrival; packaging intact, ready for consumers.'
          }
        ],
        safetyReport: {
          overallSafetyStatus: 'Safe',
          inspectionStatus: 'Passed',
          testingDate: '2026-10-28',
          laboratory: {
            name: 'National Food & Agri Analytics Laboratory (ISO/IEC 17025)',
            accreditation: 'ISO/IEC 17025:2017 Certified #A2LA-4921',
            licenseNo: 'FDA-REG-US-991204',
            chiefAnalyst: 'Dr. Miranda Vance, Ph.D. Microbiology'
          },
          certificateNumber: 'CERT-SAFE-2026-88192',
          chemicalResidues: [
            { substance: 'Beta-lactam Antibiotics', detectedValue: 'Non-Detectable (<0.001 mg/kg)', maxAllowableLimit: '0.004 mg/kg', status: 'Pass' },
            { substance: 'Tetracyclines', detectedValue: 'Non-Detectable (<0.005 mg/kg)', maxAllowableLimit: '0.100 mg/kg', status: 'Pass' },
            { substance: 'Organochlorine Pesticides', detectedValue: 'Absent', maxAllowableLimit: '0.010 mg/kg', status: 'Pass' },
            { substance: 'Aflatoxin M1', detectedValue: '<0.01 ppb', maxAllowableLimit: '0.50 ppb', status: 'Pass' }
          ],
          microbialTests: [
            { pathogen: 'Salmonella spp.', result: 'Absent in 25ml', standardRequirement: 'Absent in 25ml', status: 'Pass' },
            { pathogen: 'Listeria monocytogenes', result: 'Absent in 25ml', standardRequirement: 'Absent in 25ml', status: 'Pass' },
            { pathogen: 'Escherichia coli (generic)', result: '<1 CFU/ml', standardRequirement: '<10 CFU/ml', status: 'Pass' },
            { pathogen: 'Staphylococcus aureus', result: '<10 CFU/ml', standardRequirement: '<100 CFU/ml', status: 'Pass' },
            { pathogen: 'Total Aerobic Plate Count', result: '1,200 CFU/ml', standardRequirement: '<20,000 CFU/ml', status: 'Pass' }
          ],
          heavyMetals: [
            { metal: 'Lead (Pb)', detected: '<0.005 mg/kg', limit: '0.020 mg/kg', status: 'Pass' },
            { metal: 'Cadmium (Cd)', detected: '<0.002 mg/kg', limit: '0.010 mg/kg', status: 'Pass' },
            { metal: 'Mercury (Hg)', detected: '<0.001 mg/kg', limit: '0.005 mg/kg', status: 'Pass' }
          ],
          physicalInspection: {
            foreignParticles: 'Zero particulate matter observed under 40x magnification',
            colorAndOdour: 'Characteristic creamy white, fresh clean lactic aroma',
            packagingIntegrity: 'Hermetic vacuum seal intact, induction seal verified 100%',
            status: 'Pass'
          },
          detectedContaminants: [],
          recommendations: 'Batch meets all FDA Grade A and USDA Organic purity standards. Safe for immediate consumer distribution.'
        },
        lastUpdated: '2026-10-30T10:00:00Z'
      },
      {
        id: 'batch-002',
        batchId: 'FT2026002',
        productName: 'Heritage Aged Golden Basmati Rice',
        brandName: 'Royal Indus Millers',
        category: 'Grains & Cereals',
        imageUrl: '/src/assets/images/product_basmati_rice_1794004308764.jpg',
        mfgDate: '2026-09-14',
        expiryDate: '2028-09-14',
        mfgYear: 2026,
        netWeight: '5 kg (Jute & Poly Liner)',
        status: 'safe',
        isRecalled: false,
        origin: {
          country: 'India',
          state: 'Punjab',
          district: 'Amritsar District',
          farmName: 'Doaba Himalayan Foothills Agri Co-op',
          farmerDetails: {
            name: 'Harpreet Singh Sandhu',
            contactOrId: 'PB-FARM-IND-4019',
            certification: 'GlobalGAP Certified, India Organic NPOP',
            sustainablePractice: 'Canal snowmelt irrigation, zero stubble burning agro-forestry'
          },
          collectionDate: '2026-08-20T07:00:00Z',
          sourceLocation: 'Grand Trunk Road Valley, Amritsar, Punjab 143001',
          coordinates: { lat: 31.634, lng: 74.8723 }
        },
        ingredients: [
          {
            id: 'ing-rice-1',
            name: 'Traditional Himalayan Aged Basmati Paddy (Type 1121)',
            percentage: '100%',
            supplierName: 'Doaba Himalayan Agri Co-op',
            supplierOrigin: 'Amritsar, Punjab, India',
            supplierContact: '+91 (183) 555-4421',
            supplierLotId: 'INDUS-GRAIN-LOT-441',
            qualityStatus: 'Verified Safe',
            notes: 'Aged for 24 months in temperature-monitored wooden silos.'
          }
        ],
        manufacturing: {
          company: 'Royal Indus Modern Milling Ltd.',
          facilityName: 'Sultanpur Precision Grain Mills',
          factoryLocation: 'Industrial Growth Centre, Amritsar Outer, Punjab',
          mfgDate: '2026-09-14T08:00:00Z',
          processingDetails: 'Pre-cleaning, acoustic de-stoning, rubber-roll dehulling, optical multi-spectrum color sorting, and 5-stage polish followed by moisture normalization to 11.8%.',
          packagingDate: '2026-09-15T11:00:00Z',
          packagingType: 'Breathable outer food-grade natural jute sack with inner multilayer moisture-barrier polymer.',
          storageConditions: 'Cool dry place, ambient temperature 15°C to 24°C, relative humidity under 60%. Protected from direct sunlight.',
          facilityCertifications: ['BRC Global Standard for Food Safety Grade AA', 'ISO 9001:2015', 'FSSAI License 10014011002341']
        },
        supplyChain: [
          {
            stepNumber: 1,
            title: 'Himalayan Paddy Harvest',
            stageKey: 'collection',
            location: 'Amritsar Paddy Fields',
            facilityOrVehicle: 'Combine Harvester #IND-88',
            timestamp: '2026-08-20 08:30 AM',
            status: 'completed',
            temperatureMonitoring: '28°C ambient sunny',
            operatorOrInspector: 'H. Sandhu (Lead Agronomist)',
            notes: 'Grain moisture at harvest: 18.2%. Sent immediately for aerated drying.'
          },
          {
            stepNumber: 2,
            title: 'Grain Silo Natural Aging',
            stageKey: 'transport_processing',
            location: 'Heritage Silo Park, Kapurthala',
            facilityOrVehicle: 'Temperature Controlled Silo #04',
            timestamp: '2026-08-25 10:00 AM',
            status: 'completed',
            temperatureMonitoring: '19.5°C aerated',
            operatorOrInspector: 'V. Sharma (Grain Curator)',
            notes: '24-month curing cycle completed to optimize elongation ratio to 2.2x.'
          },
          {
            stepNumber: 3,
            title: 'Optical Sorter & Intake Screening',
            stageKey: 'intake_inspection',
            location: 'Milling Facility Intake',
            facilityOrVehicle: 'Bühler Sortex Optical Sorter',
            timestamp: '2026-09-14 07:00 AM',
            status: 'completed',
            temperatureMonitoring: '21.0°C indoor',
            operatorOrInspector: 'P. Nair (QC Inspector)',
            notes: 'Purity score 99.8%. Discolored and broken grains under 0.8%.'
          },
          {
            stepNumber: 4,
            title: 'Dehulling & Polishing',
            stageKey: 'manufacturing',
            location: 'Main Milling Hall A',
            facilityOrVehicle: 'Precision Mill Line #2',
            timestamp: '2026-09-14 01:00 PM',
            status: 'completed',
            operatorOrInspector: 'T. Singh (Plant Director)',
            notes: 'De-stoned with magnetic separation. Zero metal fragments.'
          },
          {
            stepNumber: 5,
            title: 'Nitrogen Purged Packaging',
            stageKey: 'packaging',
            location: 'Packaging Line 4',
            facilityOrVehicle: 'Automated 5kg Weigher & Sealer',
            timestamp: '2026-09-15 11:30 AM',
            status: 'completed',
            operatorOrInspector: 'A. Kaur (Packaging Supervisor)',
            notes: 'Moisture level 11.8% confirmed. Tamper-proof stitch sealed.'
          },
          {
            stepNumber: 6,
            title: 'Export Logistics Depository',
            stageKey: 'warehousing',
            location: 'Nhava Sheva Port CFS Terminal',
            facilityOrVehicle: 'Covered Container CFS Bay 8',
            timestamp: '2026-09-22 04:00 PM',
            status: 'completed',
            temperatureMonitoring: '24°C dry storage',
            operatorOrInspector: 'M. Merchant (Customs Officer)',
            notes: 'Phytosanitary inspection cleared. Container seal #MSC-99211.'
          },
          {
            stepNumber: 7,
            title: 'Intermodal Freight & Customs Port',
            stageKey: 'distribution',
            location: 'Port of New York / New Jersey',
            facilityOrVehicle: 'Container Vessel MSC Ambra',
            timestamp: '2026-10-18 09:00 AM',
            status: 'completed',
            operatorOrInspector: 'FDA Import Inspector #29',
            notes: 'Pesticide residue screen port clearance passed.'
          },
          {
            stepNumber: 8,
            title: 'National Distribution Retailer',
            stageKey: 'retail',
            location: 'Gourmet World Foods, Warehouse #12',
            facilityOrVehicle: 'Central Distribution Aisle 19',
            timestamp: '2026-10-25 11:00 AM',
            status: 'completed',
            operatorOrInspector: 'S. Goldberg (Receiving Manager)',
            notes: 'Delivered in mint condition, passed retailer lot testing.'
          }
        ],
        safetyReport: {
          overallSafetyStatus: 'Safe',
          inspectionStatus: 'Passed',
          testingDate: '2026-09-15',
          laboratory: {
            name: 'Eurofins Agro Food Testing Center (NABL Accredited)',
            accreditation: 'ISO/IEC 17025:2017 #TC-5119',
            licenseNo: 'EAC-IND-88241',
            chiefAnalyst: 'Dr. Rameshwar Gupta, M.Sc Analytical Chemistry'
          },
          certificateNumber: 'CERT-SAFE-2026-90412',
          chemicalResidues: [
            { substance: 'Tricyclazole (Fungicide)', detectedValue: '0.003 mg/kg', maxAllowableLimit: '0.010 mg/kg', status: 'Pass' },
            { substance: 'Buprofezin', detectedValue: 'Non-Detectable (<0.005 mg/kg)', maxAllowableLimit: '0.050 mg/kg', status: 'Pass' },
            { substance: 'Chlorpyrifos', detectedValue: 'Non-Detectable (<0.001 mg/kg)', maxAllowableLimit: '0.010 mg/kg', status: 'Pass' },
            { substance: 'Phosphine Residue', detectedValue: '<0.01 mg/kg', maxAllowableLimit: '0.100 mg/kg', status: 'Pass' }
          ],
          microbialTests: [
            { pathogen: 'Salmonella spp.', result: 'Negative / 25g', standardRequirement: 'Negative / 25g', status: 'Pass' },
            { pathogen: 'Escherichia coli', result: '<10 CFU/g', standardRequirement: '<100 CFU/g', status: 'Pass' },
            { pathogen: 'Aspergillus flavus (Aflatoxin B1/B2/G1/G2)', result: '<1.0 ppb (Total)', standardRequirement: '<4.0 ppb', status: 'Pass' },
            { pathogen: 'Yeast & Moulds', result: '80 CFU/g', standardRequirement: '<1,000 CFU/g', status: 'Pass' }
          ],
          heavyMetals: [
            { metal: 'Inorganic Arsenic (As)', detected: '0.042 mg/kg', limit: '0.200 mg/kg (Codex)', status: 'Pass' },
            { metal: 'Cadmium (Cd)', detected: '0.015 mg/kg', limit: '0.100 mg/kg', status: 'Pass' },
            { metal: 'Lead (Pb)', detected: '<0.010 mg/kg', limit: '0.200 mg/kg', status: 'Pass' }
          ],
          physicalInspection: {
            foreignParticles: 'No stones, glass, insects or foreign matters detected',
            colorAndOdour: 'Creamy translucent pearls, authentic aged nutty Basmati aroma',
            packagingIntegrity: 'Multi-layer barrier intact, no punctures or moisture ingress',
            status: 'Pass'
          },
          detectedContaminants: [],
          recommendations: 'Grain conforms fully to Codex Alimentarius and FDA grain safety parameters.'
        },
        lastUpdated: '2026-10-25T11:00:00Z'
      },
      {
        id: 'batch-003',
        batchId: 'FT2026003',
        productName: 'Orchard Grove Cold-Pressed Orange Juice',
        brandName: 'Citrus Valley Organics',
        category: 'Beverages',
        imageUrl: '/src/assets/images/product_orange_juice_1794004309406.jpg',
        mfgDate: '2026-11-01',
        expiryDate: '2026-11-22',
        mfgYear: 2026,
        netWeight: '500 ml (Recycled PET Bottle)',
        status: 'contaminated',
        isRecalled: true,
        recallNotice: {
          severity: 'Class I (High Risk)',
          alertDate: '2026-11-04T14:30:00Z',
          contaminationType: 'Mycotoxin',
          contaminatedIngredient: 'Valencia Sweet Oranges (Orchard Lot #B44 - Valley Citrus Farms)',
          affectedLots: ['LOT-VAL-B44-NOV', 'FT2026003-A', 'FT2026003-B'],
          affectedLocations: [
            'Central Distribution Center, Orlando, FL',
            'Southeastern Regional Supermarket Hub, Atlanta, GA',
            'Metro Superstores across Florida, Georgia, and North Carolina'
          ],
          consumerActions: [
            'DO NOT CONSUME THIS PRODUCT under any circumstances.',
            'Dispose of the juice bottle safely or return to the place of purchase for an unconditional 100% full refund.',
            'If you or a household member experienced nausea, gastrointestinal discomfort, or abdominal pain within 24 hours of consumption, consult a healthcare provider immediately.',
            'Quote Batch ID FT2026003 when speaking with medical personnel or consumer hotlines.'
          ],
          authorityHelpline: '1-800-555-FOOD-RECALL (Toll-Free, 24/7)',
          reportingAgency: 'State Food Safety Authority & National Consumer Protection Division'
        },
        origin: {
          country: 'United States',
          state: 'Florida',
          district: 'Polk County',
          farmName: 'Valley Citrus Orchards Co.',
          farmerDetails: {
            name: 'Carlos Mendez',
            contactOrId: 'FL-ORC-3382',
            certification: 'Florida Citrus Growers Alliance [Under Re-Audit]',
            sustainablePractice: 'Drip irrigation citrus grove'
          },
          collectionDate: '2026-10-30T06:00:00Z',
          sourceLocation: 'Highway 27 Citrus Corridor, Winter Haven, FL 33884',
          coordinates: { lat: 28.0222, lng: -81.7329 }
        },
        ingredients: [
          {
            id: 'ing-orange-1',
            name: 'Valencia Sweet Oranges (Orchard Lot #B44)',
            percentage: '99.5%',
            supplierName: 'Valley Citrus Orchards Co.',
            supplierOrigin: 'Winter Haven, Florida, USA',
            supplierContact: '+1 (863) 555-9012',
            supplierLotId: 'LOT-VAL-B44-NOV',
            qualityStatus: 'Contaminated',
            notes: 'Root cause confirmed: Post-tropical storm waterlogging induced fungal Penicillium expansum growth on damaged windfall fruit.'
          },
          {
            id: 'ing-orange-2',
            name: 'Ascorbic Acid (Vitamin C Antioxidant)',
            percentage: '0.5%',
            supplierName: 'BioNutra USA',
            supplierOrigin: 'Tampa, Florida, USA',
            supplierContact: '+1 (813) 555-3341',
            supplierLotId: 'ASC-LOT-440',
            qualityStatus: 'Verified Safe'
          }
        ],
        manufacturing: {
          company: 'Sunshine Pure Beverage Bottlers LLC',
          facilityName: 'Lakeland Cold-Press Production Line',
          factoryLocation: 'Commercial Way, Lakeland, FL',
          mfgDate: '2026-11-01T07:30:00Z',
          processingDetails: 'Mechanical fruit scrub, automated rotary cup juice extraction, high-pressure processing (HPP) at 6,000 bar for 180 seconds to preserve fresh flavor without thermal heat.',
          packagingDate: '2026-11-01T12:00:00Z',
          packagingType: '500ml BPA-free post-consumer recycled rPET with tamper-band collar.',
          storageConditions: 'Keep refrigerated 2°C to 4°C. Perishable.',
          facilityCertifications: ['SQF Level 2 Certified', 'HACCP Facility [Investigative Hold Placed]']
        },
        supplyChain: [
          {
            stepNumber: 1,
            title: 'Citrus Grove Windfall Collection',
            stageKey: 'collection',
            location: 'Polk County Groves Block 7',
            facilityOrVehicle: 'Field Harvest Bins #B44',
            timestamp: '2026-10-30 07:15 AM',
            status: 'flagged',
            temperatureMonitoring: '24°C humid',
            operatorOrInspector: 'R. Alvarez (Field Foreman)',
            notes: 'FLAGGED: Rainfall flooding preceded harvest. Compromised fruit sorting protocol failed.'
          },
          {
            stepNumber: 2,
            title: 'Bulk Fruit Haulage',
            stageKey: 'transport_processing',
            location: 'FL-60 Eastbound Corridor',
            facilityOrVehicle: 'Open Flatbed Hauler #TRK-108',
            timestamp: '2026-10-30 11:00 AM',
            status: 'completed',
            operatorOrInspector: 'T. Briggs (Driver)',
            notes: 'Delivered 18 metric tons to receiving plant.'
          },
          {
            stepNumber: 3,
            title: 'Wash Bay & Visual Inspection Failure',
            stageKey: 'intake_inspection',
            location: 'Lakeland Intake Bay 1',
            facilityOrVehicle: 'Roller Sorter Table #2',
            timestamp: '2026-10-31 08:30 AM',
            status: 'flagged',
            operatorOrInspector: 'M. Jenkins (Shift QA)',
            notes: 'FLAGGED: Optical cull scanner was in bypass mode for calibration during Lot #B44.'
          },
          {
            stepNumber: 4,
            title: 'High-Pressure Processing (HPP)',
            stageKey: 'manufacturing',
            location: 'HPP Hyperbaric Chamber #3',
            facilityOrVehicle: 'Avure HPP 350L Unit',
            timestamp: '2026-11-01 07:45 AM',
            status: 'completed',
            temperatureMonitoring: '4.2°C water temperature',
            operatorOrInspector: 'G. Morales (HPP Operator)',
            notes: 'Pressurized to 600 MPa. Note: HPP inactivates microbes but DOES NOT degrade mycotoxins.'
          },
          {
            stepNumber: 5,
            title: 'Aseptic Cold Filling',
            stageKey: 'packaging',
            location: 'Filling Suite 3',
            facilityOrVehicle: 'Automated Rotary Piston Filler',
            timestamp: '2026-11-01 12:30 PM',
            status: 'completed',
            temperatureMonitoring: '3.1°C chilling tunnel',
            operatorOrInspector: 'D. Clark (Filling Lead)',
            notes: '12,400 bottles packaged and palletized under Batch FT2026003.'
          },
          {
            stepNumber: 6,
            title: 'Central Distribution Depository',
            stageKey: 'warehousing',
            location: 'Orlando Logistics Complex',
            facilityOrVehicle: 'Warehouse 4 Cold Room D',
            timestamp: '2026-11-02 05:00 AM',
            status: 'quarantined',
            temperatureMonitoring: '3.0°C cold storage',
            operatorOrInspector: 'K. Patel (Warehouse Director)',
            notes: 'QUARANTINE ORDER APPLIED: Remaining 4,200 bottles locked in quarantine bay.'
          },
          {
            stepNumber: 7,
            title: 'Regional Fleet Distribution',
            stageKey: 'distribution',
            location: 'Southeast Freight Network',
            facilityOrVehicle: 'Reefer Truck Fleet Unit 22',
            timestamp: '2026-11-02 10:00 PM',
            status: 'quarantined',
            operatorOrInspector: 'S. Jenkins (Fleet Coordinator)',
            notes: 'Drivers instructed to divert in-transit deliveries back to warehouse quarantine.'
          },
          {
            stepNumber: 8,
            title: 'Retail Store Shelves (Emergency Recall)',
            stageKey: 'retail',
            location: 'Southeast Supermarket Chains',
            facilityOrVehicle: 'Store Chillers (28 Locations)',
            timestamp: '2026-11-03 08:00 AM',
            status: 'quarantined',
            operatorOrInspector: 'State Food Safety Officers',
            notes: 'MANDATORY RECALL ACTIVE: Store staff pulled all FT2026003 stock from shelves.'
          }
        ],
        safetyReport: {
          overallSafetyStatus: 'Contamination Detected / Unsafe',
          inspectionStatus: 'Failed - Contamination Found',
          testingDate: '2026-11-04',
          laboratory: {
            name: 'Southeast Forensic Agro-Biotech Testing Laboratory',
            accreditation: 'ISO/IEC 17025:2017 & FDA Reference Certified',
            licenseNo: 'FL-DACS-LAB-7741',
            chiefAnalyst: 'Dr. Gregory Thorne, Ph.D. Toxicology & Food Chemistry'
          },
          certificateNumber: 'CERT-RECALL-FAIL-2026-4011',
          chemicalResidues: [
            { substance: 'Patulin (Penicillium Mycotoxin)', detectedValue: '148.5 ug/kg (CRITICAL)', maxAllowableLimit: '50.0 ug/kg (FDA Max)', status: 'Exceeded' },
            { substance: 'Imidacloprid (Pesticide)', detectedValue: '0.012 mg/kg', maxAllowableLimit: '1.000 mg/kg', status: 'Pass' },
            { substance: 'Heavy Metals (Lead/Cadmium)', detectedValue: '<0.005 mg/kg', maxAllowableLimit: '0.050 mg/kg', status: 'Pass' }
          ],
          microbialTests: [
            { pathogen: 'Total Coliforms', result: '180 CFU/ml (ELEVATED)', standardRequirement: '<10 CFU/ml', status: 'Failed' },
            { pathogen: 'Salmonella spp.', result: 'Negative / 25ml', standardRequirement: 'Negative / 25ml', status: 'Pass' },
            { pathogen: 'Listeria monocytogenes', result: 'Negative / 25ml', standardRequirement: 'Negative / 25ml', status: 'Pass' },
            { pathogen: 'Penicillium expansum mold spore count', result: '3,400 CFU/ml', standardRequirement: '<100 CFU/ml', status: 'Failed' }
          ],
          heavyMetals: [
            { metal: 'Lead (Pb)', detected: '<0.005 mg/kg', limit: '0.050 mg/kg', status: 'Pass' },
            { metal: 'Arsenic (As)', detected: '<0.002 mg/kg', limit: '0.020 mg/kg', status: 'Pass' }
          ],
          physicalInspection: {
            foreignParticles: 'Micro-filamentous mold debris detected in filtered sediment',
            colorAndOdour: 'Slightly fermented, pungent citrus odor, micro-turbidity',
            packagingIntegrity: 'Bottle physical seal intact (contamination originated prior to bottling)',
            status: 'Failed'
          },
          detectedContaminants: [
            'Patulin Mycotoxin (148.5 ug/kg vs 50.0 ug/kg limit)',
            'Penicillium expansum fungal biomass',
            'Elevated Coliform bacteria (180 CFU/ml vs 10 CFU/ml limit)'
          ],
          recommendations: 'CRITICAL SAFETY FAILURE: Immediate Class I Nationwide Recall enforced. All product must be confiscated and destroyed under regulatory supervision. Facility sanitization audit ordered.'
        },
        lastUpdated: '2026-11-04T16:00:00Z'
      },
      {
        id: 'batch-004',
        batchId: 'FT2026004',
        productName: 'SunGolden Cold-Pressed Sunflower Cooking Oil',
        brandName: 'Helios Pure Botanicals',
        category: 'Oils & Fats',
        imageUrl: '/src/assets/images/product_sunflower_oil_1794004310249.jpg',
        mfgDate: '2026-10-15',
        expiryDate: '2027-10-15',
        mfgYear: 2026,
        netWeight: '500 ml (Clear Glass Cruet with Cork)',
        status: 'warning',
        isRecalled: false,
        origin: {
          country: 'Ukraine',
          state: 'Poltava Oblast',
          district: 'Myrhorod Raion',
          farmName: 'Chernozem Black Soil Sunflower Estate',
          farmerDetails: {
            name: 'Oleksiy Bondarenko',
            contactOrId: 'UA-AGRO-7721',
            certification: 'EU Organic Regulations (EC) 834/2007',
            sustainablePractice: 'Non-chemical crop rotation, natural bee pollination corridors'
          },
          collectionDate: '2026-09-28T09:00:00Z',
          sourceLocation: 'Myrhorod Agricultural Belt, Poltava, Ukraine',
          coordinates: { lat: 49.967, lng: 33.608 }
        },
        ingredients: [
          {
            id: 'ing-oil-1',
            name: 'High-Oleic Organic Sunflower Seeds',
            percentage: '100%',
            supplierName: 'Chernozem Agro Trade Ltd.',
            supplierOrigin: 'Poltava Oblast, Ukraine',
            supplierContact: '+380 (53) 555-8812',
            supplierLotId: 'SEED-SUN-LOT-902',
            qualityStatus: 'Under Investigation',
            notes: 'Under secondary verification due to slight oxidative indicator elevation in preliminary test.'
          }
        ],
        manufacturing: {
          company: 'Helios Cold-Press Extraction Plant',
          facilityName: 'Danube Valley Oil Mills',
          factoryLocation: 'Reni Industrial River Port, Odesa, Ukraine',
          mfgDate: '2026-10-15T10:00:00Z',
          processingDetails: 'Mechanical cold screw expeller pressing below 38°C with zero chemical solvent extraction, dual cotton plate particulate filtration, nitrogen-sparged storage.',
          packagingDate: '2026-10-16T14:00:00Z',
          packagingType: 'Heavy UV-protective glass bottle with natural wood-topped hermetic stopper.',
          storageConditions: 'Store in cool, dark cupboard at 12°C - 20°C away from heat sources.',
          facilityCertifications: ['ISO 22000:2018 Certified', 'HACCP Grade A']
        },
        supplyChain: [
          {
            stepNumber: 1,
            title: 'High-Oleic Sunflower Harvest',
            stageKey: 'collection',
            location: 'Poltava Estate Fields',
            facilityOrVehicle: 'Combine Harvester John Deere S780',
            timestamp: '2026-09-28 09:30 AM',
            status: 'completed',
            operatorOrInspector: 'O. Bondarenko (Farm Director)',
            notes: 'Seed moisture 7.4%. Oil content test: 48.6%.'
          },
          {
            stepNumber: 2,
            title: 'Barge Transport via River Danube',
            stageKey: 'transport_processing',
            location: 'Danube River Shipping Lane',
            facilityOrVehicle: 'Bulk Cargo Barge #DN-12',
            timestamp: '2026-10-04 02:00 PM',
            status: 'completed',
            temperatureMonitoring: '16°C ambient hull',
            operatorOrInspector: 'Capt. I. Petrenko',
            notes: 'Dry sealed cargo holds with moisture telemetry.'
          },
          {
            stepNumber: 3,
            title: 'Seed Moisture & Oxidation Screening',
            stageKey: 'intake_inspection',
            location: 'Reni Extraction Mill Silo',
            facilityOrVehicle: 'Intake Laboratory #1',
            timestamp: '2026-10-14 11:00 AM',
            status: 'flagged',
            operatorOrInspector: 'V. Moroz (Senior Chemist)',
            notes: 'WARNING: Initial peroxide index reading was 9.8 meq O2/kg (Threshold limit: 10.0 meq O2/kg). Secondary confirmatory testing ordered.'
          },
          {
            stepNumber: 4,
            title: 'Cold Screw Expeller Extraction',
            stageKey: 'manufacturing',
            location: 'Press House Section B',
            facilityOrVehicle: 'Komet Cold Screw Press Line 4',
            timestamp: '2026-10-15 10:00 AM',
            status: 'completed',
            temperatureMonitoring: '36.5°C maximum pressing friction',
            operatorOrInspector: 'A. Koval (Press Master)',
            notes: 'Cold extraction confirmed without chemical solvents.'
          },
          {
            stepNumber: 5,
            title: 'Nitrogen-Blanketed Bottling',
            stageKey: 'packaging',
            location: 'Bottling Suite Alpha',
            facilityOrVehicle: 'Rotary Glass Filler & Corker',
            timestamp: '2026-10-16 02:30 PM',
            status: 'completed',
            operatorOrInspector: 'L. Tymoshenko (QA Lead)',
            notes: 'Dissolved oxygen minimized via nitrogen purge.'
          },
          {
            stepNumber: 6,
            title: 'Warehouse Holding Bay',
            stageKey: 'warehousing',
            location: 'Odesa Port Logistics Bay',
            facilityOrVehicle: 'Warehouse 9 Section W-2',
            timestamp: '2026-10-20 08:00 AM',
            status: 'flagged',
            temperatureMonitoring: '18.0°C regulated',
            operatorOrInspector: 'M. Sydorenko (Logistics Manager)',
            notes: 'HOLD STATUS: Conditional release pending final GC-MS secondary lab report.'
          },
          {
            stepNumber: 7,
            title: 'Cross-Border Maritime Freight',
            stageKey: 'distribution',
            location: 'Black Sea to Mediterranean',
            facilityOrVehicle: 'Container Carrier MedWave',
            timestamp: '2026-10-28 01:00 PM',
            status: 'in_transit',
            operatorOrInspector: 'Global Logistics Transit',
            notes: 'In-transit to European receiving hubs.'
          },
          {
            stepNumber: 8,
            title: 'Retail Store Delivery',
            stageKey: 'retail',
            location: 'Pending Clearance',
            facilityOrVehicle: 'Pending Clearance',
            timestamp: 'Pending Final Verification',
            status: 'quarantined',
            operatorOrInspector: 'Safety Authority Hold',
            notes: 'Retail stocking suspended until secondary peroxide & free fatty acid tests confirm stability.'
          }
        ],
        safetyReport: {
          overallSafetyStatus: 'Warning / Further Testing',
          inspectionStatus: 'Under Investigation',
          testingDate: '2026-10-22',
          laboratory: {
            name: 'Central Agri-Food Inspection & Lipidomics Lab (ISO 17025)',
            accreditation: 'ISO/IEC 17025:2017 #UA-LAB-9901',
            licenseNo: 'MOH-UA-FOOD-4482',
            chiefAnalyst: 'Dr. Bohdana Melnyk, Lipid Chemistry Specialist'
          },
          certificateNumber: 'CERT-INSPECT-PROV-2026-1184',
          chemicalResidues: [
            { substance: 'Peroxide Value (Oxidation Indicator)', detectedValue: '9.8 meq O2/kg (BORDERLINE)', maxAllowableLimit: '10.0 meq O2/kg (Codex)', status: 'Trace (Monitor)' },
            { substance: 'Free Fatty Acids (as Oleic Acid)', detectedValue: '0.28%', maxAllowableLimit: '0.30%', status: 'Trace (Monitor)' },
            { substance: 'Hexane / Chemical Solvents', detectedValue: 'Non-Detectable (<0.1 mg/kg)', maxAllowableLimit: '1.0 mg/kg', status: 'Pass' },
            { substance: 'Pesticide Multiresidue Screen (350 compounds)', detectedValue: 'All <0.005 mg/kg', maxAllowableLimit: '0.010 mg/kg', status: 'Pass' }
          ],
          microbialTests: [
            { pathogen: 'Salmonella in 25g', result: 'Absent', standardRequirement: 'Absent', status: 'Pass' },
            { pathogen: 'Yeast & Mould count', result: '<10 CFU/g', standardRequirement: '<100 CFU/g', status: 'Pass' }
          ],
          heavyMetals: [
            { metal: 'Lead (Pb)', detected: '<0.01 mg/kg', limit: '0.10 mg/kg', status: 'Pass' },
            { metal: 'Arsenic (As)', detected: '<0.01 mg/kg', limit: '0.10 mg/kg', status: 'Pass' },
            { metal: 'Iron (Fe pro-oxidant)', detected: '1.2 mg/kg', limit: '1.5 mg/kg', status: 'Pass' }
          ],
          physicalInspection: {
            foreignParticles: 'No sediment or haze observed',
            colorAndOdour: 'Golden clear liquid; faint seed warmth, no rancidity noted',
            packagingIntegrity: 'Aseptic cork seal intact',
            status: 'Pass'
          },
          detectedContaminants: [
            'Borderline Peroxide Value: 9.8 meq O2/kg (near maximum regulatory tolerance of 10.0 meq O2/kg)'
          ],
          recommendations: 'HOLD NOTICE: Batch is conditionally paused from retail distribution. Secondary Gas Chromatography & Rancimat stability test underway to confirm oxidation curve. Final safety determination expected in 72 hours.'
        },
        lastUpdated: '2026-10-23T14:00:00Z'
      },
      {
        id: 'batch-005',
        batchId: 'FT2026005',
        productName: 'GrainCraft Whole Grain Oat Digestive Biscuits',
        brandName: 'Highland Millers Artisanal',
        category: 'Baked Goods',
        imageUrl: '/src/assets/images/product_oat_biscuits_1794004308988.jpg',
        mfgDate: '2026-10-10',
        expiryDate: '2027-04-10',
        mfgYear: 2026,
        netWeight: '300 g (Foil-wrapped Pack)',
        status: 'safe',
        isRecalled: false,
        origin: {
          country: 'United Kingdom',
          state: 'Scotland',
          district: 'Aberdeenshire',
          farmName: 'Grampian Highlands Organic Oatfields',
          farmerDetails: {
            name: 'Alistair MacLeod',
            contactOrId: 'UK-SCOT-OAT-112',
            certification: 'Soil Association Organic Certified, Red Tractor Farm Assured',
            sustainablePractice: 'Biodiverse crop rotation, zero synthetic glyphosates'
          },
          collectionDate: '2026-09-18T10:00:00Z',
          sourceLocation: 'Inverurie Farmland, Aberdeenshire, AB51 5QZ, Scotland',
          coordinates: { lat: 57.283, lng: -2.378 }
        },
        ingredients: [
          {
            id: 'ing-bisc-1',
            name: 'Whole Grain Rolled Oats & Oat Flour',
            percentage: '62.0%',
            supplierName: 'Grampian Highlands Organic Oatfields',
            supplierOrigin: 'Aberdeenshire, Scotland, UK',
            supplierContact: '+44 (1467) 555-229',
            supplierLotId: 'OAT-SCOT-LOT-51',
            qualityStatus: 'Verified Safe',
            notes: 'Kiln-stabilized to deactivate lipase enzyme.'
          },
          {
            id: 'ing-bisc-2',
            name: 'Sustainable Certified Expeller Palm Oil',
            percentage: '14.5%',
            supplierName: 'PureFlora RSPO Supplies',
            supplierOrigin: 'Rotterdam Terminal, Netherlands',
            supplierContact: '+31 (10) 555-8910',
            supplierLotId: 'RSPO-SG-4412',
            qualityStatus: 'Verified Safe',
            notes: '100% Segregated Roundtable on Sustainable Palm Oil.'
          },
          {
            id: 'ing-bisc-3',
            name: 'Raw Demerara Cane Sugar',
            percentage: '13.0%',
            supplierName: 'FairTrade Sweet Naturals',
            supplierOrigin: 'Belize Sugar Industries',
            supplierContact: '+501 (3) 555-0120',
            supplierLotId: 'FT-SUG-2026-9',
            qualityStatus: 'Verified Safe'
          },
          {
            id: 'ing-bisc-4',
            name: 'Sea Salt & Leavening (Sodium Bicarbonate)',
            percentage: '10.5%',
            supplierName: 'Caledonian Pure Minerals',
            supplierOrigin: 'Edinburgh, Scotland',
            supplierContact: '+44 (131) 555-3001',
            supplierLotId: 'CAL-MIN-192',
            qualityStatus: 'Verified Safe'
          }
        ],
        manufacturing: {
          company: 'Highland Millers Bakery Ltd.',
          facilityName: 'Speyside Craft Bakery & Oatery',
          factoryLocation: 'Craigmyle Way, Keith, Moray, Scotland',
          mfgDate: '2026-10-10T06:00:00Z',
          processingDetails: 'Low-temperature continuous roller dough sheeter, rotary rotary mold cutter, traveling convection hearth oven baked at 185°C with progressive moisture expulsion, air cooling to 24°C prior to immediate barrier wrap.',
          packagingDate: '2026-10-10T11:00:00Z',
          packagingType: 'High-barrier metallized moisture foil sleeve with outer recyclable FSC-certified cardboard carton.',
          storageConditions: 'Store in an airtight container once opened. Keep in a dry, cool ambient pantry away from strong aromatics.',
          facilityCertifications: ['BRC Global Standards Grade AA+', 'IFS Food v8 Certified', 'Halal & Kosher Certified']
        },
        supplyChain: [
          {
            stepNumber: 1,
            title: 'Scottish Highland Oat Harvest',
            stageKey: 'collection',
            location: 'Inverurie Fields, Aberdeenshire',
            facilityOrVehicle: 'Claas Lexion Combine',
            timestamp: '2026-09-18 10:00 AM',
            status: 'completed',
            operatorOrInspector: 'A. MacLeod (Estate Head)',
            notes: 'Dry autumn harvest; clean golden oat husks.'
          },
          {
            stepNumber: 2,
            title: 'Kiln Steaming & Flaking',
            stageKey: 'transport_processing',
            location: 'Grampian Mill Works',
            facilityOrVehicle: 'Dehulling & Flaking Kiln #1',
            timestamp: '2026-09-24 08:00 AM',
            status: 'completed',
            temperatureMonitoring: '102°C steam sterilization',
            operatorOrInspector: 'E. Fraser (Head Miller)',
            notes: 'Natural enzymatic stabilization completed.'
          },
          {
            stepNumber: 3,
            title: 'Allergen & Acrylamide Screening',
            stageKey: 'intake_inspection',
            location: 'Speyside Bakery QC Lab',
            facilityOrVehicle: 'Chromatography Station 2',
            timestamp: '2026-10-09 02:00 PM',
            status: 'completed',
            operatorOrInspector: 'F. Campbell (Safety Chemist)',
            notes: 'Gluten cross-contamination below 5 ppm. Acrylamide pre-test safe.'
          },
          {
            stepNumber: 4,
            title: 'Convection Hearth Baking',
            stageKey: 'manufacturing',
            location: 'Bakehouse Line 2',
            facilityOrVehicle: 'Traveling Hearth Tunnel Oven',
            timestamp: '2026-10-10 07:00 AM',
            status: 'completed',
            temperatureMonitoring: '185°C zoned baking curve',
            operatorOrInspector: 'G. Stewart (Master Baker)',
            notes: 'Moisture content controlled at 2.4% for crisp texture.'
          },
          {
            stepNumber: 5,
            title: 'Barrier Foil Flow-Wrap',
            stageKey: 'packaging',
            location: 'Packaging Room 3',
            facilityOrVehicle: 'Bosch Flow Wrapper Unit #5',
            timestamp: '2026-10-10 11:30 AM',
            status: 'completed',
            operatorOrInspector: 'H. Ross (Packaging QA)',
            notes: 'Nitrogen gas flushed pack. X-ray metal detector passed 100%.'
          },
          {
            stepNumber: 6,
            title: 'Distribution Warehouse Depository',
            stageKey: 'warehousing',
            location: 'Central Scotland Distribution Centre',
            facilityOrVehicle: 'High-Bay Staging Aisle 8',
            timestamp: '2026-10-12 09:00 AM',
            status: 'completed',
            operatorOrInspector: 'J. MacDonald (Warehouse Lead)',
            notes: 'Lot barcode FT2026005 registered in ERP traceability ledger.'
          },
          {
            stepNumber: 7,
            title: 'UK & International Wholesale Logistics',
            stageKey: 'distribution',
            location: 'M6 Northbound / Southbound Freight',
            facilityOrVehicle: 'Euro-6 Scania Dry Freight #SC-440',
            timestamp: '2026-10-15 04:00 AM',
            status: 'completed',
            operatorOrInspector: 'D. Wright (Haulage Specialist)',
            notes: 'Safe transit, dry atmospheric conditions verified.'
          },
          {
            stepNumber: 8,
            title: 'Gourmet Food Retailers & Supermarkets',
            stageKey: 'retail',
            location: 'London & Regional High Street Stores',
            facilityOrVehicle: 'Organic Biscuit Section',
            timestamp: '2026-10-18 10:00 AM',
            status: 'completed',
            operatorOrInspector: 'P. Jenkins (Store Merchandiser)',
            notes: 'Verified on shelves; QR code scanning ready for consumers.'
          }
        ],
        safetyReport: {
          overallSafetyStatus: 'Safe',
          inspectionStatus: 'Passed',
          testingDate: '2026-10-11',
          laboratory: {
            name: 'Campden BRI Food Research & Analytical Services (UKAS)',
            accreditation: 'ISO/IEC 17025:2017 UKAS Testing #0107',
            licenseNo: 'UK-FSA-LAB-5591',
            chiefAnalyst: 'Dr. Fiona Campbell, CChem MRSC'
          },
          certificateNumber: 'CERT-SAFE-2026-77821',
          chemicalResidues: [
            { substance: 'Acrylamide', detectedValue: '84.0 ug/kg', maxAllowableLimit: '500.0 ug/kg (EU Benchmark)', status: 'Pass' },
            { substance: 'Glyphosate Residue', detectedValue: 'Non-Detectable (<0.010 mg/kg)', maxAllowableLimit: '0.050 mg/kg', status: 'Pass' },
            { substance: 'Deoxynivalenol (DON Mycotoxin)', detectedValue: '42.0 ug/kg', maxAllowableLimit: '500.0 ug/kg', status: 'Pass' },
            { substance: 'Zearalenone', detectedValue: '<5.0 ug/kg', maxAllowableLimit: '50.0 ug/kg', status: 'Pass' }
          ],
          microbialTests: [
            { pathogen: 'Salmonella spp.', result: 'Absent / 25g', standardRequirement: 'Absent / 25g', status: 'Pass' },
            { pathogen: 'Enterobacteriaceae', result: '<10 CFU/g', standardRequirement: '<100 CFU/g', status: 'Pass' },
            { pathogen: 'Bacillus cereus', result: '<100 CFU/g', standardRequirement: '<1,000 CFU/g', status: 'Pass' },
            { pathogen: 'Yeasts & Moulds', result: '<20 CFU/g', standardRequirement: '<500 CFU/g', status: 'Pass' }
          ],
          heavyMetals: [
            { metal: 'Lead (Pb)', detected: '<0.01 mg/kg', limit: '0.20 mg/kg', status: 'Pass' },
            { metal: 'Cadmium (Cd)', detected: '0.018 mg/kg', limit: '0.10 mg/kg', status: 'Pass' }
          ],
          physicalInspection: {
            foreignParticles: 'X-ray inspection verified zero metal or glass fragments',
            colorAndOdour: 'Golden toasted oat aroma, uniform biscuit diameter and thickness',
            packagingIntegrity: 'Hermetic seal and puncture resistance 100% compliant',
            status: 'Pass'
          },
          detectedContaminants: [],
          recommendations: 'Batch meets all UK Food Standards Agency and EU food safety criteria. Verified safe for consumer distribution.'
        },
        lastUpdated: '2026-10-18T10:00:00Z'
      }
    ],
    auditLogs: [
      {
        id: 'log-001',
        timestamp: '2026-11-04T14:35:00Z',
        batchId: 'FT2026003',
        action: 'CLASS I RECALL ISSUED',
        actor: 'Dr. Gregory Thorne',
        role: 'Chief Food Safety Officer',
        details: 'Urgent recall alert issued for Batch FT2026003. Contaminant: Patulin mycotoxin (148.5 ug/kg) in Valencia Orange Lot #B44. Retracted from 28 retail stores.'
      },
      {
        id: 'log-002',
        timestamp: '2026-10-23T14:05:00Z',
        batchId: 'FT2026004',
        action: 'STATUS CHANGED TO WARNING',
        actor: 'Dr. Bohdana Melnyk',
        role: 'Quality Control Specialist',
        details: 'Peroxide value flagged at 9.8 meq O2/kg. Secondary GC-MS analysis ordered. Retail hold applied.'
      },
      {
        id: 'log-003',
        timestamp: '2026-10-30T10:00:00Z',
        batchId: 'FT2026001',
        action: 'SAFETY CERTIFICATE VERIFIED',
        actor: 'Dr. Miranda Vance',
        role: 'Chief Food Safety Officer',
        details: 'Batch passed all microbial and antibiotic screens. Certified safe for national distribution.'
      },
      {
        id: 'log-004',
        timestamp: '2026-10-25T11:00:00Z',
        batchId: 'FT2026002',
        action: 'IMPORT SCREENING PASSED',
        actor: 'Agent S. Goldberg',
        role: 'Audit Inspector',
        details: 'Arsenic and pesticide screen cleared for 5,000 bags of Aged Basmati Rice. Batch marked safe.'
      },
      {
        id: 'log-005',
        timestamp: '2026-10-18T10:00:00Z',
        batchId: 'FT2026005',
        action: 'NEW BATCH REGISTERED & CERTIFIED',
        actor: 'Dr. Fiona Campbell',
        role: 'Quality Control Specialist',
        details: 'Acrylamide testing confirmed at 84 ug/kg (well below 500 ug/kg threshold). Batch released.'
      }
    ]
  };
}

// Database Helper functions
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB, falling back to default:', err);
    return getInitialData();
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

// Helper to calculate statistics
function calculateStats(batches: any[]) {
  const totalBatches = batches.length;
  // unique product names
  const uniqueProducts = new Set(batches.map((b) => b.productName)).size;
  const safeCount = batches.filter((b) => b.status === 'safe').length;
  const warningCount = batches.filter((b) => b.status === 'warning').length;
  const contaminatedCount = batches.filter((b) => b.status === 'contaminated').length;
  const activeRecalls = batches.filter((b) => b.isRecalled).length;

  const categoryMap: Record<string, { safe: number; warning: number; contaminated: number }> = {};
  batches.forEach((b) => {
    const cat = b.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { safe: 0, warning: 0, contaminated: 0 };
    }
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

// ---------------- REST API ROUTES ----------------

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FoodTrace Backend API', timestamp: new Date().toISOString() });
});

// 2. Get all product batches
app.get('/api/products', (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    count: db.batches.length,
    data: db.batches,
  });
});

// 3. Track product by Batch ID
app.get('/api/track/:batchId', (req, res) => {
  const query = (req.params.batchId || '').trim().toLowerCase();
  const db = readDb();

  const found = db.batches.find(
    (b: any) =>
      b.batchId.toLowerCase() === query ||
      b.id.toLowerCase() === query ||
      b.batchId.toLowerCase().replace(/[^a-z0-9]/g, '') === query.replace(/[^a-z0-9]/g, '')
  );

  if (!found) {
    return res.status(404).json({
      success: false,
      message: `No food product batch found matching ID "${req.params.batchId}".`,
      sampleSuggestions: ['FT2026001', 'FT2026002', 'FT2026003', 'FT2026004', 'FT2026005'],
    });
  }

  res.json({
    success: true,
    data: found,
  });
});

// 4. Dashboard statistics
app.get('/api/stats', (req, res) => {
  const db = readDb();
  const stats = calculateStats(db.batches);
  res.json({ success: true, data: stats });
});

// 5. Active contamination alerts & recalls
app.get('/api/alerts', (req, res) => {
  const db = readDb();
  const flagged = db.batches.filter((b: any) => b.status === 'contaminated' || b.status === 'warning' || b.isRecalled);
  res.json({ success: true, count: flagged.length, data: flagged });
});

// 6. Audit logs
app.get('/api/audit-logs', (req, res) => {
  const db = readDb();
  res.json({ success: true, count: db.auditLogs.length, data: db.auditLogs });
});

// 7. Admin authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Standard demo credentials or any provided valid email
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const role =
    email.includes('safety') || email.includes('officer')
      ? 'Chief Food Safety Officer'
      : email.includes('inspect')
      ? 'Audit Inspector'
      : 'Quality Control Specialist';

  res.json({
    success: true,
    user: {
      id: 'admin-' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role,
      token: 'jwt-ft-session-' + Date.now(),
    },
  });
});

// 8. Create new batch
app.post('/api/products', (req, res) => {
  const db = readDb();
  const payload = req.body;

  const generatedBatchId =
    payload.batchId && payload.batchId.trim()
      ? payload.batchId.trim().toUpperCase()
      : `FT2026${String(db.batches.length + 1).padStart(3, '0')}`;

  // Check duplicate
  if (db.batches.some((b: any) => b.batchId.toUpperCase() === generatedBatchId)) {
    return res.status(400).json({ success: false, message: `Batch ID "${generatedBatchId}" already exists.` });
  }

  const newBatch = {
    id: 'batch-' + Date.now(),
    batchId: generatedBatchId,
    productName: payload.productName || 'Unnamed Food Product',
    brandName: payload.brandName || 'Certified Harvest Ltd.',
    category: payload.category || 'General Food',
    imageUrl: payload.imageUrl || '/src/assets/images/product_pure_milk_1794004309309.jpg',
    mfgDate: payload.mfgDate || new Date().toISOString().split('T')[0],
    expiryDate: payload.expiryDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
    mfgYear: payload.mfgYear || new Date().getFullYear(),
    netWeight: payload.netWeight || '500g',
    status: payload.status || 'safe',
    isRecalled: payload.status === 'contaminated' || !!payload.isRecalled,
    recallNotice: payload.recallNotice || undefined,
    origin: payload.origin || {
      country: 'United States',
      state: 'California',
      district: 'Central Valley',
      farmName: 'Valley Organic Produce',
      farmerDetails: {
        name: 'Michael Davis',
        contactOrId: 'US-FARM-991',
        certification: 'USDA Organic',
        sustainablePractice: 'Integrated pest management',
      },
      collectionDate: new Date().toISOString(),
      sourceLocation: 'Central Valley Farmlands, CA',
    },
    ingredients: payload.ingredients || [
      {
        id: 'ing-' + Date.now(),
        name: 'Primary Organic Ingredient',
        percentage: '100%',
        supplierName: 'Certified Agri Producers',
        supplierOrigin: 'California, USA',
        supplierContact: '+1 (555) 019-2831',
        supplierLotId: 'LOT-RAW-' + Math.floor(1000 + Math.random() * 9000),
        qualityStatus: payload.status === 'contaminated' ? 'Contaminated' : 'Verified Safe',
      },
    ],
    manufacturing: payload.manufacturing || {
      company: 'Pure Harvest Processing Works',
      facilityName: 'Central Plant Line 1',
      factoryLocation: 'Bakersfield Industrial Hub, CA',
      mfgDate: new Date().toISOString(),
      processingDetails: 'Clean room handling, optical sorting, and hermetic packaging.',
      packagingDate: new Date().toISOString(),
      packagingType: 'Sanitized recyclable barrier container',
      storageConditions: 'Cool dry ambient or refrigerated according to standard specs',
      facilityCertifications: ['ISO 22000', 'HACCP Tier 3'],
    },
    supplyChain: payload.supplyChain || [
      {
        stepNumber: 1,
        title: 'Raw Material Collection',
        stageKey: 'collection',
        location: 'Source Farm Grounds',
        facilityOrVehicle: 'Harvester Field Unit',
        timestamp: new Date().toLocaleDateString() + ' 07:00 AM',
        status: 'completed',
        operatorOrInspector: 'Farm QC Staff',
        notes: 'Harvested under monitored conditions.',
      },
      {
        stepNumber: 2,
        title: 'Insulated Bulk Transit',
        stageKey: 'transport_processing',
        location: 'Highway Logistics Lane',
        facilityOrVehicle: 'Transport Unit #42',
        timestamp: new Date().toLocaleDateString() + ' 10:30 AM',
        status: 'completed',
        operatorOrInspector: 'Transport Logistics',
        notes: 'Cold chain verified.',
      },
      {
        stepNumber: 3,
        title: 'Intake Inspection & Rapid Testing',
        stageKey: 'intake_inspection',
        location: 'Processing Intake Bay',
        facilityOrVehicle: 'Analytical Bench #1',
        timestamp: new Date().toLocaleDateString() + ' 01:00 PM',
        status: 'completed',
        operatorOrInspector: 'Analytical QC Chemist',
        notes: 'Quality benchmarks satisfied.',
      },
      {
        stepNumber: 4,
        title: 'Manufacturing & Processing',
        stageKey: 'manufacturing',
        location: 'Main Production Line',
        facilityOrVehicle: 'Processing Skid Unit',
        timestamp: new Date().toLocaleDateString() + ' 03:00 PM',
        status: 'completed',
        operatorOrInspector: 'Plant Supervisor',
        notes: 'Processing parameters controlled.',
      },
      {
        stepNumber: 5,
        title: 'Hermetic Packaging',
        stageKey: 'packaging',
        location: 'Packaging Suite',
        facilityOrVehicle: 'Automated Line #3',
        timestamp: new Date().toLocaleDateString() + ' 05:00 PM',
        status: 'completed',
        operatorOrInspector: 'Packaging Lead',
        notes: 'Tamper-evident seals applied.',
      },
      {
        stepNumber: 6,
        title: 'Central Warehouse Storage',
        stageKey: 'warehousing',
        location: 'Logistics Vault Bay',
        facilityOrVehicle: 'High-Bay Staging Area',
        timestamp: new Date().toLocaleDateString() + ' 08:00 PM',
        status: 'completed',
        operatorOrInspector: 'Depot Manager',
        notes: 'Palletized and tagged.',
      },
      {
        stepNumber: 7,
        title: 'Regional Fleet Distribution',
        stageKey: 'distribution',
        location: 'Regional Route',
        facilityOrVehicle: 'Fleet Delivery Van',
        timestamp: new Date().toLocaleDateString() + ' 04:00 AM',
        status: 'completed',
        operatorOrInspector: 'Fleet Specialist',
        notes: 'Dispatched to retail partners.',
      },
      {
        stepNumber: 8,
        title: 'Retail Store Delivery',
        stageKey: 'retail',
        location: 'Supermarket Partner Store',
        facilityOrVehicle: 'Retail Display Unit',
        timestamp: new Date().toLocaleDateString() + ' 09:00 AM',
        status: 'completed',
        operatorOrInspector: 'Store Receiving Manager',
        notes: 'Available for consumer purchase.',
      },
    ],
    safetyReport: payload.safetyReport || {
      overallSafetyStatus: payload.status === 'contaminated' ? 'Contamination Detected / Unsafe' : payload.status === 'warning' ? 'Warning / Further Testing' : 'Safe',
      inspectionStatus: payload.status === 'contaminated' ? 'Failed - Contamination Found' : payload.status === 'warning' ? 'Under Investigation' : 'Passed',
      testingDate: new Date().toISOString().split('T')[0],
      laboratory: {
        name: 'National Food Safety & Analytical Testing Center (ISO/IEC 17025)',
        accreditation: 'ISO/IEC 17025:2017 #TC-7890',
        licenseNo: 'FDA-REF-2026-99',
        chiefAnalyst: 'Dr. Evelyn Carter, Ph.D.',
      },
      certificateNumber: `CERT-${generatedBatchId}-${Date.now().toString().slice(-4)}`,
      chemicalResidues: [
        { substance: 'Pesticide Residues (Multi-screen)', detectedValue: 'Non-Detectable', maxAllowableLimit: '0.010 mg/kg', status: 'Pass' },
        { substance: 'Antibiotics & Vet Drugs', detectedValue: 'Absent', maxAllowableLimit: '0.005 mg/kg', status: 'Pass' },
      ],
      microbialTests: [
        { pathogen: 'Salmonella spp.', result: 'Absent / 25g', standardRequirement: 'Absent / 25g', status: 'Pass' },
        { pathogen: 'E. coli', result: '<10 CFU/g', standardRequirement: '<100 CFU/g', status: 'Pass' },
      ],
      heavyMetals: [
        { metal: 'Lead (Pb)', detected: '<0.005 mg/kg', limit: '0.020 mg/kg', status: 'Pass' },
        { metal: 'Cadmium (Cd)', detected: '<0.002 mg/kg', limit: '0.010 mg/kg', status: 'Pass' },
      ],
      physicalInspection: {
        foreignParticles: 'Clean, no particulates',
        colorAndOdour: 'Fresh, standard product characteristics',
        packagingIntegrity: 'Vacuum hermetic seal 100% verified',
        status: 'Pass',
      },
      detectedContaminants: payload.status === 'contaminated' ? ['High Microbe Residue Detected'] : [],
      recommendations: payload.status === 'safe' ? 'Complies with all statutory food safety norms.' : 'Review required.',
    },
    lastUpdated: new Date().toISOString(),
  };

  db.batches.unshift(newBatch);

  // Add audit log
  const newLog = {
    id: 'log-' + Date.now(),
    timestamp: new Date().toISOString(),
    batchId: newBatch.batchId,
    action: 'NEW PRODUCT BATCH CREATED',
    actor: payload.actor || 'Administrator',
    role: payload.role || 'Chief Food Safety Officer',
    details: `Registered new batch ${newBatch.batchId} (${newBatch.productName}) with initial status: ${newBatch.status.toUpperCase()}.`,
  };
  db.auditLogs.unshift(newLog);

  writeDb(db);

  res.status(201).json({
    success: true,
    message: `Batch ${newBatch.batchId} created successfully.`,
    data: newBatch,
  });
});

// 9. Update batch information / status
app.put('/api/batches/:batchId', (req, res) => {
  const db = readDb();
  const batchId = req.params.batchId.toUpperCase();
  const index = db.batches.findIndex((b: any) => b.batchId.toUpperCase() === batchId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Batch ${batchId} not found.` });
  }

  const current = db.batches[index];
  const updated = {
    ...current,
    ...req.body,
    batchId: current.batchId, // immutable batchId
    lastUpdated: new Date().toISOString(),
  };

  db.batches[index] = updated;

  // Audit log
  db.auditLogs.unshift({
    id: 'log-' + Date.now(),
    timestamp: new Date().toISOString(),
    batchId: current.batchId,
    action: 'BATCH DETAILS UPDATED',
    actor: req.body.actor || 'Administrator',
    role: req.body.role || 'Quality Control Specialist',
    details: `Updated parameters for batch ${current.batchId}. Current status: ${updated.status.toUpperCase()}.`,
  });

  writeDb(db);
  res.json({ success: true, data: updated });
});

// 10. Update / upload laboratory test report
app.post('/api/batches/:batchId/reports', (req, res) => {
  const db = readDb();
  const batchId = req.params.batchId.toUpperCase();
  const index = db.batches.findIndex((b: any) => b.batchId.toUpperCase() === batchId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Batch ${batchId} not found.` });
  }

  const { report, newStatus, actor, role } = req.body;
  const current = db.batches[index];

  current.safetyReport = {
    ...current.safetyReport,
    ...report,
    testingDate: new Date().toISOString().split('T')[0],
  };

  if (newStatus) {
    current.status = newStatus;
    if (newStatus === 'contaminated') {
      current.isRecalled = true;
    }
  }

  current.lastUpdated = new Date().toISOString();
  db.batches[index] = current;

  db.auditLogs.unshift({
    id: 'log-' + Date.now(),
    timestamp: new Date().toISOString(),
    batchId: current.batchId,
    action: 'LAB REPORT RECORDED',
    actor: actor || 'Laboratory Analyst',
    role: role || 'Quality Control Specialist',
    details: `Laboratory Certificate #${current.safetyReport.certificateNumber} logged. Overall status evaluated as ${current.status.toUpperCase()}.`,
  });

  writeDb(db);
  res.json({ success: true, message: 'Safety test report updated successfully', data: current });
});

// 11. Issue Emergency Product Recall
app.post('/api/batches/:batchId/recall', (req, res) => {
  const db = readDb();
  const batchId = req.params.batchId.toUpperCase();
  const index = db.batches.findIndex((b: any) => b.batchId.toUpperCase() === batchId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: `Batch ${batchId} not found.` });
  }

  const { recallNotice, actor, role } = req.body;
  const current = db.batches[index];

  current.status = 'contaminated';
  current.isRecalled = true;
  current.recallNotice = recallNotice || {
    severity: 'Class I (High Risk)',
    alertDate: new Date().toISOString(),
    contaminationType: 'Microbiological',
    contaminatedIngredient: 'Identified raw ingredient lot',
    affectedLots: [batchId],
    affectedLocations: ['All active distribution hubs and supermarkets'],
    consumerActions: [
      'Immediately cease consumption of this food product.',
      'Return package to vendor for full refund or dispose safely.',
      'Seek medical advice if adverse reactions occur.',
    ],
    authorityHelpline: '1-800-555-FOOD-RECALL',
    reportingAgency: 'National Food Safety & Traceability Authority',
  };

  // Flag supply chain stages
  current.supplyChain = current.supplyChain.map((st: any) => ({
    ...st,
    status: st.stepNumber >= 6 ? 'quarantined' : st.status,
  }));

  current.lastUpdated = new Date().toISOString();
  db.batches[index] = current;

  db.auditLogs.unshift({
    id: 'log-' + Date.now(),
    timestamp: new Date().toISOString(),
    batchId: current.batchId,
    action: 'EMERGENCY RECALL ISSUED',
    actor: actor || 'Chief Food Safety Officer',
    role: role || 'Chief Food Safety Officer',
    details: `CRITICAL: Issued emergency product recall on ${current.productName} (${batchId}). Reason: ${current.recallNotice.contaminationType}. Locations notified.`,
  });

  writeDb(db);
  res.json({ success: true, message: `Emergency recall activated for batch ${batchId}.`, data: current });
});

// 12. Reset to original demo data
app.post('/api/reset', (req, res) => {
  const initial = getInitialData();
  writeDb(initial);
  res.json({ success: true, message: 'Database reset to initial demo state.' });
});

// ---------------- VITE & FRONTEND MOUNTING ----------------

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FoodTrace server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
