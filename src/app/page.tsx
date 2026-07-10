'use client';

import React, { useState, useEffect } from 'react';
import { Layers, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

import DecompositionTree from '@/components/DecompositionTree';

// Sub-components
import KpiCards from '@/components/dashboard/KpiCards';
import FilterBar from '@/components/dashboard/FilterBar';
import SetupGuideModal from '@/components/dashboard/SetupGuideModal';
import SalesTrendChart from '@/components/dashboard/SalesTrendChart';
import ShippingDonut from '@/components/dashboard/ShippingDonut';
import CreditLimitChart from '@/components/dashboard/CreditLimitChart';
import CoPurchasingTable from '@/components/dashboard/CoPurchasingTable';
import LateShippingTable from '@/components/dashboard/LateShippingTable';
import MonthlyGrowthTable from '@/components/dashboard/MonthlyGrowthTable';
import RawTransactionsTable from '@/components/dashboard/RawTransactionsTable';
import BehavioralFunnel from '@/components/dashboard/BehavioralFunnel';
import GrowthAnatomyChart from '@/components/dashboard/GrowthAnatomyChart';
import VipRankingsTable from '@/components/dashboard/VipRankingsTable';
import PurchaseFrequencyChart from '@/components/dashboard/PurchaseFrequencyChart';
import DataQualityAudit from '@/components/dashboard/DataQualityAudit';
import InsightSummaryPanel from '@/components/dashboard/InsightSummaryPanel';
import ScaleSimulator from '@/components/dashboard/ScaleSimulator';

// Mock Data fallback
import { MOCK_TRANSACTIONS, MOCK_CO_PURCHASE } from '@/components/dashboard/mockData';
import { Transaction, CoPurchasingItem } from '@/components/dashboard/types';

export default function Home() {
  // Master transaction state
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  // Filtered transactions state
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [coPurchasingList, setCoPurchasingList] = useState<CoPurchasingItem[]>([]);
  
  // App UI states
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [showSetupGuide, setShowSetupGuide] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tree' | 'copurchase' | 'growth' | 'raw'>('dashboard');
  const [activeMetric, setActiveMetric] = useState<'salesValue' | 'netProfit' | 'costOfSales'>('salesValue');

  // Filter selections
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedProductLine, setSelectedProductLine] = useState<string>('All');
  
  // Unique filter lists
  const [countries, setCountries] = useState<string[]>([]);
  const [productLines, setProductLines] = useState<string[]>([]);

  // Fetch data
  const fetchData = async (forceDemo = false) => {
    setLoading(true);
    setError(null);
    if (forceDemo) {
      setTimeout(() => {
        setAllTransactions(MOCK_TRANSACTIONS);
        setCoPurchasingList(MOCK_CO_PURCHASE);
        setIsDemoMode(true);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();

      if (res.ok) {
        setAllTransactions(data.transactions || []);
        setCoPurchasingList(data.coPurchasingList || []);
        setIsDemoMode(false);
      } else {
        setError(data.error || 'Failed to fetch data.');
        setIsDemoMode(false);
      }
    } catch (err: any) {
      setError('Could not connect to backend server. Make sure next dev server is running and configured.');
      setIsDemoMode(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update filtered transactions & populate filter dropdowns when master list changes
  useEffect(() => {
    if (allTransactions.length === 0) return;

    // Populate filter options dynamically
    const uniqueCountries = Array.from(new Set(allTransactions.map(t => t.country))).sort();
    const uniqueProductLines = Array.from(new Set(allTransactions.map(t => t.productLine))).sort();
    setCountries(uniqueCountries);
    setProductLines(uniqueProductLines);

    // Apply filters
    let temp = [...allTransactions];
    if (selectedCountry !== 'All') {
      temp = temp.filter(t => t.country === selectedCountry);
    }
    if (selectedProductLine !== 'All') {
      temp = temp.filter(t => t.productLine === selectedProductLine);
    }
    setFilteredTransactions(temp);
  }, [allTransactions, selectedCountry, selectedProductLine]);

  // Compute dynamic KPI metrics for filtered dataset
  const totalSales = filteredTransactions.reduce((sum, t) => sum + t.salesValue, 0);
  const totalCost = filteredTransactions.reduce((sum, t) => sum + t.costOfSales, 0);
  const totalProfit = filteredTransactions.reduce((sum, t) => sum + t.netProfit, 0);
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
  
  const totalOrders = Array.from(new Set(filteredTransactions.map(t => t.orderNumber))).length;
  
  // Late shipping stats
  const uniqueOrdersMap = new Map<string, number>();
  filteredTransactions.forEach(t => {
    uniqueOrdersMap.set(t.orderNumber, t.lateFlag);
  });
  const lateOrders = Array.from(uniqueOrdersMap.values()).filter(flag => flag === 1).length;
  const onTimeOrders = totalOrders - lateOrders;
  const lateShippingRate = totalOrders > 0 ? (lateOrders / totalOrders) * 100 : 0;

  // Late shipping revenue impact
  const lateShippingRevenue = React.useMemo(() => {
    const lateOrderNumbers = new Set<string>();
    filteredTransactions.forEach(t => {
      if (t.lateFlag === 1) lateOrderNumbers.add(t.orderNumber);
    });
    return filteredTransactions
      .filter(t => lateOrderNumbers.has(t.orderNumber))
      .reduce((sum, t) => sum + t.salesValue, 0);
  }, [filteredTransactions]);

  // Country metrics for insights
  const countryMetrics = React.useMemo(() => {
    const map = new Map<string, { revenue: number; profit: number }>();
    filteredTransactions.forEach(t => {
      if (!map.has(t.country)) map.set(t.country, { revenue: 0, profit: 0 });
      const m = map.get(t.country)!;
      m.revenue += t.salesValue;
      m.profit += t.netProfit;
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        revenue: data.revenue,
        share: totalSales > 0 ? (data.revenue / totalSales) * 100 : 0,
        margin: data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredTransactions, totalSales]);

  // Product line metrics for insights and scale simulator
  const productLineMetrics = React.useMemo(() => {
    const map = new Map<string, { revenue: number; profit: number }>();
    filteredTransactions.forEach(t => {
      if (!map.has(t.productLine)) map.set(t.productLine, { revenue: 0, profit: 0 });
      const m = map.get(t.productLine)!;
      m.revenue += t.salesValue;
      m.profit += t.netProfit;
    });
    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        revenue: data.revenue,
        profit: data.profit,
        margin: data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredTransactions]);

  // Top co-purchase pair for insight
  const topCoPurchasePair = React.useMemo(() => {
    if (coPurchasingList.length === 0) return null;
    const top = coPurchasingList[0];
    return { pair: `${top.product_one} & ${top.product_two}`, count: top.count };
  }, [coPurchasingList]);

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // 1. Monthly Trend Data (Revenue vs Net Profit)
  const getMonthlyTrendData = () => {
    const monthlyAgg: { [key: string]: { dateStr: string; year: number; month: number; monthName: string; sales: number; profit: number; cost: number } } = {};
    
    filteredTransactions.forEach(t => {
      if (!t.orderDate) return;
      const parts = t.orderDate.split('-');
      if (parts.length < 2) return;
      const y = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      const key = `${y}-${m.toString().padStart(2, '0')}`;
      
      if (!monthlyAgg[key]) {
        monthlyAgg[key] = {
          dateStr: `${new Date(y, m - 1).toLocaleString('en-US', { month: 'short' })} ${y}`,
          year: y,
          month: m,
          monthName: new Date(y, m - 1).toLocaleString('en-US', { month: 'long' }),
          sales: 0,
          profit: 0,
          cost: 0
        };
      }
      monthlyAgg[key].sales += t.salesValue;
      monthlyAgg[key].profit += t.netProfit;
      monthlyAgg[key].cost += t.costOfSales;
    });

    const sortedData = Object.values(monthlyAgg).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    // Compute YTD and MoM
    let runningYtd = 0;
    let prevYear = -1;
    return sortedData.map((d, index) => {
      if (d.year !== prevYear) {
        runningYtd = 0;
        prevYear = d.year;
      }
      runningYtd += d.sales;

      let momPercent = 0;
      if (index > 0) {
        const prevSales = sortedData[index - 1].sales;
        if (prevSales > 0) {
          momPercent = ((d.sales - prevSales) / prevSales) * 100;
        }
      }

      return {
        ...d,
        ytdSales: runningYtd,
        momPercent
      };
    });
  };

  const monthlyTrendData = getMonthlyTrendData();

  // 2. Shipping Donut Chart Data
  const shippingDonutData = [
    { name: 'On-time', value: onTimeOrders, color: '#00f0ff' },
    { name: 'Late Shipping', value: lateOrders, color: '#d946ef' }
  ].filter(d => d.value > 0);

  // 3. Credit Limit Bar Chart Data
  const getCreditLimitData = () => {
    const limits: { [key: string]: { count: number; sales: number } } = {};
    filteredTransactions.forEach(t => {
      const grp = t.creditLimitGrp || 'd: Unknown';
      if (!limits[grp]) {
        limits[grp] = { count: 0, sales: 0 };
      }
      limits[grp].count += 1;
      limits[grp].sales += t.salesValue;
    });

    return Object.entries(limits)
      .map(([name, data]) => ({
        name: name.includes(':') ? name.split(':')[1].trim() : name,
        customers: data.count,
        sales: data.sales,
        rawName: name
      }))
      .sort((a, b) => a.rawName.localeCompare(b.rawName));
  };

  const creditLimitData = getCreditLimitData();

  // Compute the first order date for every customer in the master dataset
  const customerFirstOrderDate = React.useMemo(() => {
    const map = new Map<string, string>();
    const sorted = [...allTransactions].sort((a, b) => a.orderDate.localeCompare(b.orderDate));
    sorted.forEach(t => {
      if (t.customerName && !map.has(t.customerName)) {
        map.set(t.customerName, t.orderDate);
      }
    });
    return map;
  }, [allTransactions]);

  // Classify each transaction in filtered list as New or Returning
  const classifiedTransactions = React.useMemo(() => {
    return filteredTransactions.map(t => {
      const firstDate = customerFirstOrderDate.get(t.customerName);
      const isNew = firstDate === t.orderDate;
      return {
        ...t,
        customerType: isNew ? 'New' : 'Returning'
      };
    });
  }, [filteredTransactions, customerFirstOrderDate]);

  // Calculate cohort statistics
  const newRevenue = classifiedTransactions.filter(t => t.customerType === 'New').reduce((sum, t) => sum + t.salesValue, 0);
  const returningRevenue = classifiedTransactions.filter(t => t.customerType === 'Returning').reduce((sum, t) => sum + t.salesValue, 0);

  const acquisitionVsRetentionData = [
    { name: 'Acquisition (New)', value: newRevenue, color: 'url(#cyanPurpleHoriz)' },
    { name: 'Retention (Returning)', value: returningRevenue, color: '#00f0ff' }
  ].filter(d => d.value > 0);

  // Compute VIP Customer List / AOV / Frequency
  const customerMetrics = React.useMemo(() => {
    const clientMap = new Map<string, { orders: Set<string>; sales: number }>();
    filteredTransactions.forEach(t => {
      if (!clientMap.has(t.customerName)) {
        clientMap.set(t.customerName, { orders: new Set(), sales: 0 });
      }
      const metrics = clientMap.get(t.customerName)!;
      metrics.orders.add(t.orderNumber);
      metrics.sales += t.salesValue;
    });

    const customerList = Array.from(clientMap.entries()).map(([name, data]) => ({
      name,
      ordersCount: data.orders.size,
      salesTotal: data.sales,
      aov: data.orders.size > 0 ? data.sales / data.orders.size : 0
    }));

    let single = 0;
    let double = 0;
    let loyal = 0;
    customerList.forEach(c => {
      if (c.ordersCount === 1) single++;
      else if (c.ordersCount === 2) double++;
      else if (c.ordersCount >= 3) loyal++;
    });

    return {
      customerList: customerList.sort((a, b) => b.salesTotal - a.salesTotal),
      frequencyBucketsData: [
        { name: '1 Order (Single)', count: single, color: 'url(#cyanPurpleHoriz)' },
        { name: '2 Orders (Repeat)', count: double, color: '#00f0ff' },
        { name: '3+ Orders (Loyal)', count: loyal, color: '#8b5cf6' }
      ]
    };
  }, [filteredTransactions]);

  // Average Days Between Orders calculation
  const avgDaysBetweenOrders = React.useMemo(() => {
    const customerOrderDates = new Map<string, Set<string>>();
    filteredTransactions.forEach(t => {
      if (!t.orderDate) return;
      if (!customerOrderDates.has(t.customerName)) {
        customerOrderDates.set(t.customerName, new Set());
      }
      customerOrderDates.get(t.customerName)!.add(t.orderDate);
    });

    let totalIntervalDays = 0;
    let totalIntervals = 0;

    customerOrderDates.forEach((dateSet) => {
      if (dateSet.size < 2) return;
      const sortedDates = Array.from(dateSet)
        .map(d => new Date(d).getTime())
        .sort((a, b) => a - b);

      for (let i = 0; i < sortedDates.length - 1; i++) {
        const diffTime = sortedDates[i + 1] - sortedDates[i];
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        totalIntervalDays += diffDays;
        totalIntervals++;
      }
    });

    return totalIntervals > 0 ? Math.round(totalIntervalDays / totalIntervals) : 0;
  }, [filteredTransactions]);

  const globalAOV = totalOrders > 0 ? totalSales / totalOrders : 0;

  // E-commerce behavioral funnel metrics
  const funnelData = React.useMemo(() => {
    const purchases = totalOrders;
    const checkouts = Math.round(purchases * 1.43);
    const cartAdds = Math.round(purchases * 4.2);
    const productViews = Math.round(purchases * 28);
    const trafficSessions = Math.round(purchases * 85);

    const checkoutDrop = checkouts - purchases;
    const cartDrop = cartAdds - checkouts;
    const viewsDrop = productViews - cartAdds;
    const trafficDrop = trafficSessions - productViews;

    return [
      { name: '1. Sessions', value: trafficSessions, percent: 100, color: '#475569', lostRevenue: 0 },
      { name: '2. Views', value: productViews, percent: Math.round((productViews / trafficSessions) * 100), color: 'url(#cyanPurpleHoriz)', lostRevenue: trafficDrop * globalAOV },
      { name: '3. Cart Adds', value: cartAdds, percent: Math.round((cartAdds / productViews) * 100), color: 'url(#cyanPurpleHoriz)', lostRevenue: viewsDrop * globalAOV },
      { name: '4. Checkouts', value: checkouts, percent: Math.round((checkouts / cartAdds) * 100), color: '#d946ef', lostRevenue: cartDrop * globalAOV },
      { name: '5. Completed', value: purchases, percent: Math.round((purchases / checkouts) * 100), color: '#00f0ff', lostRevenue: checkoutDrop * globalAOV }
    ];
  }, [totalOrders, globalAOV]);

  // Data Quality Audit checks
  const auditResults = React.useMemo(() => {
    if (filteredTransactions.length === 0) {
      return { schemaValid: false, datesValid: false, shippingValid: false, keysValid: false, totalIssues: 0 };
    }
    const schemaValid = filteredTransactions.every(t => t.quantityOrdered > 0 && t.priceEach > 0);
    const datesValid = filteredTransactions.every(t => /^\d{4}-\d{2}-\d{2}$/.test(t.orderDate));
    const shippingValid = filteredTransactions.every(t => !t.shippedDate || t.shippedDate >= t.orderDate);
    const keysValid = filteredTransactions.every(t => t.orderNumber && t.productName);

    let totalIssues = 0;
    if (!schemaValid) totalIssues++;
    if (!datesValid) totalIssues++;
    if (!shippingValid) totalIssues++;
    if (!keysValid) totalIssues++;

    return { schemaValid, datesValid, shippingValid, keysValid, totalIssues };
  }, [filteredTransactions]);

  return (
    <div className="min-h-screen premium-bg text-slate-100 font-sans flex flex-col antialiased">
      {/* GLOBAL SVG GRADIENT DEFINITIONS */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="cyanPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="pinkBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="cyanPurpleHoriz" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="pinkBlueHoriz" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* 1. HEADER & GLOBAL FILTERS BAR */}
      <header className="border-b border-white/5 bg-[#151628]/60 backdrop-blur-md px-8 py-5 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-2 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              E-Commerce Bento Dashboard
              {isDemoMode && (
                <span className="text-[10px] bg-fuchsia-500/10 border border-amber-500/30 text-amber-500 font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                  Demo Mode
                </span>
              )}
              {!isDemoMode && !loading && !error && (
                <span className="text-[10px] bg-cyan-400/10 border border-emerald-500/30 text-emerald-500 font-semibold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400">Google Sheets Real-time Synchronization Panel</p>
          </div>
        </div>

        <FilterBar
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countries={countries}
          selectedProductLine={selectedProductLine}
          setSelectedProductLine={setSelectedProductLine}
          productLines={productLines}
          showSetupGuide={showSetupGuide}
          setShowSetupGuide={setShowSetupGuide}
          loading={loading}
          fetchData={fetchData}
        />
      </header>

      {/* SETUP GUIDE DRAWER */}
      <SetupGuideModal showSetupGuide={showSetupGuide} />

      {/* ERROR / API UNCONFIGURED SCREEN */}
      {error && !isDemoMode && (
        <section className="bg-amber-950/10 border border-amber-900/30 rounded-xl p-6 m-8 max-w-4xl self-center text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-2">Google Sheets Configuration Warning</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-lg mx-auto leading-relaxed">
            The API failed to fetch sheets data. Please make sure the Spreadsheet ID in `.env.local` is correct and shared with the Service Account email.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => fetchData(true)}
              className="bg-amber-600 hover:bg-fuchsia-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)]"
            >
              Use Demo Data (Xem thử Dữ liệu mẫu)
            </button>
            <button
              onClick={() => setShowSetupGuide(true)}
              className="border border-slate-800 text-slate-400 hover:text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            >
              How to configure?
            </button>
          </div>
        </section>
      )}

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Synchronizing Dashboard...</span>
        </div>
      ) : (
        <main className="flex-1 p-8 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
          
          {/* 2. DYNAMIC WORKSPACE TABS */}
          <div className="flex border-b border-slate-900 gap-6 text-sm font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-3 relative transition-all ${
                activeTab === 'dashboard' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overall Visual Analytics (Báo cáo trực quan)
              {activeTab === 'dashboard' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('tree')}
              className={`pb-3 relative transition-all ${
                activeTab === 'tree' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Decomposition Tree
              {activeTab === 'tree' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('copurchase')}
              className={`pb-3 relative transition-all ${
                activeTab === 'copurchase' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Co-Purchasing & Shipping Status
              {activeTab === 'copurchase' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('growth')}
              className={`pb-3 relative transition-all ${
                activeTab === 'growth' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Behavioral & Growth Analytics
              {activeTab === 'growth' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`pb-3 relative transition-all ${
                activeTab === 'raw' ? 'text-blue-500' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Database ({filteredTransactions.length} rows)
              {activeTab === 'raw' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          </div>

          {/* 3. BENTO GRID LAYOUT */}
          
          {/* TAB 1: OVERALL VISUAL ANALYTICS (Charts & KPIs) */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-max">
              <KpiCards
                totalSales={totalSales}
                totalCost={totalCost}
                totalProfit={totalProfit}
                profitMargin={profitMargin}
                lateShippingRate={lateShippingRate}
                lateOrders={lateOrders}
                totalOrders={totalOrders}
                filteredTransactionsLength={filteredTransactions.length}
                lateShippingRevenue={lateShippingRevenue}
                topMarketShare={countryMetrics.length > 0 ? { name: countryMetrics[0].name, share: countryMetrics[0].share } : null}
                formatCurrency={formatCurrency}
              />

              <InsightSummaryPanel
                totalSales={totalSales}
                totalProfit={totalProfit}
                profitMargin={profitMargin}
                lateShippingRate={lateShippingRate}
                lateOrders={lateOrders}
                totalOrders={totalOrders}
                lateShippingRevenue={lateShippingRevenue}
                productLineMetrics={productLineMetrics}
                countryMetrics={countryMetrics}
                returningRevenuePercent={totalSales > 0 ? (returningRevenue / totalSales) * 100 : 0}
                topCoPurchasePair={topCoPurchasePair}
                formatCurrency={formatCurrency}
              />

              <ScaleSimulator
                productLineMetrics={productLineMetrics}
                formatCurrency={formatCurrency}
              />

              <SalesTrendChart monthlyTrendData={monthlyTrendData} />

              <ShippingDonut
                shippingDonutData={shippingDonutData}
                lateShippingRate={lateShippingRate}
                onTimeOrders={onTimeOrders}
                lateOrders={lateOrders}
              />

              <CreditLimitChart creditLimitData={creditLimitData} activeMetric={activeMetric} />

              <div className="lg:col-span-6">
                <MonthlyGrowthTable
                  monthlyTrendData={monthlyTrendData}
                  formatCurrency={formatCurrency}
                  limit={4}
                />
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE DECOMPOSITION TREE */}
          {activeTab === 'tree' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <DecompositionTree 
                  transactions={filteredTransactions} 
                  activeMetric={activeMetric}
                  setActiveMetric={setActiveMetric}
                />
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                <MonthlyGrowthTable
                  monthlyTrendData={monthlyTrendData}
                  formatCurrency={formatCurrency}
                  title="Sales Overview"
                  subtitle="MoM & YTD Track"
                  showYearAndMonthName={true}
                />
              </div>
            </div>
          )}

          {/* TAB 3: CO-PURCHASING & SHIPPING STATUS */}
          {activeTab === 'copurchase' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CoPurchasingTable coPurchasingList={coPurchasingList} />
              <LateShippingTable filteredTransactions={filteredTransactions} />
            </div>
          )}

          {/* TAB 4: RAW TRANSACTIONS DATABASE */}
          {activeTab === 'raw' && (
            <RawTransactionsTable
              filteredTransactions={filteredTransactions}
              formatCurrency={formatCurrency}
            />
          )}

          {/* TAB 5: ADVANCED BEHAVIORAL & GROWTH ANALYTICS */}
          {activeTab === 'growth' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-max">
              <BehavioralFunnel
                funnelData={funnelData}
                globalAOV={globalAOV}
                formatCurrency={formatCurrency}
              />

              <GrowthAnatomyChart
                acquisitionVsRetentionData={acquisitionVsRetentionData}
                totalSales={totalSales}
                returningRevenue={returningRevenue}
                newRevenue={newRevenue}
                avgDaysBetweenOrders={avgDaysBetweenOrders}
                formatCurrency={formatCurrency}
              />

              <VipRankingsTable
                customerList={customerMetrics.customerList}
                formatCurrency={formatCurrency}
              />

              <PurchaseFrequencyChart frequencyBucketsData={customerMetrics.frequencyBucketsData} />

              <DataQualityAudit auditResults={auditResults} />
            </div>
          )}

        </main>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-[#03060c] px-8 py-4 text-center text-[10px] text-slate-600 flex justify-between items-center mt-12 font-mono">
        <span>© 2026 E-Commerce Operations Analytics Dashboard</span>
        <div className="flex gap-4">
          <span>Technology Stack: Next.js + TailwindCSS + Recharts</span>
          <span>Google Cloud API Integration Enabled</span>
        </div>
      </footer>

    </div>
  );
}
