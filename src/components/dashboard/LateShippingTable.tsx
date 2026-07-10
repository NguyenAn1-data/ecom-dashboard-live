import React from 'react';
import { Truck } from 'lucide-react';
import { Transaction } from './types';

interface LateShippingTableProps {
  filteredTransactions: Transaction[];
}

export default function LateShippingTable({ filteredTransactions }: LateShippingTableProps) {
  return (
    <div className="premium-card rounded-2xl p-6 shadow-lg">
      <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2 font-mono uppercase tracking-wider">
        <Truck className="w-4 h-4 text-amber-500" />
        Late Shipping Orders list
      </h3>
      <p className="text-xs text-slate-400 mb-4 font-mono">
        Detailed list of orders marked LATE (where actual shipping date exceeded required date).
      </p>

      <div className="overflow-x-auto max-h-[350px]">
        <table className="w-full text-left text-xs text-slate-400 font-mono">
          <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-950 py-2">
            <tr>
              <th className="py-2.5">Order</th>
              <th className="py-2.5">Customer Name</th>
              <th className="py-2.5">Required Date</th>
              <th className="py-2.5">Shipped Date</th>
              <th className="py-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-950/40">
            {filteredTransactions
              .filter(t => t.lateFlag === 1)
              .map((item, idx) => (
                <tr key={idx} className="hover:bg-rose-950/10">
                  <td className="py-3 text-slate-300">#{item.orderNumber}</td>
                  <td className="py-3 text-slate-200 font-semibold">{item.customerName}</td>
                  <td className="py-3 text-slate-400">{item.requiredDate}</td>
                  <td className="py-3 text-rose-400 font-semibold">{item.shippedDate}</td>
                  <td className="py-3 text-right">
                    <span className="text-[9px] bg-rose-500/10 border border-rose-500/30 text-rose-500 px-2 py-0.5 rounded font-bold uppercase">
                      LATE
                    </span>
                  </td>
                </tr>
              ))}
            {filteredTransactions.filter(t => t.lateFlag === 1).length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-600">
                  No late shipments found for these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
