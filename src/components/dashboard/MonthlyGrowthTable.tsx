import React from 'react';
import { TrendingUp } from 'lucide-react';

interface MonthlyTrendItem {
  dateStr: string;
  year: number;
  month: number;
  monthName: string;
  sales: number;
  profit: number;
  cost: number;
  ytdSales: number;
  momPercent: number;
}

interface MonthlyGrowthTableProps {
  monthlyTrendData: MonthlyTrendItem[];
  formatCurrency: (val: number) => string;
  limit?: number;
  title?: string;
  subtitle?: string;
  showYearAndMonthName?: boolean;
}

export default function MonthlyGrowthTable({
  monthlyTrendData,
  formatCurrency,
  limit,
  title = "Monthly Sales Growth Detail",
  subtitle = "Overview of recent months sorted chronologically",
  showYearAndMonthName = false
}: MonthlyGrowthTableProps) {
  // Process data: slice and reverse if needed
  let data = monthlyTrendData.slice().reverse();
  if (limit) {
    data = data.slice(0, limit);
  }

  return (
    <div className="premium-card rounded-2xl p-6 shadow-lg flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 uppercase font-mono tracking-wider mb-2">
          {showYearAndMonthName && <TrendingUp className="w-4 h-4 text-emerald-500" />}
          {title}
        </h3>
        <p className="text-xs text-slate-500 mb-4">{subtitle}</p>
      </div>

      <div className="overflow-x-auto max-h-[480px]">
        <table className="w-full text-left text-xs text-slate-400 font-mono">
          <thead className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-950 sticky top-0 bg-[#080d16] py-2">
            <tr>
              {showYearAndMonthName ? (
                <>
                  <th className="py-2.5">Year</th>
                  <th className="py-2.5">Month</th>
                </>
              ) : (
                <th className="py-2.5">Month</th>
              )}
              <th className="py-2.5 text-right">Sales Value</th>
              <th className="py-2.5 text-right">MoM%</th>
              <th className="py-2.5 text-right">Sales YTD</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-950/40">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                {showYearAndMonthName ? (
                  <>
                    <td className="py-3 text-slate-400">{item.year}</td>
                    <td className="py-3 font-semibold text-slate-200">{item.monthName}</td>
                  </>
                ) : (
                  <td className="py-2.5 text-slate-200 font-semibold">{item.dateStr}</td>
                )}
                <td className="py-3 text-right font-bold text-slate-100">
                  {formatCurrency(item.sales)}
                </td>
                <td className={`py-3 text-right font-bold ${
                  item.momPercent > 0 ? 'text-emerald-500' : item.momPercent < 0 ? 'text-rose-500' : 'text-slate-500'
                }`}>
                  {item.momPercent !== 0 ? `${item.momPercent > 0 ? '+' : ''}${item.momPercent.toFixed(1)}%` : '0.0%'}
                </td>
                <td className="py-3 text-right font-semibold text-slate-400">
                  {formatCurrency(item.ytdSales)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
