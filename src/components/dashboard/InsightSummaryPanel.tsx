import React from 'react';
import { AlertTriangle, TrendingUp, Info, ShieldAlert, Gem, Globe, Package } from 'lucide-react';
import { INDUSTRY_BENCHMARKS, InsightItem } from './benchmarks';

interface ProductLineMetric {
  name: string;
  revenue: number;
  profit: number;
  margin: number;
}

interface CountryMetric {
  name: string;
  revenue: number;
  share: number;
  margin: number;
}

interface InsightSummaryPanelProps {
  totalSales: number;
  totalProfit: number;
  profitMargin: number;
  lateShippingRate: number;
  lateOrders: number;
  totalOrders: number;
  lateShippingRevenue: number;
  productLineMetrics: ProductLineMetric[];
  countryMetrics: CountryMetric[];
  returningRevenuePercent: number;
  topCoPurchasePair: { pair: string; count: number } | null;
  formatCurrency: (val: number) => string;
}

function generateInsights(props: InsightSummaryPanelProps): InsightItem[] {
  const insights: InsightItem[] = [];
  const {
    profitMargin,
    lateShippingRate,
    lateOrders,
    totalOrders,
    lateShippingRevenue,
    totalSales,
    productLineMetrics,
    countryMetrics,
    returningRevenuePercent,
    topCoPurchasePair,
    formatCurrency,
  } = props;

  // --- RISK INSIGHTS ---

  // 1. Late Shipping Risk
  if (lateShippingRate > INDUSTRY_BENCHMARKS.lateShippingRate.threshold) {
    const impactPercent = totalSales > 0 ? ((lateShippingRevenue / totalSales) * 100).toFixed(1) : '0';
    insights.push({
      type: 'risk',
      title: 'Shipping Delay Risk',
      description: `${lateShippingRate.toFixed(1)}% đơn hàng giao trễ (${lateOrders}/${totalOrders}) — ảnh hưởng ${formatCurrency(lateShippingRevenue)} doanh thu (${impactPercent}% tổng). Ngưỡng SLA ngành: <${INDUSTRY_BENCHMARKS.lateShippingRate.threshold}%.`,
      metric: `${lateShippingRate.toFixed(1)}%`,
      benchmark: `<${INDUSTRY_BENCHMARKS.lateShippingRate.threshold}%`,
    });
  }

  // 2. Revenue Concentration Risk
  if (countryMetrics.length > 0) {
    const topCountry = countryMetrics[0];
    if (topCountry.share > INDUSTRY_BENCHMARKS.revenueConcentration.threshold) {
      insights.push({
        type: 'risk',
        title: 'Revenue Concentration Risk',
        description: `${topCountry.name} chiếm ${topCountry.share.toFixed(1)}% tổng doanh thu — vượt ngưỡng cảnh báo ${INDUSTRY_BENCHMARKS.revenueConcentration.threshold}%. Nếu mất thị trường này, doanh thu giảm ${formatCurrency(topCountry.revenue)}.`,
        metric: `${topCountry.share.toFixed(1)}%`,
        benchmark: `<${INDUSTRY_BENCHMARKS.revenueConcentration.threshold}%`,
      });
    }
  }

  // 3. Underperforming Product Line
  if (productLineMetrics.length > 0) {
    const sorted = [...productLineMetrics].sort((a, b) => a.margin - b.margin);
    const worst = sorted[0];
    const avgMargin = profitMargin;
    if (worst.margin < avgMargin - 2) {
      insights.push({
        type: 'risk',
        title: `Low Margin: ${worst.name}`,
        description: `${worst.name} có margin thấp nhất: ${worst.margin.toFixed(1)}% — thấp hơn trung bình toàn công ty ${avgMargin.toFixed(1)}% tới ${(avgMargin - worst.margin).toFixed(1)} điểm %. Doanh thu: ${formatCurrency(worst.revenue)}.`,
        metric: `${worst.margin.toFixed(1)}%`,
        benchmark: `TB: ${avgMargin.toFixed(1)}%`,
      });
    }
  }

  // 4. Gross Margin vs Industry
  if (profitMargin < INDUSTRY_BENCHMARKS.grossMargin.low) {
    insights.push({
      type: 'risk',
      title: 'Gross Margin Below Industry',
      description: `Biên lợi nhuận gộp ${profitMargin.toFixed(1)}% — dưới mức thấp nhất của ngành collectibles (${INDUSTRY_BENCHMARKS.grossMargin.low}-${INDUSTRY_BENCHMARKS.grossMargin.high}%).`,
      metric: `${profitMargin.toFixed(1)}%`,
      benchmark: `${INDUSTRY_BENCHMARKS.grossMargin.low}-${INDUSTRY_BENCHMARKS.grossMargin.high}%`,
    });
  }

  // --- OPPORTUNITY INSIGHTS ---

  // 5. Top Margin Product Line
  if (productLineMetrics.length > 0) {
    const sorted = [...productLineMetrics].sort((a, b) => b.margin - a.margin);
    const best = sorted[0];
    insights.push({
      type: 'opportunity',
      title: `Top Margin: ${best.name}`,
      description: `${best.name} sinh lời cao nhất: ${best.margin.toFixed(1)}% margin — mỗi $1 doanh thu tạo $${(best.margin / 100).toFixed(4)} lợi nhuận gộp. Doanh thu hiện tại: ${formatCurrency(best.revenue)}.`,
      metric: `${best.margin.toFixed(1)}%`,
    });
  }

  // 6. High-margin Market
  if (countryMetrics.length >= 2) {
    const highMarginMarkets = countryMetrics
      .filter(c => c.margin > profitMargin + 1 && c.share >= 5)
      .sort((a, b) => b.margin - a.margin);
    if (highMarginMarkets.length > 0) {
      const m = highMarginMarkets[0];
      insights.push({
        type: 'opportunity',
        title: `High-Margin Market: ${m.name}`,
        description: `${m.name} có margin ${m.margin.toFixed(1)}% (cao hơn TB ${(m.margin - profitMargin).toFixed(1)} điểm %) với doanh thu ${formatCurrency(m.revenue)} (${m.share.toFixed(1)}% thị phần).`,
        metric: `${m.margin.toFixed(1)}%`,
      });
    }
  }

  // 7. Co-purchasing Upsell
  if (topCoPurchasePair && topCoPurchasePair.count > 50) {
    const pairPercent = totalOrders > 0 ? ((topCoPurchasePair.count / totalOrders) * 100).toFixed(0) : '0';
    insights.push({
      type: 'opportunity',
      title: 'Bundle Upsell Opportunity',
      description: `${topCoPurchasePair.pair} xuất hiện cùng nhau ${topCoPurchasePair.count} lần (${pairPercent}% đơn hàng) — cơ hội tạo bundle discount để tăng AOV.`,
      metric: `${topCoPurchasePair.count} lần`,
    });
  }

  // --- INFO INSIGHTS ---

  // 8. Revenue Distribution
  if (countryMetrics.length >= 3) {
    const top3 = countryMetrics.slice(0, 3);
    const top3Share = top3.reduce((s, c) => s + c.share, 0);
    insights.push({
      type: 'info',
      title: 'Revenue Geographic Split',
      description: `Top 3 thị trường chiếm ${top3Share.toFixed(1)}% doanh thu: ${top3.map(c => `${c.name} ${c.share.toFixed(1)}%`).join(', ')}.`,
      metric: `${top3Share.toFixed(1)}%`,
    });
  }

  // 9. Customer Retention
  insights.push({
    type: 'info',
    title: 'Customer Retention Rate',
    description: `${returningRevenuePercent.toFixed(1)}% doanh thu đến từ khách hàng quay lại. Benchmark ngành: ${INDUSTRY_BENCHMARKS.customerRetention.low}-${INDUSTRY_BENCHMARKS.customerRetention.high}%.`,
    metric: `${returningRevenuePercent.toFixed(1)}%`,
    benchmark: `${INDUSTRY_BENCHMARKS.customerRetention.low}-${INDUSTRY_BENCHMARKS.customerRetention.high}%`,
  });

  return insights;
}

