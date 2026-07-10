import React from 'react';
import { Layers } from 'lucide-react';
import { CoPurchasingItem } from './types';

interface CoPurchasingTableProps {
  coPurchasingList: CoPurchasingItem[];
}

export default function CoPurchasingTable({ coPurchasingList }: CoPurchasingTableProps) {
  return (
    <div className="premium-card rounded-2xl p-6 shadow-lg">
      <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
        <Layers className="w-4 h-4 text-blue-500" />
        Product Co-Purchasing Pairs
      </h3>
      <p className="text-xs text-slate-400 mb-4 font-mono">
        List of product lines combined in the same order. High counts reveal cross-sell opportunities.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-400 font-mono">
          <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-950 py-2">
            <tr>
              <th className="py-2.5">Product Line A</th>
              <th className="py-2.5">Product Line B</th>
              <th className="py-2.5 text-center">Frequency (Orders Count)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-950/40">
            {coPurchasingList.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-900/30">
                <td className="py-3 text-slate-200 font-bold">{item.product_one}</td>
                <td className="py-3 text-slate-200 font-bold">{item.product_two}</td>
                <td className="py-3 text-center">
                  <span className="bg-blue-900/20 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">
                    {item.count} orders
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
