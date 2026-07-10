import React from 'react';
import { CheckSquare } from 'lucide-react';

interface AuditResults {
  schemaValid: boolean;
  datesValid: boolean;
  shippingValid: boolean;
  keysValid: boolean;
  totalIssues: number;
}

interface DataQualityAuditProps {
  auditResults: AuditResults;
}

export default function DataQualityAudit({ auditResults }: DataQualityAuditProps) {
  return (
    <div className="lg:col-span-12 premium-card rounded-2xl p-6 shadow-lg animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-500" />
            Data Quality Validation Audit (Kiểm tra chất lượng sự kiện/dữ liệu)
          </h3>
          <p className="text-xs text-slate-500">Real-time database integrity audit logs and validation indicators</p>
        </div>
        {auditResults.totalIssues === 0 ? (
          <span className="text-[10px] bg-cyan-400/10 border border-emerald-500/30 text-emerald-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
            Pass - No issues
          </span>
        ) : (
          <span className="text-[10px] bg-rose-500/10 border border-rose-500/30 text-rose-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
            Fail - {auditResults.totalIssues} Warnings
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono mt-4">
        {/* Schema Integrity */}
        <div className="bg-[#050810] border border-slate-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 block font-semibold">Schema Validation</span>
            <span className="text-[10px] text-slate-500">Quantity & prices positive</span>
          </div>
          {auditResults.schemaValid ? (
            <span className="text-[9px] bg-cyan-400/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">OK</span>
          ) : (
            <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded uppercase">Error</span>
          )}
        </div>

        {/* Temporal Consistency */}
        <div className="bg-[#050810] border border-slate-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 block font-semibold">Temporal Consistency</span>
            <span className="text-[10px] text-slate-500">Order Dates ISO formatted</span>
          </div>
          {auditResults.datesValid ? (
            <span className="text-[9px] bg-cyan-400/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">OK</span>
          ) : (
            <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded uppercase">Error</span>
          )}
        </div>

        {/* Shipping Timeline Integrity */}
        <div className="bg-[#050810] border border-slate-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 block font-semibold">Shipping Date Consistency</span>
            <span className="text-[10px] text-slate-500">Shipped Date &gt;= Order Date</span>
          </div>
          {auditResults.shippingValid ? (
            <span className="text-[9px] bg-cyan-400/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">OK</span>
          ) : (
            <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded uppercase font-bold">Warning</span>
          )}
        </div>

        {/* Referential Mapping */}
        <div className="bg-[#050810] border border-slate-950 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 block font-semibold">Referential Mapping</span>
            <span className="text-[10px] text-slate-500">Unique order mapping check</span>
          </div>
          {auditResults.keysValid ? (
            <span className="text-[9px] bg-cyan-400/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">OK</span>
          ) : (
            <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded uppercase font-bold">Error</span>
          )}
        </div>
      </div>
    </div>
  );
}
