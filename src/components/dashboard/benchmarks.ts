// Industry benchmarks for collectibles/model vehicles e-commerce
// Sources: General e-commerce SLA standards and collectibles market norms
// These are STATIC reference points — not live data

export const INDUSTRY_BENCHMARKS = {
  grossMargin: {
    low: 40,
    high: 60,
    unit: '%',
    label: 'Collectibles Industry Gross Margin',
    description: 'Biên lợi nhuận gộp trung bình ngành collectibles/mô hình',
  },
  lateShippingRate: {
    threshold: 5,
    unit: '%',
    label: 'E-commerce Shipping SLA',
    description: 'Tỷ lệ giao trễ tối đa chấp nhận được trong e-commerce',
  },
  customerRetention: {
    low: 20,
    high: 40,
    unit: '%',
    label: 'E-commerce Retention Rate',
    description: 'Tỷ lệ khách hàng quay lại mua tiêu chuẩn e-commerce',
  },
  revenueConcentration: {
    threshold: 30,
    unit: '%',
    label: 'Single Market Dependency Warning',
    description: 'Ngưỡng cảnh báo khi 1 thị trường chiếm quá nhiều doanh thu',
  },
  aov: {
    low: 2000,
    high: 5000,
    unit: '$',
    label: 'Collectibles AOV Range',
    description: 'Giá trị đơn hàng trung bình kỳ vọng cho ngành collectibles',
  },
} as const;

// Helper to evaluate a metric against a benchmark range
export function evaluateAgainstBenchmark(
  value: number,
  benchmark: { low?: number; high?: number; threshold?: number }
): 'below' | 'within' | 'above' | 'ok' | 'warning' {
  if ('threshold' in benchmark && benchmark.threshold !== undefined) {
    return value > benchmark.threshold ? 'warning' : 'ok';
  }
  if (benchmark.low !== undefined && benchmark.high !== undefined) {
    if (value < benchmark.low) return 'below';
    if (value > benchmark.high) return 'above';
    return 'within';
  }
  return 'within';
}

export type InsightType = 'risk' | 'opportunity' | 'info';

export interface InsightItem {
  type: InsightType;
  title: string;
  description: string;
  metric?: string;
  benchmark?: string;
}
