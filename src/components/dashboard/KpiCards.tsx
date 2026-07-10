import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Truck } from 'lucide-react';
import { INDUSTRY_BENCHMARKS } from './benchmarks';

interface KpiCardsProps {
  totalSales: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  lateShippingRate: number;
  lateOrders: number;
  totalOrders: number;
  filteredTransactionsLength: number;
  lateShippingRevenue: number;
  topMarketShare: { name: string; share: number } | null;
  formatCurrency: (val: number) => string;
}

export default function KpiCards({
  totalSales,
  totalCost,
  totalProfit,
  profitMargin,
  lateShippingRate,
  lateOrders,
  totalOrders,
  filteredTransactionsLength,
  lateShippingRevenue,
  topMarketShare,
  formatCurrency
}: KpiCardsProps) {
  const marginBenchmark = INDUSTRY_BENCHMARKS.grossMargin;
  const marginPosition = Math.max(0, Math.min(100, ((profitMargin - marginBenchmark.low) / (marginBenchmark.high - marginBenchmark.low)) * 100));
  const marginStatus = profitMargin < marginBenchmark.low ? 'below' : profitMargin > marginBenchmark.high ? 'above' : 'within';

  const shippingCritical = lateShippingRate > INDUSTRY_BENCHMARKS.lateShippingRate.threshold;
  const lateImpactPercent = totalSales > 0 ? (lateShippingRevenue / totalSales) * 100 : 0;

  return (
    <>
      {/* KPI 1: REVENUE CARD (Span 3) */}
      <div className="lg:col-span-3 premium-card rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 group shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Revenue</span>
            <h3 className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-blue-400 transition-colors">
              {formatCurrency(totalSales)}
            </h3>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-500">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-900/50 flex items-center justify-between text-[10px] text-slate-400">
          <span>{filteredTransactionsLength} line items</span>
          {topMarketShare && (
            <span className="font-mono">
              Top: <span className="text-blue-400 font-bold">{topMarketShare.name} {topMarketShare.share.toFixed(0)}%</span>
            </span>
          )}
        </div>
      </div>

      {/* KPI 2: COST OF SALES CARD (Span 3) */}
      <div className="lg:col-span-3 premium-card rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 group shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cost of Sales (COGS)</span>
            <h3 className="text-2xl font-bold font-mono text-slate-100 mt-1 group-hover:text-amber-400 transition-colors">
              {formatCurrency(totalCost)}
            </h3>
          </div>
          <div className="bg-amber-600/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-500">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-900/50 flex items-center justify-between text-[10px] text-slate-400">
          <span>Giá vốn hàng bán</span>
          <span className="font-mono text-amber-400 font-bold">
            {totalSales > 0 ? ((totalCost / totalSales) * 100).toFixed(1) : 0}% of Revenue
          </span>
        </div>
      </div>

      {/* KPI 3: GROSS PROFIT CARD (Span 3) */}
      <div className="lg:col-span-3 premium-card rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 group shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Gross Profit</span>
            <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-1 group-hover:text-emerald-300 transition-colors shadow-emerald-950">
              {formatCurrency(totalProfit)}
            </h3>
          </div>
          <div className="bg-emerald-600/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        {/* Benchmark Gauge */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mb-1">
            <span>{marginBenchmark.low}%</span>
            <span className={`font-bold ${marginStatus === 'below' ? 'text-rose-400' : marginStatus === 'above' ? 'text-cyan-400' : 'text-emerald-400'}`}>
              {profitMargin.toFixed(1)}% Gross Margin
            </span>
            <span>{marginBenchmark.high}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-emerald-500/20 to-cyan-500/20 rounded-full" />
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shadow-lg ${
                marginStatus === 'below' ? 'bg-rose-500' : marginStatus === 'above' ? 'bg-cyan-400' : 'bg-emerald-400'
              }`}
              style={{ left: `${Math.max(2, Math.min(98, marginPosition))}%` }}
            />
          </div>
          <p className="text-[9px] text-slate-600 font-mono mt-1.5">
            Benchmark: {marginBenchmark.label} ({marginBenchmark.low}-{marginBenchmark.high}%)
          </p>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-900/50 text-[9px] text-slate-600 font-mono">
          *Chưa bao gồm SG&A, Marketing, Logistics
        </div>
      </div>

      {/* KPI 4: LATE SHIPPING CARD (Span 3) */}
      <div className={`lg:col-span-3 premium-card rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 group shadow-lg ${
        shippingCritical ? 'border-rose-500/30 bg-rose-950/5' : ''
      }`}>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Late Shipping Rate</span>
            <h3 className={`text-2xl font-bold font-mono mt-1 transition-colors ${
              shippingCritical ? 'text-rose-500 group-hover:text-rose-400' : 'text-amber-500 group-hover:text-amber-400'
            }`}>
              {lateShippingRate.toFixed(1)}%
            </h3>
          </div>
          <div className={`p-2.5 rounded-xl ${
            shippingCritical
              ? 'bg-rose-600/10 border border-rose-500/20 text-rose-500'
              : 'bg-amber-600/10 border border-amber-500/20 text-amber-500'
          }`}>
            <Truck className="w-5 h-5" />
          </div>
        </div>
        {/* SLA Comparison */}
        <div className="mt-3 flex items-center gap-2 text-[10px] font-mono">
          <span className="text-slate-500">Industry SLA:</span>
          <span className={shippingCritical ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
            &lt;{INDUSTRY_BENCHMARKS.lateShippingRate.threshold}%
          </span>
          {shippingCritical && (
            <span className="text-[9px] bg-rose-500/10 border border-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded uppercase font-bold animate-pulse">
              Exceeded
            </span>
          )}
        </div>
        <div className="mt-2 pt-3 border-t border-slate-900/50 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Delayed orders</span>
            <span className="font-mono font-bold">{lateOrders} / {totalOrders}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Doanh thu bị ảnh hưởng</span>
            <span className={`font-mono font-bold ${shippingCritical ? 'text-rose-400' : 'text-amber-400'}`}>
              {formatCurrency(lateShippingRevenue)} ({lateImpactPercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
