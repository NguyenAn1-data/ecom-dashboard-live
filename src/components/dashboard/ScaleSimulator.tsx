import React from 'react';
import { Calculator, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface ProductLineMetric {
  name: string;
  revenue: number;
  profit: number;
  margin: number;
}

interface ScaleSimulatorProps {
  productLineMetrics: ProductLineMetric[];
  formatCurrency: (val: number) => string;
}

const SCALE_AMOUNT = 100_000; // $100K

export default function ScaleSimulator({
  productLineMetrics,
  formatCurrency,
}: ScaleSimulatorProps) {
  if (productLineMetrics.length === 0) return null;

  const sorted = [...productLineMetrics].sort((a, b) => b.margin - a.margin);
  const bestMargin = sorted[0].margin;
  const worstMargin = sorted[sorted.length - 1].margin;

  // Calculate profit gain if scaling each line by $100K
  const simulated = sorted.map(pl => ({
    ...pl,
    profitPerDollar: pl.margin / 100,
    simulatedGain: (pl.margin / 100) * SCALE_AMOUNT,
  }));

  const bestGain = simulated[0].simulatedGain;
  const worstGain = simulated[simulated.length - 1].simulatedGain;
  const gapPerHundredK = bestGain - worstGain;

  return (
    <div className="lg:col-span-12 premium-card rounded-2xl p-6 shadow-lg animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-2 text-cyan-500">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Scale Profit Simulator
            </h3>
            <p className="text-[10px] text-slate-500">
              Mô phỏng lợi nhuận gộp nếu tăng doanh thu mỗi dòng sản phẩm thêm {formatCurrency(SCALE_AMOUNT)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-500 font-mono block">Chênh lệch tốt nhất vs xấu nhất</span>
          <span className="text-sm font-bold text-cyan-400 font-mono">{formatCurrency(gapPerHundredK)} / {formatCurrency(SCALE_AMOUNT)}</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2 mb-4 mt-3">
        <p className="text-[10px] text-amber-400/80 font-mono">
          * Mô phỏng dựa trên Gross Margin hiện tại (Revenue - COGS) — chưa tính chi phí marketing, logistics, SG&A khi scale. Cần thêm dữ liệu CAC và market size để đánh giá khả thi.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="text-[10px] text-slate-500 uppercase border-b border-slate-900">
              <th className="py-2.5 pr-4">Product Line</th>
              <th className="py-2.5 text-right pr-4">Current Revenue</th>
              <th className="py-2.5 text-right pr-4">Gross Margin %</th>
              <th className="py-2.5 text-right pr-4">Profit per $1</th>
              <th className="py-2.5 text-right pr-4">If +{formatCurrency(SCALE_AMOUNT)} → Profit Gain</th>
              <th className="py-2.5 text-center">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-950/40">
            {simulated.map((pl, idx) => {
              const isBest = idx === 0;
              const isWorst = idx === simulated.length - 1;
              const rowClass = isBest
                ? 'bg-emerald-500/[0.03]'
                : isWorst
                ? 'bg-rose-500/[0.03]'
                : '';

              return (
                <tr key={pl.name} className={`${rowClass} hover:bg-slate-900/30 transition-colors`}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-slate-200 font-semibold ${isBest ? 'text-emerald-400' : isWorst ? 'text-rose-400' : ''}`}>
                        {pl.name}
                      </span>
                      {isBest && (
                        <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold">
                          Best ROI
                        </span>
                      )}
                      {isWorst && (
                        <span className="text-[8px] bg-rose-500/10 border border-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded uppercase font-bold">
                          Lowest ROI
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-right pr-4 text-slate-300">{formatCurrency(pl.revenue)}</td>
                  <td className="py-3 text-right pr-4">
                    <span className={`font-bold ${isBest ? 'text-emerald-400' : isWorst ? 'text-rose-400' : 'text-slate-300'}`}>
                      {pl.margin.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 text-right pr-4 text-slate-400">
                    ${pl.profitPerDollar.toFixed(4)}
                  </td>
                  <td className="py-3 text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {isBest ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isWorst ? (
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Minus className="w-3.5 h-3.5 text-slate-600" />
                      )}
                      <span className={`font-bold ${isBest ? 'text-emerald-400' : isWorst ? 'text-rose-400' : 'text-slate-300'}`}>
                        +{formatCurrency(pl.simulatedGain)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    {/* Visual bar */}
                    <div className="w-full bg-slate-900 rounded-full h-1.5 mx-auto max-w-[80px]">
                      <div
                        className={`h-1.5 rounded-full transition-all ${isBest ? 'bg-emerald-500' : isWorst ? 'bg-rose-500' : 'bg-cyan-500/60'}`}
                        style={{ width: `${((pl.margin / bestMargin) * 100).toFixed(0)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 border-t border-slate-900/50 flex flex-wrap gap-6 text-[10px] text-slate-500 font-mono">
        <span>
          Scale {simulated[0].name} +{formatCurrency(SCALE_AMOUNT)} → <span className="text-emerald-400 font-bold">+{formatCurrency(bestGain)}</span> lợi nhuận gộp
        </span>
        <span>
          Scale {simulated[simulated.length - 1].name} +{formatCurrency(SCALE_AMOUNT)} → <span className="text-rose-400 font-bold">+{formatCurrency(worstGain)}</span> lợi nhuận gộp
        </span>
        <span>
          Chênh lệch: <span className="text-cyan-400 font-bold">{formatCurrency(gapPerHundredK)}</span> / mỗi {formatCurrency(SCALE_AMOUNT)} đầu tư
        </span>
      </div>
    </div>
  );
}
