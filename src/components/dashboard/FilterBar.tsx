import React from 'react';
import { Globe, Filter, HelpCircle, RefreshCw } from 'lucide-react';

interface FilterBarProps {
  selectedCountry: string;
  setSelectedCountry: (val: string) => void;
  countries: string[];
  selectedProductLine: string;
  setSelectedProductLine: (val: string) => void;
  productLines: string[];
  showSetupGuide: boolean;
  setShowSetupGuide: (val: boolean) => void;
  loading: boolean;
  fetchData: (forceDemo?: boolean) => Promise<void>;
}

export default function FilterBar({
  selectedCountry,
  setSelectedCountry,
  countries,
  selectedProductLine,
  setSelectedProductLine,
  productLines,
  showSetupGuide,
  setShowSetupGuide,
  loading,
  fetchData
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Country Selector */}
      <div className="flex items-center gap-2 bg-[#0c1220] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
        <Globe className="w-3.5 h-3.5 text-slate-400" />
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="bg-transparent text-slate-200 border-none outline-none font-bold cursor-pointer pr-1"
        >
          <option value="All" className="bg-[#0c1220]">All Countries</option>
          {countries.map(c => (
            <option key={c} value={c} className="bg-[#0c1220]">{c}</option>
          ))}
        </select>
      </div>

      {/* Product Line Selector */}
      <div className="flex items-center gap-2 bg-[#0c1220] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400" />
        <select
          value={selectedProductLine}
          onChange={(e) => setSelectedProductLine(e.target.value)}
          className="bg-transparent text-slate-200 border-none outline-none font-bold cursor-pointer pr-1"
        >
          <option value="All" className="bg-[#0c1220]">All Product Lines</option>
          {productLines.map(pl => (
            <option key={pl} value={pl} className="bg-[#0c1220]">{pl}</option>
          ))}
        </select>
      </div>

      {/* Setup API Toggle Button */}
      <button
        onClick={() => setShowSetupGuide(!showSetupGuide)}
        className={`px-3 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-1.5 ${
          showSetupGuide
            ? 'border-blue-500 text-blue-400 bg-blue-500/10'
            : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
        }`}
      >
        <HelpCircle className="w-4 h-4" />
        Setup API
      </button>

      {/* Sync Button */}
      <button
        onClick={() => fetchData(false)}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)]"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        Sync
      </button>
    </div>
  );
}
