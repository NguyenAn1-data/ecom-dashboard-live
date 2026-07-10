import React from 'react';
import { Users } from 'lucide-react';

interface CustomerMetricItem {
  name: string;
  ordersCount: number;
  aov: number;
  salesTotal: number;
}

interface VipRankingsTableProps {
  customerList: CustomerMetricItem[];
  formatCurrency: (val: number) => string;
}

export default function VipRankingsTable({
  customerList,
  formatCurrency
}: VipRankingsTableProps) {
  return (
    <div className="lg:col-span-7 premium-card rounded-2xl p-6 shadow-lg animate-in fade-in duration-300">
      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono uppercase tracking-wider mb-2">
        <Users className="w-4 h-4 text-purple-500" />
        VIP Customer Purchasing Rankings
      </h3>
      <p className="text-xs text-slate-400 mb-4 font-mono">
        Ranked by cumulative purchase value, average order value (AOV) and purchase frequency.
      </p>

      <div className="overflow-x-auto max-h-[280px]">
        <table className="w-full text-left text-xs text-slate-400 font-mono">
          <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-950 py-2 sticky top-0 bg-[#080d16]">
            <tr>
              <th className="py-2.5">Customer Name</th>
              <th className="py-2.5 text-center">Orders Count</th>
              <th className="py-2.5 text-right">Avg AOV</th>
              <th className="py-2.5 text-right">Sales Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-950/40">
            {customerList.slice(0, 5).map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-900/30">
                <td className="py-2.5 text-slate-200 font-semibold">{item.name}</td>
                <td className="py-2.5 text-center">
                  <span className="bg-purple-900/20 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold">
                    {item.ordersCount} orders
                  </span>
                </td>
                <td className="py-2.5 text-right text-slate-300 font-bold">{formatCurrency(item.aov)}</td>
                <td className="py-2.5 text-right text-slate-100 font-bold">{formatCurrency(item.salesTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