const ICON_MAP = {
  risk: AlertTriangle,
  opportunity: TrendingUp,
  info: Info,
};

const COLOR_MAP = {
  risk: {
    bg: 'bg-rose-500/5',
    border: 'border-rose-500/20',
    icon: 'text-rose-500',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    dot: 'bg-rose-500',
  },
  opportunity: {
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  info: {
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    icon: 'text-blue-500',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-500',
  },
};

const TYPE_LABELS = {
  risk: 'Risk',
  opportunity: 'Opportunity',
  info: 'Insight',
};

export default function InsightSummaryPanel(props: InsightSummaryPanelProps) {
  const insights = generateInsights(props);

  const riskCount = insights.filter(i => i.type === 'risk').length;
  const oppCount = insights.filter(i => i.type === 'opportunity').length;

  return (
    <div className="lg:col-span-12 premium-card rounded-2xl p-6 shadow-lg animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-2 text-purple-500">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Auto-Generated Insights
            </h3>
            <p className="text-[10px] text-slate-500">
              Tự động phân tích từ dữ liệu — benchmark ngành collectibles
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {riskCount > 0 && (
            <span className="text-[10px] bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              {riskCount} Risk{riskCount > 1 ? 's' : ''}
            </span>
          )}
          {oppCount > 0 && (
            <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              {oppCount} Opportunity
            </span>
          )}
        </div>
      </div>

      {/* Insight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {insights.map((insight, idx) => {
          const colors = COLOR_MAP[insight.type];
          const Icon = ICON_MAP[insight.type];

          return (
            <div
              key={idx}
              className={`${colors.bg} border ${colors.border} rounded-xl p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${colors.icon}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] border ${colors.badge} font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono`}>
                      {TYPE_LABELS[insight.type]}
                    </span>
                    {insight.metric && (
                      <span className="text-[10px] text-slate-400 font-mono font-bold">
                        {insight.metric}
                      </span>
                    )}
                    {insight.benchmark && (
                      <span className="text-[10px] text-slate-600 font-mono">
                        vs {insight.benchmark}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">{insight.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
