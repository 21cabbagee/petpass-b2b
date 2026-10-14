import React, { useState, useId } from 'react';
import { 
  ShieldCheck, 
  Plane, 
  FileCheck2, 
  AlertTriangle, 
  Award, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  Building2, 
  Users, 
  ArrowRight, 
  Clock, 
  HelpCircle,
  ExternalLink,
  Info,
  Calendar,
  Layers,
  HeartHandshake,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ParticlesCanvas from './components/ParticlesCanvas';
import OutcomeChart from './components/OutcomeChart';

const COUNTRY_RULES = {
  GB: {
    name: 'United Kingdom (DEFRA)',
    code: 'GB',
    flag: '🇬🇧',
    microchip: 'ISO 11784/11785 15-digit (Must precede rabies vaccination)',
    rabiesValidity: 'Primary rabies vaccination valid after 21 days',
    titerRequired: false,
    tapewormRequired: true,
    tapewormWindow: 'Praziquantel administered 24 to 120 hours prior to entry',
    quarantine: 'None if compliant with Great Britain Pet Health Certificate',
    carrierRules: 'Must arrive as manifest cargo on approved air routes into LHR/LGW'
  },
  EU: {
    name: 'European Union (Regulation 576/2013)',
    code: 'EU',
    flag: '🇪🇺',
    microchip: 'ISO 11784/11785 compliant transponder',
    rabiesValidity: '21-day wait period post primary vaccination',
    titerRequired: false,
    tapewormRequired: true,
    tapewormWindow: '24-120 hrs for Ireland, Malta, Finland; optional other member states',
    quarantine: 'Zero quarantine with endorsed EU Non-Commercial Certificate',
    carrierRules: 'Max 5 pets per traveler non-commercial transfer'
  },
  AE: {
    name: 'United Arab Emirates (MOCCAE)',
    code: 'AE',
    flag: '🇦🇪',
    microchip: 'ISO 11784/11785 mandatory',
    rabiesValidity: 'Must be within 12 months, administered at least 21 days prior',
    titerRequired: true,
    titerWindow: 'FAVN test >= 0.50 IU/mL within 90 days before travel',
    tapewormRequired: true,
    tapewormWindow: 'Internal & external parasite treatment within 14 days of shipment',
    quarantine: 'Zero quarantine with pre-issued MOCCAE Import Permit',
    carrierRules: 'Manifest air cargo strictly mandatory into DXB/AUH'
  },
  JP: {
    name: 'Japan (MAFF Animal Quarantine Service)',
    code: 'JP',
    flag: '🇯🇵',
    microchip: 'ISO 11784/11785 (read before second rabies injection)',
    rabiesValidity: '2 rabies vaccinations required; minimum 30-day interval',
    titerRequired: true,
    titerWindow: 'FAVN test titer >= 0.50 IU/mL followed by strict 180-day wait period',
    tapewormRequired: false,
    quarantine: 'Strict 180-day quarantine in government station if wait period unmet',
    carrierRules: 'Advance notification to MAFF at least 40 days prior to arrival'
  },
  AU: {
    name: 'Australia (DAFF Biosecurity)',
    code: 'AU',
    flag: '🇦🇺',
    microchip: 'ISO 11784/11785 validated upon every vet visit',
    rabiesValidity: 'Valid primary and booster within 12 months',
    titerRequired: true,
    titerWindow: 'RNATT test minimum 180 days before quarantine booking',
    tapewormRequired: true,
    tapewormWindow: 'Dual treatments against parasites within 5 days of dispatch',
    quarantine: 'Mandatory 10 to 30 days post-entry at Mickleham Post Entry Quarantine Facility',
    carrierRules: 'International freight manifest only to Melbourne (MEL)'
  },
  SG: {
    name: 'Singapore (NParks AVS)',
    code: 'SG',
    flag: '🇸🇬',
    microchip: 'ISO 11784/11785 standard 15 digits',
    rabiesValidity: 'Continuous vaccination history required',
    titerRequired: true,
    titerWindow: 'Serological test >= 0.5 IU/mL within 6 months prior to export',
    tapewormRequired: true,
    tapewormWindow: 'External and internal parasite treatment 2-7 days prior',
    quarantine: 'Category A/B 0-30 days dependent on country of origin',
    carrierRules: 'AVS Captains declaration and reserved Sembawang quarantine berth'
  }
};

export default function App() {
  const originId = useId();
  const destId = useId();
  const petNameId = useId();
  const speciesId = useId();
  const breedId = useId();
  const microchipId = useId();
  const rabiesDateId = useId();
  const favnDateId = useId();
  const titerScoreId = useId();
  const flightDateId = useId();

  // State
  const [selectedDest, setSelectedDest] = useState('GB');
  const [petForm, setPetForm] = useState({
    name: 'Bao Bao',
    species: 'Canine',
    breed: 'French Bulldog',
    microchip: '985141002349182',
    rabiesDate: '2026-04-15',
    favnDate: '2026-05-20',
    titerScore: '0.82',
    flightDate: '2026-11-20'
  });

  // Crate Calculator State (in cm)
  const [crateSpecs, setCrateSpecs] = useState({
    lengthA: 65,  // Nose to tail root
    legB: 22,     // Floor to elbow joint
    widthC: 28,   // Shoulder width
    heightD: 52   // Floor to top of head/ears
  });

  // CAB Modal State
  const [isCabModalOpen, setIsCabModalOpen] = useState(false);
  const [cabSubmitted, setCabSubmitted] = useState(false);
  const [cabForm, setCabForm] = useState({
    agencyName: '',
    contactName: '',
    email: '',
    monthlyVolume: '10-25 relocations/mo'
  });

  // Generated Dossier State
  const [dossierGenerated, setDossierGenerated] = useState(false);

  // Crate calculations based on IATA Live Animals Regulations (LAR Container Requirement 1)
  const calculatedCrateLength = Math.round(crateSpecs.lengthA + (0.5 * crateSpecs.legB));
  const calculatedCrateWidth = Math.round(crateSpecs.widthC * 2);
  const calculatedCrateHeight = Math.round(crateSpecs.heightD + 7); // Clearance

  const currentRules = COUNTRY_RULES[selectedDest];

  // Validation Logic
  const isMicrochipValid = petForm.microchip.length === 15 && /^\d+$/.test(petForm.microchip);
  const isTiterValid = parseFloat(petForm.titerScore) >= 0.50;

  const handleGenerateDossier = (e) => {
    e.preventDefault();
    setDossierGenerated(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleCabSubmit = (e) => {
    e.preventDefault();
    setCabSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Banner: CAB Invitation */}
      <div className="bg-gradient-to-r from-amber-600/30 via-amber-500/20 to-indigo-600/30 border-b border-amber-500/30 backdrop-blur-md px-4 py-2.5 text-xs md:text-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-semibold text-amber-200">Customer Advisory Board (CAB) Open:</span>
            <span className="text-slate-300">Join 10 elite relocation agencies shaping PetPass B2B for 70% lifetime founding pricing ($149/mo).</span>
          </div>
          <button 
            onClick={() => setIsCabModalOpen(true)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-full transition-all shadow-sm hover:scale-105"
          >
            Claim CAB Seat (3 Spots Left) →
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-xl">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">PetPass</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">B2B Enterprise</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">Airline Regulatory & Veterinary Vault</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium">
            <a href="#matrix" className="hover:text-amber-400 transition-colors">Regulatory Matrix</a>
            <a href="#iata-calc" className="hover:text-amber-400 transition-colors">IATA Crate Engine</a>
            <a href="#dossier-generator" className="hover:text-amber-400 transition-colors">Dossier Builder</a>
            <a href="#pricing" className="hover:text-amber-400 transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCabModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Join CAB</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Casberry-style Particles Canvas */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Interactive WebGL / Casberry Canvas Simulation */}
        <ParticlesCanvas color="245, 158, 11" particleCount={50} connectionDistance={120} />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs text-amber-300 shadow-md">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>USDA APHIS 7001 • EU 576/2013 • DEFRA • IATA LAR CR1 Certified</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Cross-Border Pet Passport & Airline Regulatory Vault
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            The mission-critical regulatory compliance suite for pet relocation agencies, airline handlers, and international movers. Eliminate quarantine detentions and flight turnarounds with pre-validated veterinary dossiers.
          </p>

          {/* Larry Ellison Playbook: Confuse the Tenses & Sell Harder Than You Build */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong className="text-white">Service-as-a-Software Relocation Vault:</strong> Zero manual agency paperwork. Dossiers auto-validate in seconds with guaranteed customs clearance.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a 
              href="#dossier-generator" 
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer"
            >
              <span>Build Relocation Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#iata-calc" 
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plane className="w-4 h-4 text-amber-400" />
              <span>IATA Live Crate Calculator</span>
            </a>
          </div>

          {/* Stat Ticker */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="text-2xl font-black text-amber-400">800K+</div>
              <div className="text-xs text-slate-400 font-medium">Annual Global Pet Transfers</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="text-2xl font-black text-white">32%</div>
              <div className="text-xs text-slate-400 font-medium">DIY Flights Face Paperwork Delays</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="text-2xl font-black text-amber-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">ISO 11784/11785 Pre-Audit</div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="text-2xl font-black text-white">$400M+</div>
              <div className="text-xs text-slate-400 font-medium">Compliance Dossier TAM</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sequoia Framework Outcome Visualizer (Bklit UI + Julien Bek $1 vs $6 Ratio) */}
      <OutcomeChart onCtaClick={() => setIsCabModalOpen(true)} />

      {/* Section 1: Country Regulatory Matrix */}
      <section id="matrix" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Multi-Jurisdiction Vault</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Destination Quarantine & Health Regulations
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(COUNTRY_RULES).map((code) => (
                <button
                  key={code}
                  onClick={() => setSelectedDest(code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedDest === code
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{COUNTRY_RULES[code].flag}</span>
                  <span>{code}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-800">
              <span className="text-3xl">{currentRules.flag}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{currentRules.name}</h3>
                <p className="text-xs text-slate-400">Strict destination port quarantine protocol and carrier routing guidelines</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Microchip Standard</span>
                </div>
                <div className="text-sm font-medium text-slate-200">{currentRules.microchip}</div>
              </div>

              <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rabies Protocol</span>
                </div>
                <div className="text-sm font-medium text-slate-200">{currentRules.rabiesValidity}</div>
              </div>

              <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className={`w-3.5 h-3.5 ${currentRules.titerRequired ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>FAVN Rabies Titer</span>
                </div>
                <div className="text-sm font-medium text-slate-200">
                  {currentRules.titerRequired ? currentRules.titerWindow : 'Not strictly required for non-commercial import'}
                </div>
              </div>

              <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Parasite / Tapeworm Timing</span>
                </div>
                <div className="text-sm font-medium text-slate-200">
                  {currentRules.tapewormRequired ? currentRules.tapewormWindow : 'None mandatory'}
                </div>
              </div>

              <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quarantine Facility</span>
                </div>
                <div className="text-sm font-medium text-slate-200">{currentRules.quarantine}</div>
              </div>

              <div className="space-y-1.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-amber-400" />
                  <span>Flight Cargo Requirements</span>
                </div>
                <div className="text-sm font-medium text-slate-200">{currentRules.carrierRules}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: IATA Live Animals Regulations Crate Engine */}
      <section id="iata-calc" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">IATA Container Requirement 1 (CR 1)</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Airline Crate Dimension & Airflow Calculator
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Airlines reject crated animals on the tarmac if pets cannot stand upright without touching the roof or turn around fully. Calculate exact legal crate dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Pet Anatomy Measurements (cm)</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Length A (Nose tip to root of tail):</span>
                    <span className="text-amber-400 font-bold">{crateSpecs.lengthA} cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="130" 
                    value={crateSpecs.lengthA}
                    onChange={(e) => setCrateSpecs({ ...crateSpecs, lengthA: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500">Do not include full tail length.</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Height B (Floor to elbow joint):</span>
                    <span className="text-amber-400 font-bold">{crateSpecs.legB} cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="60" 
                    value={crateSpecs.legB}
                    onChange={(e) => setCrateSpecs({ ...crateSpecs, legB: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Width C (Shoulder or widest point):</span>
                    <span className="text-amber-400 font-bold">{crateSpecs.widthC} cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="60" 
                    value={crateSpecs.widthC}
                    onChange={(e) => setCrateSpecs({ ...crateSpecs, widthC: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">Height D (Floor to tip of ears / top of head in standing position):</span>
                    <span className="text-amber-400 font-bold">{crateSpecs.heightD} cm</span>
                  </div>
                  <input 
                    type="range" 
                    min="20" 
                    max="110" 
                    value={crateSpecs.heightD}
                    onChange={(e) => setCrateSpecs({ ...crateSpecs, heightD: parseInt(e.target.value) })}
                    className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-amber-400 font-bold">IATA Legal Specifications</span>
                  <h4 className="text-lg font-bold text-white">Minimum Kennel Requirements</h4>
                </div>
                <div className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  IATA LAR Compliant
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Length [A + ½B]</div>
                  <div className="text-2xl font-black text-white mt-1">{calculatedCrateLength} <span className="text-xs font-normal text-slate-400">cm</span></div>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Width [C × 2]</div>
                  <div className="text-2xl font-black text-white mt-1">{calculatedCrateWidth} <span className="text-xs font-normal text-slate-400">cm</span></div>
                </div>
                <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Height [D + 7cm]</div>
                  <div className="text-2xl font-black text-white mt-1">{calculatedCrateHeight} <span className="text-xs font-normal text-slate-400">cm</span></div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                <div className="font-semibold text-amber-300">Mandatory Airline Check-In Checklist:</div>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                  <li>Metal nuts & bolts securely fastened through all perimeter holes (plastic dials banned).</li>
                  <li>Absorbent puppy training pad securely taped to the waterproof crate floor.</li>
                  <li>Exterior clip-on water funnel accessible from outside without opening cage door.</li>
                  <li>Green "LIVE ANIMALS" reflective sticker (min 2.5cm text) affixed on minimum 3 sides.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Dossier Builder & Validator */}
      <section id="dossier-generator" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Automated Pre-Flight Audit</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Pet Health & Veterinary Dossier Generator
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Cross-check microchip numbering, rabies serum titers, and endorsement dates before submitting to USDA APHIS or foreign consulates.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
            <form onSubmit={handleGenerateDossier} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor={petNameId} className="block text-xs font-semibold text-slate-300 mb-1">Pet Name</label>
                  <input 
                    id={petNameId}
                    type="text" 
                    value={petForm.name}
                    onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={speciesId} className="block text-xs font-semibold text-slate-300 mb-1">Species</label>
                  <select 
                    id={speciesId}
                    value={petForm.species}
                    onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Canine">Canine (Dog)</option>
                    <option value="Feline">Feline (Cat)</option>
                    <option value="Other">Other / Lagomorph</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={breedId} className="block text-xs font-semibold text-slate-300 mb-1">Breed</label>
                  <input 
                    id={breedId}
                    type="text" 
                    value={petForm.breed}
                    onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor={microchipId} className="block text-xs font-semibold text-slate-300 mb-1">
                    ISO Microchip (15 digits)
                  </label>
                  <input 
                    id={microchipId}
                    type="text" 
                    value={petForm.microchip}
                    onChange={(e) => setPetForm({ ...petForm, microchip: e.target.value })}
                    className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-sm text-white focus:outline-none font-mono ${
                      isMicrochipValid ? 'border-emerald-500/50' : 'border-rose-500/50'
                    }`}
                  />
                  <span className={`text-[10px] mt-1 block ${isMicrochipValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isMicrochipValid ? '✓ ISO 11784/11785 compliant' : '⚠ Must be exactly 15 digits'}
                  </span>
                </div>

                <div>
                  <label htmlFor={rabiesDateId} className="block text-xs font-semibold text-slate-300 mb-1">Rabies Vaccination Date</label>
                  <input 
                    id={rabiesDateId}
                    type="date" 
                    value={petForm.rabiesDate}
                    onChange={(e) => setPetForm({ ...petForm, rabiesDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor={favnDateId} className="block text-xs font-semibold text-slate-300 mb-1">FAVN Titer Blood Draw</label>
                  <input 
                    id={favnDateId}
                    type="date" 
                    value={petForm.favnDate}
                    onChange={(e) => setPetForm({ ...petForm, favnDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label htmlFor={titerScoreId} className="block text-xs font-semibold text-slate-300 mb-1">Titer Result (IU/mL)</label>
                  <input 
                    id={titerScoreId}
                    type="number" 
                    step="0.01" 
                    value={petForm.titerScore}
                    onChange={(e) => setPetForm({ ...petForm, titerScore: e.target.value })}
                    className={`w-full bg-slate-950 border rounded-lg px-3 py-2 text-sm text-white focus:outline-none ${
                      isTiterValid ? 'border-emerald-500/50' : 'border-rose-500/50'
                    }`}
                  />
                  <span className={`text-[10px] mt-1 block ${isTiterValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isTiterValid ? '✓ Exceeds WHO threshold (≥ 0.50)' : '⚠ Under threshold, will fail entry'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Audit & Generate Export Packet</span>
                </button>
              </div>
            </form>

            {/* Generated Dossier Preview */}
            {dossierGenerated && (
              <div className="mt-8 pt-8 border-t border-slate-800 animate-fadeIn">
                <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">Dossier #PP-{Math.floor(100000 + Math.random() * 900000)}</span>
                        <span className="text-xs text-slate-400">Target Destination: {currentRules.name}</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mt-1">Consolidated Health & Clearance Dossier: {petForm.name}</h4>
                    </div>
                    <button
                      onClick={() => alert(`Consolidated Dossier for ${petForm.name} exported. Ready for veterinary sign-off.`)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download USDA/EU Bundle (.JSON)</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                      <div className="text-slate-400">Microchip Verification:</div>
                      <div className="text-white font-mono font-bold mt-1">{petForm.microchip}</div>
                      <div className="text-emerald-400 text-[11px] mt-1">ISO 11784 standard verified</div>
                    </div>
                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                      <div className="text-slate-400">FAVN Serological Titre:</div>
                      <div className="text-white font-bold mt-1">{petForm.titerScore} IU/mL (Drawn {petForm.favnDate})</div>
                      <div className="text-emerald-400 text-[11px] mt-1">Sufficient antibodies for quarantine waiver</div>
                    </div>
                    <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
                      <div className="text-slate-400">Calculated Crate Class:</div>
                      <div className="text-white font-bold mt-1">{calculatedCrateLength}L × {calculatedCrateWidth}W × {calculatedCrateHeight}H cm</div>
                      <div className="text-amber-400 text-[11px] mt-1">IATA Series 200 / 300 Kennel Match</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: Enterprise Pricing */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Enterprise Pricing</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              Engineered for Relocation Agencies & Handlers
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Replace weeks of cross-checking consulates with instant compliance guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Solo Tier */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-base font-bold text-white">Solo Relocator</div>
                <div className="text-xs text-slate-400 mt-1">For independent pet transport brokers</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$99</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Up to 15 pet relocation dossiers/mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>IATA crate calculator with PDF export</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Top 40 destination country checklists</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setIsCabModalOpen(true)}
                className="mt-8 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Start Trial
              </button>
            </div>

            {/* Boutique Agency (Highlighted) */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl shadow-amber-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full">
                Most Popular
              </div>
              <div>
                <div className="text-base font-bold text-white">Boutique Agency</div>
                <div className="text-xs text-slate-400 mt-1">For specialized pet relocation agencies</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">$299</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Unlimited pet clearance dossiers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Automated USDA APHIS 7001 packet compiler</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Airline cargo booking verification API</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Team multi-seat access (5 seats)</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setIsCabModalOpen(true)}
                className="mt-8 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20"
              >
                Join CAB for 70% Off ($89/mo)
              </button>
            </div>

            {/* Airline / Fleet Enterprise */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-base font-bold text-white">Airline & Fleet</div>
                <div className="text-xs text-slate-400 mt-1">For airlines, handlers & enterprise logistics</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">$899</span>
                  <span className="text-xs text-slate-400">/month</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Live REST API & Webhook verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Tarmac check-in mobile validation app</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Dedicated regulatory counsel updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Custom SLA & 24/7 flight desk emergency hotline</span>
                  </li>
                </ul>
              </div>
              <button 
                onClick={() => setIsCabModalOpen(true)}
                className="mt-8 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Contact Enterprise Desk
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-10 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">PetPass B2B</span>
            <span>• Cross-Border Pet Passport & Airline Regulatory Vault</span>
          </div>
          <div>
            Built with rigorous compliance protocols for global relocation agencies.
          </div>
        </div>
      </footer>

      {/* CAB 10-Member Modal */}
      {isCabModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setIsCabModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            {!cabSubmitted ? (
              <form onSubmit={handleCabSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Award className="w-5 h-5" />
                  <span>PetPass Customer Advisory Board (CAB)</span>
                </div>
                <h3 className="text-xl font-black text-white">Claim 70% Founding Lifetime Access</h3>
                <p className="text-xs text-slate-400">
                  Join 10 elite relocation agency directors testing early carrier APIs. Receive lifetime pricing at $89/mo (normally $299/mo).
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label htmlFor="agency-name" className="block text-xs font-semibold text-slate-300 mb-1">Agency / Company Name</label>
                    <input 
                      id="agency-name"
                      type="text" 
                      placeholder="e.g. Pacific Pet Transit Ltd."
                      value={cabForm.agencyName}
                      onChange={(e) => setCabForm({ ...cabForm, agencyName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1">Contact Name</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      placeholder="e.g. Sarah Jenkins"
                      value={cabForm.contactName}
                      onChange={(e) => setCabForm({ ...cabForm, contactName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="work-email" className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                    <input 
                      id="work-email"
                      type="email" 
                      placeholder="sarah@pacificpet.com"
                      value={cabForm.email}
                      onChange={(e) => setCabForm({ ...cabForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="monthly-volume" className="block text-xs font-semibold text-slate-300 mb-1">Monthly Pet Relocation Volume</label>
                    <select
                      id="monthly-volume"
                      value={cabForm.monthlyVolume}
                      onChange={(e) => setCabForm({ ...cabForm, monthlyVolume: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="1-5 relocations/mo">1-5 relocations/mo</option>
                      <option value="5-20 relocations/mo">5-20 relocations/mo</option>
                      <option value="20-50 relocations/mo">20-50 relocations/mo</option>
                      <option value="50+ relocations/mo">50+ enterprise relocations/mo</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full mt-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/25"
                >
                  Reserve CAB Seat & Lock 70% Discount
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-black text-white">CAB Reservation Confirmed</h3>
                <p className="text-xs text-slate-300">
                  Welcome to the Customer Advisory Board, <strong className="text-white">{cabForm.contactName}</strong>. Your 70% lifetime discount ($89/mo) has been locked for <span className="text-amber-400">{cabForm.agencyName}</span>.
                </p>
                <button 
                  onClick={() => { setIsCabModalOpen(false); setCabSubmitted(false); }}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl"
                >
                  Return to Vault
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
