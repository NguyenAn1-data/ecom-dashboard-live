import React from 'react';
import { Transaction } from './types';

interface RawTransactionsTableProps {
  filteredTransactions: Transaction[];
  formatCurrency: (val: number) => string;
}

export default function RawTransactionsTable({
  filteredTransactions,
  formatCurrency
}: RawTransactionsTableProps) {
  return (
    <div className="premium-card rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          Filtered Transaction Database
        </h3>
        <span className="text-xs text-slate-500 font-mono">Showing first 50 matched rows</span>
      </div>
      
      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left text-xs text-slate-400 font-mono">
          <thead className="text-[10px] text-slate-500 uppercase border-b border-slate-950 py-2 sticky top-0 bg-[#080d16] z-10">
            <tr>
              <th className="py-2.5">Date</th>
              <th className="py-2.5">Order</th>
              <th className="py-2.5">Customer</th>
              <th className="py-2.5">Country</th>
              <th className="py-2.5">Product Line</th>
              <th className="py-2.5">Product Name</th>
              <th className="py-2.5 text-right">Sales Value</th>
              <th className="py-2.5 text-right">Cost</th>
              <th className="py-2.5 text-right">Net Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-950/40">
            {filteredTransactions.slice(0, 50).map((t, idx) => (
              <tr key={idx} className="hover:bg-slate-900/30">
                <td className="py-2.5">{t.orderDate}</td>
                <td className="py-2.5">#{t.orderNumber}</td>
                <td className="py-2.5 text-slate-300 font-semibold truncate max-w-[150px]" title={t.customerName}>{t.customerName}</td>
                <td className="py-2.5 text-slate-400">{t.country}</td>
                <td className="py-2.5 text-slate-400">{t.productLine}</td>
                <td className="py-2.5 text-slate-300 truncate max-w-[150px]" title={t.productName}>{t.productName}</td>
                <td className="py-2.5 text-right text-slate-200 font-bold">{formatCurrency(t.salesValue)}</td>
                <td className="py-2.5 text-right text-slate-400">{formatCurrency(t.costOfSales)}</td>
                <td className={`py-2.5 text-right font-bold ${t.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {formatCurrency(t.netProfit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
