import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ChartTooltip } from 'recharts';
import { INDUSTRY_BENCHMARKS } from './benchmarks';

interface ShippingDonutProps {
  shippingDonutData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  lateShippingRate: number;
  onTimeOrders: number;
  lateOrders: number;
}

export default function ShippingDonut({
  shippingDonutData,
  lateShippingRate,
  onTimeOrders,
  lateOrders
}: ShippingDonutProps) {
  const isAboveSLA = lateShippingRate > INDUSTRY_BENCHMARKS.lateShippingRate.threshold;

  return (
    <div className={`lg:col-span-4 premium-card rounded-2xl p-6 shadow-lg flex flex-col justify-between ${
      isAboveSLA ? 'border-rose-500/20' : ''
    }`}>
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Shipping Performance</h3>
        <p className="text-xs text-slate-500">Tỷ lệ giao hàng đúng hạn so với trễ hạn</p>
      </div>

      <div className="w-full h-[220px] relative flex items-center justify-center my-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={shippingDonutData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {shippingDonutData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={isAboveSLA && entry.name === 'Late Shipping' ? '#f43f5e' : entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center indicator */}
        <div className="absolute flex flex-col items-center justify-center">
          {isAboveSLA ? (
            <>
              <span className="text-lg font-bold font-mono text-rose-500">
                {lateShippingRate.toFixed(1)}%
              </span>
              <span className="text-[8px] uppercase tracking-wider text-rose-400 font-bold animate-pulse">
                Above SLA
              </span>
              <span className="text-[8px] text-slate-500 font-mono mt-0.5">
                SLA: &lt;{INDUSTRY_BENCHMARKS.lateShippingRate.threshold}%
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl font-bold font-mono text-slate-100">
                {(100 - lateShippingRate).toFixed(0)}%
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">On-Time</span>
            </>
          )}
        </div>
      </div>

      {/* Benchmark Reference */}
      {isAboveSLA && (
        <div className="bg-rose-500/5 border border-rose-500/15 rounded-lg px-3 py-2 mb-3">
          <p className="text-[10px] text-rose-400/80 font-mono">
            Tỷ lệ giao trễ {lateShippingRate.toFixed(1)}% vượt ngưỡng SLA ngành (&lt;{INDUSTRY_BENCHMARKS.lateShippingRate.threshold}%) — cần rà soát quy trình logistics.
          </p>
        </div>
      )}

      {/* Donut Legend */}
      <div className="flex justify-around items-center pt-3 border-t border-slate-950 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-slate-400">On-time ({onTimeOrders})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isAboveSLA ? 'bg-rose-500' : 'bg-fuchsia-500'}`} />
          <span className="text-slate-400">Late ({lateOrders})</span>
        </div>
      </div>
    </div>
  );
}
