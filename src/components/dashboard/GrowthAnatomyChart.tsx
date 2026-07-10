import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ChartTooltip } from 'recharts';

interface GrowthAnatomyProps {
  acquisitionVsRetentionData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  totalSales: number;
  returningRevenue: number;
  newRevenue: number;
  avgDaysBetweenOrders: number;
  formatCurrency: (val: number) => string;
}

export default function GrowthAnatomyChart({
  acquisitionVsRetentionData,
  totalSales,
  returningRevenue,
  newRevenue,
  avgDaysBetweenOrders,
  formatCurrency
}: GrowthAnatomyProps) {
  return (
    <div className="lg:col-span-5 premium-card rounded-2xl p-6 shadow-lg flex flex-col justify-between animate-in fade-in duration-300">
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Growth Anatomy (Phân tách tăng trưởng)</h3>
        <p className="text-xs text-slate-500">Revenue split between New Customer Acquisition and Returning Customer Retention</p>
      </div>

      <div className="w-full h-[220px] relative flex items-center justify-center my-4">
        {acquisitionVsRetentionData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={acquisitionVsRetentionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {acquisitionVsRetentionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <span className="text-xs text-slate-600">No data available for filters</span>
        )}
        
        {/* Center metric summary */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-lg font-bold font-mono text-emerald-400">
            {totalSales > 0 ? `${((returningRevenue / totalSales) * 100).toFixed(0)}%` : '0%'}
          </span>
          <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Retention Rev</span>
        </div>
      </div>

      <div className="flex justify-around items-center pt-3 border-t border-slate-950 font-mono text-[10px]">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-400">New (Acquisition)</span>
          </div>
          <span className="text-white font-bold">{formatCurrency(newRevenue)} ({totalSales > 0 ? ((newRevenue / totalSales) * 100).toFixed(0) : 0}%)</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-400">Returning (Retention)</span>
          </div>
          <span className="text-white font-bold">{formatCurrency(returningRevenue)} ({totalSales > 0 ? ((returningRevenue / totalSales) * 100).toFixed(0) : 0}%)</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-950/80 flex items-center justify-between text-xs font-mono">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase font-bold">Avg Days Between Orders</span>
          <span className="text-blue-400 font-bold mt-0.5">{avgDaysBetweenOrders} Days</span>
        </div>
        <div className="text-[9px] text-slate-500 text-right">
          <span>Average repeat purchase interval</span>
        </div>
      </div>
    </div>
  );
}
