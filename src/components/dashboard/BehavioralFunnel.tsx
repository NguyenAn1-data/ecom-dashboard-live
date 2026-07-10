import React from 'react';
import {
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  Cell,
  LabelList,
  Tooltip as ChartTooltip
} from 'recharts';

interface FunnelItem {
  name: string;
  value: number;
  percent: number;
  color: string;
  lostRevenue: number;
}

interface BehavioralFunnelProps {
  funnelData: FunnelItem[];
  globalAOV: number;
  formatCurrency: (val: number) => string;
}

export default function BehavioralFunnel({
  funnelData,
  globalAOV,
  formatCurrency
}: BehavioralFunnelProps) {
  return (
    <div className="lg:col-span-7 premium-card rounded-2xl p-6 shadow-lg animate-in fade-in duration-300 flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">Behavioral Funnel Analysis (Phễu hành vi)</h3>
        <p className="text-xs text-slate-500 mb-4">Drop-offs and conversions from Traffic to Completed Purchases</p>
        
        <div className="w-full h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart margin={{ top: 10, right: 120, left: 120, bottom: 10 }}>
              <ChartTooltip
                contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ fontSize: 11 }}
              />
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
              >
                <LabelList position="right" fill="#94a3b8" stroke="none" dataKey="name" fontSize={9} />
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center font-mono mt-2 text-[9px] pt-3 border-t border-slate-950">
          {funnelData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-slate-500">{item.name.split('. ')[1]}</span>
              <span className="text-slate-200 font-bold mt-0.5">{item.value.toLocaleString()}</span>
              <span className="text-blue-400 font-semibold mt-0.5">({item.percent}%)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-950/80">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Opportunity Loss Analysis (Thất thoát doanh thu ước tính)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="bg-[#050810]/60 p-2.5 rounded-lg border border-slate-950 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase font-bold">Cart Abandonment Loss</span>
            <span className="text-rose-400 font-bold mt-1">-{formatCurrency((funnelData[2].value - funnelData[3].value) * globalAOV)}</span>
            <span className="text-[8px] text-slate-500 mt-0.5">Dropped at Cart stage</span>
          </div>
          <div className="bg-[#050810]/60 p-2.5 rounded-lg border border-slate-950 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase font-bold">Checkout Abandonment</span>
            <span className="text-rose-400 font-bold mt-1">-{formatCurrency((funnelData[3].value - funnelData[4].value) * globalAOV)}</span>
            <span className="text-[8px] text-slate-500 mt-0.5">Abandoned at Checkout</span>
          </div>
          <div className="bg-[#050810]/60 p-2.5 rounded-lg border border-slate-950 flex flex-col justify-between">
            <span className="text-[9px] text-slate-500 uppercase font-bold">Total Funnel Leakage</span>
            <span className="text-rose-500 font-bold mt-1">-{formatCurrency((funnelData[0].value - funnelData[4].value) * globalAOV)}</span>
            <span className="text-[8px] text-slate-500 mt-0.5">Total funnel drop loss</span>
          </div>
        </div>
      </div>
    </div>
  );
}
