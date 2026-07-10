import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, Cell } from 'recharts';

interface CreditLimitChartProps {
  creditLimitData: Array<{
    name: string;
    customers: number;
    sales: number;
    rawName: string;
  }>;
  activeMetric: 'salesValue' | 'netProfit' | 'costOfSales';
}

export default function CreditLimitChart({ creditLimitData, activeMetric }: CreditLimitChartProps) {
  return (
    <div className="lg:col-span-6 premium-card rounded-2xl p-6 shadow-lg">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">Credit Limit Distribution</h3>
      <p className="text-xs text-slate-500 mb-6">Customer purchase values aggregated by credit limit groups</p>

      <div className="w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={creditLimitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} />
            <YAxis stroke="#475569" fontSize={9} tickLine={false} />
            <ChartTooltip
              contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
              labelStyle={{ color: '#fff', fontSize: 10 }}
              itemStyle={{ fontSize: 11 }}
            />
            <Bar dataKey="sales" name="Total Sales" fill="#3b82f6" radius={[4, 4, 0, 0]}>
              {creditLimitData.map((entry, index) => {
                const color = activeMetric === 'netProfit' ? 'url(#pinkBlue)' : activeMetric === 'costOfSales' ? '#f59e0b' : 'url(#cyanPurple)';
                return <Cell key={`cell-${index}`} fill={color} fillOpacity={0.8} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
