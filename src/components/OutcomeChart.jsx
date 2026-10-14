import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Zap, DollarSign, CheckCircle2, Plane, AlertTriangle } from 'lucide-react';

/**
 * OutcomeChart for PetPass B2B (Bklit UI + Julien Bek $1:$6 Sequoia Framework + Larry Ellison ROI Engine)
 * Compares $1,200 manual agency paperwork & $3,500 emergency airport quarantine fines ($6 human agency waste) with Autonomous Airline Vault Dossiers ($1 software).
 */
export default function OutcomeChart({
  serviceName = "Pet Relocation Agency & Airline Compliance Escrow",
  defaultMonthlyRelocations = 30,
  onCtaClick
}) {
  const [relocations, setRelocations] = useState(defaultMonthlyRelocations);

  // Legacy agency: 22 staff hours per animal dossier ($1,150) + 8% quarantine rejection rate ($280 amortized fine risk) = $1,430/relocation
  const legacyTotalBurden = relocations * 1430;
  // PetPass B2B software dossier fee: $65/pet
  const autoSoftwareCost = relocations * 65;
  const netAgencySavings = legacyTotalBurden - autoSoftwareCost;
  const savingsPercent = Math.round(((legacyTotalBurden - autoSoftwareCost) / legacyTotalBurden) * 100);

  const maxCost = Math.max(legacyTotalBurden, 1);
  const legacyBarHeight = 100;
  const autoBarHeight = Math.max(Math.round((autoSoftwareCost / maxCost) * 100), 10);

  return (
    <div className="relative rounded-2xl border border-amber-500/30 bg-slate-900/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl overflow-hidden my-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border bg-slate-950 border-amber-500/40 text-amber-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            The Sequoia Equation: Software ($1) vs Relocation Paperwork Agencies ($6)
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Relocation Agency Margin Economics: <span className="text-amber-400">{savingsPercent}% Overhead Slash</span>
          </h3>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            A single missing rabies titer window or wrong crate dimension triggers a $3,500 Mickleham or Sembawang quarantine detention. We replace manual paperwork agents with deterministic IATA/USDA regulatory clearance vaults.
          </p>
        </div>

        <div className="text-right bg-slate-950/80 border border-amber-500/30 rounded-xl p-3 px-4 min-w-[190px]">
          <span className="text-[11px] text-slate-400 block font-medium">Monthly Agency Profit Retained</span>
          <span className="text-2xl md:text-3xl font-black text-amber-400">
            ${netAgencySavings.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-300/80 flex items-center justify-end gap-1 font-semibold font-mono">
            <TrendingUp className="w-3 h-3" /> 0% Quarantine Detention
          </span>
        </div>
      </div>

      {/* Interactive Volume Slider */}
      <div className="py-6 border-b border-white/10">
        <div className="flex items-center justify-between text-sm mb-3">
          <label className="text-slate-300 font-semibold flex items-center gap-2">
            <Plane className="w-4 h-4 text-amber-400" />
            Monthly International Pet Relocations Handled:
          </label>
          <span className="text-base font-bold text-white bg-slate-950 px-3 py-1 rounded-lg border border-amber-500/30 font-mono">
            {relocations} Relocations / mo (${(legacyTotalBurden * 12).toLocaleString()}/yr Agency Burden)
          </span>
        </div>
        <input 
          type="range" 
          min={5} 
          max={150} 
          step={5}
          value={relocations}
          onChange={(e) => setRelocations(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
        <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
          <span>5 Pets (Boutique Mover)</span>
          <span>30 Pets (Regional Relocation Agency)</span>
          <span>150+ Pets (Global Carrier Cargo Desk)</span>
        </div>
      </div>

      {/* Bklit UI Visual Comparison Chart & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 items-center">
        {/* SVG Visual Bars */}
        <div className="md:col-span-5 bg-slate-950 rounded-xl p-5 border border-white/10">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between font-mono">
            <span>Monthly Relocation Cost Comparison</span>
            <span className="text-[10px] text-slate-500">Live Simulation</span>
          </div>

          <div className="space-y-4">
            {/* Legacy Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Manual Agency Hours + Detention Risk ($6)
                </span>
                <span className="font-mono font-bold text-rose-300">${legacyTotalBurden.toLocaleString()}</span>
              </div>
              <div className="h-6 w-full bg-slate-900 rounded-lg overflow-hidden border border-rose-950/40">
                <div 
                  className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-300 rounded-lg"
                  style={{ width: `${legacyBarHeight}%` }}
                />
              </div>
            </div>

            {/* Autonomous Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  PetPass B2B Regulatory Vault ($1)
                </span>
                <span className="font-mono font-bold text-amber-300">${autoSoftwareCost.toLocaleString()}</span>
              </div>
              <div className="h-6 w-full bg-slate-900 rounded-lg overflow-hidden border border-amber-950/40">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-300 rounded-lg shadow-lg shadow-amber-500/30"
                  style={{ width: `${autoBarHeight}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Annual Net Profit Reclaimed:</span>
            <span className="text-sm font-bold text-amber-400">+${(netAgencySavings * 12).toLocaleString()}</span>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="md:col-span-7 space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">USDA APHIS 7001 & DEFRA Compliance</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Cross-validates rabies vaccination lot numbers, microchip ISO timestamps, and FAVN titer intervals against destination country requirements.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">IATA LAR CR1 Crate Engine</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculates snout-to-tail and standing head clearance equations, preventing rejected tarmac boarding by Singapore Airlines, British Airways, and Emirates cargo desks.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Guaranteed Zero-Quarantine Pass</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                If an animal dossier validated by PetPass B2B is refused boarding or held at customs, PetPass pays the carrier rebooking fee in full.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
