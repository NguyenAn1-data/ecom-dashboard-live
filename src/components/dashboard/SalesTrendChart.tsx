import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Legend,
  ReferenceLine,
  ReferenceDot,
  Label
} from 'recharts';

interface SalesTrendChartProps {
  monthlyTrendData: Array<{
    dateStr: string;
    sales: number;
    profit: number;
  }>;
}

export default function SalesTrendChart({ monthlyTrendData }: SalesTrendChartProps) {
  // Find peak and trough months
  const peakMonth = monthlyTrendData.reduce((best, d) => d.sales > best.sales ? d : best, monthlyTrendData[0] || { dateStr: '', sales: 0, profit: 0 });
  const troughMonth = monthlyTrendData.reduce((worst, d) => d.sales < worst.sales ? d : worst, monthlyTrendData[0] || { dateStr: '', sales: Infinity, profit: 0 });

  const formatK = (val: number) => `$${(val / 1000).toFixed(0)}K`;
  const hasPeakTrough = monthlyTrendData.length >= 3 && peakMonth.dateStr !== troughMonth.dateStr;

  return (
    <div className="lg:col-span-8 premium-card rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Monthly Revenue & Gross Profit Trend</h3>
          <p className="text-xs text-slate-500">So sánh doanh thu và lợi nhuận gộp (Revenue - COGS) theo tháng</p>
        </div>
        <div className="flex bg-[#05070c] border border-slate-900 p-0.5 rounded text-[10px] font-mono">
          <span className="px-2 py-1 bg-blue-600/10 text-blue-400 rounded">Area View</span>
        </div>
      </div>

      {/* Peak/Trough Annotations Legend */}
      {hasPeakTrough && (
        <div className="flex gap-4 mb-3 text-[10px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Peak: <span className="text-emerald-400 font-bold">{formatK(peakMonth.sales)}</span> — {peakMonth.dateStr}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
            Low: <span className="text-rose-400 font-bold">{formatK(troughMonth.sales)}</span> — {troughMonth.dateStr}
          </span>
        </div>
      )}

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyTrendData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="dateStr" stroke="#475569" fontSize={10} tickLine={false} />
            <YAxis stroke="#475569" fontSize={10} tickLine={false} />
            <ChartTooltip
              contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
              labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}
              itemStyle={{ fontSize: 11 }}
            />

            {/* Peak Reference Line */}
            {hasPeakTrough && (
              <ReferenceLine
                y={peakMonth.sales}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
              >
                <Label
                  value={`Peak ${formatK(peakMonth.sales)}`}
                  position="right"
                  fill="#10b981"
                  fontSize={9}
                  fontFamily="monospace"
                />
              </ReferenceLine>
            )}

            {/* Trough Reference Line */}
            {hasPeakTrough && (
              <ReferenceLine
                y={troughMonth.sales}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              >
                <Label
                  value={`Low ${formatK(troughMonth.sales)}`}
                  position="right"
                  fill="#f43f5e"
                  fontSize={9}
                  fontFamily="monospace"
                />
              </ReferenceLine>
            )}

            <Area type="monotone" dataKey="sales" name="Revenue" stroke="#00f0ff" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
            <Area type="monotone" dataKey="profit" name="Gross Profit" stroke="#d946ef" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
            <Legend verticalAlign="top" height={36} iconType="circle" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
