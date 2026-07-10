import React from 'react';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip as ChartTooltip } from 'recharts';

interface FrequencyBucketItem {
  name: string;
  count: number;
  color: string;
}

interface PurchaseFrequencyChartProps {
  frequencyBucketsData: FrequencyBucketItem[];
}

export default function PurchaseFrequencyChart({
  frequencyBucketsData
}: PurchaseFrequencyChartProps) {
  return (
    <div className="lg:col-span-5 premium-card rounded-2xl p-6 shadow-lg flex flex-col justify-between animate-in fade-in duration-300">
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">Purchase Frequency Distribution</h3>
        <p className="text-xs text-slate-500 mb-6">Distribution of customers based on total order count</p>
      </div>

      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={frequencyBucketsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} />
            <YAxis stroke="#475569" fontSize={9} tickLine={false} />
            <ChartTooltip
              contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
              itemStyle={{ fontSize: 11 }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
              {frequencyBucketsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
