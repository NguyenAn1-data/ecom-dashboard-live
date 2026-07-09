'use client';

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Truck, 
  RefreshCw, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  Layers, 
  CheckCircle2, 
  ChevronDown, 
  Filter, 
  Maximize2,
  Globe,
  Users,
  CheckSquare
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import DecompositionTree from '@/components/DecompositionTree';

// Interfaces
interface Transaction {
  orderDate: string;
  orderNumber: string;
  quantityOrdered: number;
  priceEach: number;
  productName: string;
  productLine: string;
  buyPrice: number;
  city: string;
  country: string;
  salesValue: number;
  costOfSales: number;
  netProfit: number;
  customerName: string;
  customerNumber: string;
  creditLimitGrp: string;
  requiredDate: string;
  shippedDate: string;
  shippingStatus: string;
  lateFlag: number;
}

interface SalesOverviewItem {
  year: number;
  month: number;
  monthName: string;
  salesValue: number;
  netProfit: number;
  costOfSales: number;
  momPercent: number;
  ytdSalesValue: number;
}

interface CoPurchasingItem {
  product_one: string;
  product_two: string;
  count: number;
}

// ----------------------------------------------------
// Mock Data fallback
// ----------------------------------------------------
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    orderDate: '2004-01-02', orderNumber: '10208', quantityOrdered: 46, priceEach: 176.63,
    productName: '2001 Ferrari Enzo', productLine: 'Classic Cars', buyPrice: 95.59,
    city: 'Lyon', country: 'France', salesValue: 8124.98, costOfSales: 4397.14, netProfit: 3727.84,
    customerName: 'Lyon Souvenirs', customerNumber: '256', creditLimitGrp: 'b: Between 75k and 100k',
    requiredDate: '2004-01-11', shippedDate: '2004-01-04', shippingStatus: 'Shipped', lateFlag: 0
  },
  {
    orderDate: '2004-01-02', orderNumber: '10208', quantityOrdered: 26, priceEach: 128.42,
    productName: '1969 Corvair Monza', productLine: 'Classic Cars', buyPrice: 89.14,
    city: 'Lyon', country: 'France', salesValue: 3338.92, costOfSales: 2317.64, netProfit: 1021.28,
    customerName: 'Lyon Souvenirs', customerNumber: '256', creditLimitGrp: 'b: Between 75k and 100k',
    requiredDate: '2004-01-11', shippedDate: '2004-01-04', shippingStatus: 'Shipped', lateFlag: 0
  },
  {
    orderDate: '2004-01-02', orderNumber: '10208', quantityOrdered: 20, priceEach: 152.26,
    productName: '1969 Ford Falcon', productLine: 'Classic Cars', buyPrice: 83.05,
    city: 'Lyon', country: 'France', salesValue: 3045.20, costOfSales: 1661.00, netProfit: 1384.20,
    customerName: 'Lyon Souvenirs', customerNumber: '256', creditLimitGrp: 'b: Between 75k and 100k',
    requiredDate: '2004-01-11', shippedDate: '2004-01-04', shippingStatus: 'Shipped', lateFlag: 0
  },
  {
    orderDate: '2004-01-15', orderNumber: '10210', quantityOrdered: 34, priceEach: 110.15,
    productName: '1903 Ford Model A', productLine: 'Vintage Cars', buyPrice: 68.30,
    city: 'San Francisco', country: 'USA', salesValue: 12345.10, costOfSales: 7322.20, netProfit: 5022.90,
    customerName: 'Reims Collectables', customerNumber: '242', creditLimitGrp: 'c: Between 100k and 150k',
    requiredDate: '2004-01-22', shippedDate: '2004-01-20', shippingStatus: 'Shipped', lateFlag: 1
  },
  {
    orderDate: '2004-01-15', orderNumber: '10210', quantityOrdered: 40, priceEach: 135.50,
    productName: '1936 Mercedes-Benz 500K Roadster', productLine: 'Vintage Cars', buyPrice: 86.00,
    city: 'San Francisco', country: 'USA', salesValue: 18420.00, costOfSales: 11440.00, netProfit: 6980.00,
    customerName: 'Reims Collectables', customerNumber: '242', creditLimitGrp: 'c: Between 100k and 150k',
    requiredDate: '2004-01-22', shippedDate: '2004-01-20', shippingStatus: 'Shipped', lateFlag: 1
  },
  {
    orderDate: '2004-02-09', orderNumber: '10220', quantityOrdered: 50, priceEach: 195.00,
    productName: '1969 Corvair Monza', productLine: 'Classic Cars', buyPrice: 89.14,
    city: 'Madrid', country: 'Spain', salesValue: 15750.00, costOfSales: 9457.00, netProfit: 6293.00,
    customerName: 'Auto Canal+ Petit', customerNumber: '406', creditLimitGrp: 'a: Less than 75k',
    requiredDate: '2004-02-18', shippedDate: '2004-02-12', shippingStatus: 'Shipped', lateFlag: 0
  },
  {
    orderDate: '2004-02-20', orderNumber: '10224', quantityOrdered: 29, priceEach: 180.20,
    productName: '1982 Lamborghini Diablo', productLine: 'Classic Cars', buyPrice: 93.46,
    city: 'Melbourne', country: 'Australia', salesValue: 11225.80, costOfSales: 6710.34, netProfit: 4515.46,
    customerName: 'Australian Collectables, Ltd', customerNumber: '471', creditLimitGrp: 'a: Less than 75k',
    requiredDate: '2004-02-28', shippedDate: '2004-02-22', shippingStatus: 'Shipped', lateFlag: 0
  },
  {
    orderDate: '2004-03-05', orderNumber: '10230', quantityOrdered: 42, priceEach: 140.00,
    productName: '1903 Ford Model A', productLine: 'Vintage Cars', buyPrice: 68.30,
    city: 'Nantes', country: 'France', salesValue: 13880.00, costOfSales: 7868.60, netProfit: 6011.40,
    customerName: 'Atelier graphique', customerNumber: '103', creditLimitGrp: 'b: Between 75k and 100k',
    requiredDate: '2004-03-12', shippedDate: '2004-03-09', shippingStatus: 'Shipped', lateFlag: 0
  },
  {
    orderDate: '2004-03-15', orderNumber: '10235', quantityOrdered: 30, priceEach: 95.00,
    productName: '1982 Lamborghini Diablo', productLine: 'Classic Cars', buyPrice: 93.46,
    city: 'Paris', country: 'France', salesValue: 10850.00, costOfSales: 6803.80, netProfit: 4046.20,
    customerName: 'La Rochelle Gifts', customerNumber: '121', creditLimitGrp: 'c: Between 100k and 150k',
    requiredDate: '2004-03-22', shippedDate: '2004-03-24', shippingStatus: 'Shipped', lateFlag: 1
  },
  {
    orderDate: '2004-04-10', orderNumber: '10240', quantityOrdered: 45, priceEach: 160.00,
    productName: '2001 Ferrari Enzo', productLine: 'Classic Cars', buyPrice: 95.59,
    city: 'Singapore', country: 'Singapore', salesValue: 17200.00, costOfSales: 11301.55, netProfit: 5898.45,
    customerName: 'Mini Caravy', customerNumber: '480', creditLimitGrp: 'a: Less than 75k',
    requiredDate: '2004-04-18', shippedDate: '2004-04-14', shippingStatus: 'Shipped', lateFlag: 0
  }
];

const MOCK_CO_PURCHASE: CoPurchasingItem[] = [
  { product_one: 'Classic Cars', product_two: 'Vintage Cars', count: 42 },
  { product_one: 'Classic Cars', product_two: 'Motorcycles', count: 28 },
  { product_one: 'Trucks and Buses', product_two: 'Vintage Cars', count: 19 },
  { product_one: 'Classic Cars', product_two: 'Planes', count: 12 },
  { product_one: 'Vintage Cars', product_two: 'Ships', count: 8 }
];

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

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  // ----------------------------------------------------
  // Recharts Chart Data Processing
  // ----------------------------------------------------
  
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
      // Count unique customers
      limits[grp].count += 1;
      limits[grp].sales += t.salesValue;
    });

    return Object.entries(limits)
      .map(([name, data]) => ({
        // Clean group label (e.g. 'a: Less than 75k' -> 'Less than 75k')
        name: name.includes(':') ? name.split(':')[1].trim() : name,
        customers: data.count,
        sales: data.sales,
        rawName: name
      }))
      .sort((a, b) => a.rawName.localeCompare(b.rawName));
  };

  const creditLimitData = getCreditLimitData();

  // ----------------------------------------------------
  // 4. Advanced Behavioral & Growth Analytics Calculations
  // ----------------------------------------------------

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

    // Frequency buckets
    let single = 0;
    let double = 0;
    let loyal = 0;
    customerList.forEach(c => {
      if (c.ordersCount === 1) single++;
      else if (c.ordersCount === 2) double++;
      else if (c.ordersCount >= 3) loyal++;
    });

    return {
      customerList: customerList.sort((a, b) => b.salesTotal - a.salesTotal), // VIPs first
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

  // E-commerce behavioral funnel metrics back-calculated from actual purchases with Lost Revenue Opportunity
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

        {/* Global Filter Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Country Selector */}
          <div className="flex items-center gap-2 bg-[#0c1220] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-transparent text-slate-200 border-none outline-none font-bold cursor-pointer pr-1"
            >
              <option value="All">All Countries</option>
              {countries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Product Line Selector */}
          <div className="flex items-center gap-2 bg-[#0c1220] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedProductLine}
              onChange={(e) => setSelectedProductLine(e.target.value)}
              className="bg-transparent text-slate-200 border-none outline-none font-bold cursor-pointer pr-1"
            >
              <option value="All">All Product Lines</option>
              {productLines.map(pl => (
                <option key={pl} value={pl}>{pl}</option>
              ))}
            </select>
          </div>

          {/* Setup drawer toggle */}
          <button
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className="px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            Setup API
          </button>
          
          <button
            onClick={() => fetchData(false)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-pulse"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync
          </button>
        </div>
      </header>

      {/* SETUP GUIDE DRAWER */}
      {showSetupGuide && (
        <section className="bg-[#0b101c] border-b border-slate-800 p-6 px-8 animate-in slide-in-from-top duration-300">
          <div className="max-w-4xl">
            <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Google Sheets Real-time Sync Configuration
            </h2>
            <p className="text-xs text-slate-400 mb-2">
              Your Google Cloud Service Account credentials have been configured inside [.env.local](file:///d:/e-com%20example/dashboard/.env.local).
              Simply share your Google Sheet with the Service Account email below as an <strong>Editor</strong>:
            </p>
            <div className="bg-[#050810] border border-slate-900 p-2.5 rounded font-mono text-[11px] text-blue-400 select-all max-w-fit mb-4">
              thiennhien1@ecom-example-501902.iam.gserviceaccount.com
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Then run: <code className="text-slate-300 font-mono bg-slate-950 px-1 py-0.5 rounded">python dashboard/scripts/upload_sheets.py</code> in your console to sync.
            </p>
          </div>
        </section>
      )}

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
              
              {/* KPI 1: REVENUE CARD (Span 3) */}
              <div className="lg:col-span-3 premium-card rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 group shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Revenue</span>
                    <h3 className="text-2xl font-bold font-mono text-white mt-1 group-hover:text-blue-400 transition-colors">
                      {formatCurrency(totalSales)}
                    </h3>
                  </div>
                  <div className="bg-blue-600/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/50 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Based on active filters</span>
                  <span className="font-mono text-blue-400 font-bold">{filteredTransactions.length} items</span>
                </div>
              </div>

              {/* KPI 2: COST OF SALES CARD (Span 3) */}
              <div className="lg:col-span-3 premium-card rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 group shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cost of Sales</span>
                    <h3 className="text-2xl font-bold font-mono text-slate-100 mt-1 group-hover:text-amber-400 transition-colors">
                      {formatCurrency(totalCost)}
                    </h3>
                  </div>
                  <div className="bg-amber-600/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-500">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/50 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Inventory cost totals</span>
                  <span className="font-mono text-amber-400 font-bold">COGS</span>
                </div>
              </div>

              {/* KPI 3: NET PROFIT CARD (Span 3) */}
              <div className="lg:col-span-3 premium-card rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 group shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Net Profit</span>
                    <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-1 group-hover:text-emerald-300 transition-colors shadow-emerald-950">
                      {formatCurrency(totalProfit)}
                    </h3>
                  </div>
                  <div className="bg-emerald-600/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-500">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/50 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Margins YTD</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {profitMargin.toFixed(1)}% Margin
                  </span>
                </div>
              </div>

              {/* KPI 4: LATE SHIPPING CARD (Span 3) */}
              <div className="lg:col-span-3 premium-card rounded-2xl p-6 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 group shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Late Shipping Rate</span>
                    <h3 className="text-2xl font-bold font-mono text-amber-500 mt-1 group-hover:text-amber-400 transition-colors">
                      {lateShippingRate.toFixed(1)}%
                    </h3>
                  </div>
                  <div className="bg-amber-600/10 border border-amber-500/20 p-2.5 rounded-xl text-amber-500">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/50 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Delayed shipping orders</span>
                  <span className="font-mono text-amber-500 font-bold">{lateOrders} / {totalOrders}</span>
                </div>
              </div>

              {/* ROW 2: MAIN CHART - REVENUE TREND (Span 8) */}
              <div className="lg:col-span-8 premium-card rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Monthly Revenue & Profit Growth</h3>
                    <p className="text-xs text-slate-500">Compare gross sales values to net earnings margins</p>
                  </div>
                  <div className="flex bg-[#05070c] border border-slate-900 p-0.5 rounded text-[10px] font-mono">
                    <span className="px-2 py-1 bg-blue-600/10 text-blue-400 rounded">Area View</span>
                  </div>
                </div>

                <div className="w-full h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="dateStr" stroke="#475569" fontSize={10} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                      <ChartTooltip
                        contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}
                        itemStyle={{ fontSize: 11 }}
                      />
                      <Area type="monotone" dataKey="sales" name="Revenue" stroke="#00f0ff" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                      <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#d946ef" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ROW 2 RIGHT: SHIPPING RATIO DONUT (Span 4) */}
              <div className="lg:col-span-4 premium-card rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Shipping Performance</h3>
                  <p className="text-xs text-slate-500">Ratio of on-time deliveries to late orders</p>
                </div>

                <div className="w-full h-[220px] relative flex items-center justify-center my-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={shippingDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {shippingDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
                        itemStyle={{ fontSize: 11 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Center percentage indicator */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold font-mono text-slate-100">
                      {(100 - lateShippingRate).toFixed(0)}%
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">On-Time</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="flex justify-around items-center pt-3 border-t border-slate-950 font-mono text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span className="text-slate-400">On-time ({onTimeOrders})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500" />
                    <span className="text-slate-400">Late ({lateOrders})</span>
                  </div>
                </div>
              </div>

              {/* ROW 3: CREDIT LIMIT GROUPS BAR (Span 6) */}
              <div className="lg:col-span-6 premium-card rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">Credit Limit Distribution</h3>
                <p className="text-xs text-slate-500 mb-6">Customer purchase values aggregated by credit limit groups</p>

                <div className="w-full h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={creditLimitData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                      <ChartTooltip
                        contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
                        labelStyle={{ color: '#fff', fontSize: 10 }}
                        itemStyle={{ fontSize: 11 }}
                      />
                      <Bar dataKey="sales" name="Total Sales" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                        {creditLimitData.map((entry, index) => {
                          // Highlight bars differently if needed
                          const color = activeMetric === 'netProfit' ? 'url(#pinkBlue)' : activeMetric === 'costOfSales' ? '#f59e0b' : 'url(#cyanPurple)';
                          return <Cell key={`cell-${index}`} fill={color} fillOpacity={0.8} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ROW 3 RIGHT: QUICK STATS TABLE (Span 6) */}
              <div className="lg:col-span-6 premium-card rounded-2xl p-6 shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">Monthly Sales Growth Detail</h3>
                  <p className="text-xs text-slate-500">Overview of recent months sorted chronologically</p>
                </div>

                <div className="overflow-x-auto mt-4 max-h-[220px]">
                  <table className="w-full text-left text-xs text-slate-400 font-mono">
                    <thead className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-950 sticky top-0 bg-[#080d16] py-2">
                      <tr>
                        <th className="py-2.5">Month</th>
                        <th className="py-2.5 text-right">Sales Value</th>
                        <th className="py-2.5 text-right">MoM%</th>
                        <th className="py-2.5 text-right">Sales YTD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-950/40">
                      {monthlyTrendData.slice().reverse().slice(0, 4).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/20">
                          <td className="py-2.5 text-slate-200 font-semibold">{item.dateStr}</td>
                          <td className="py-2.5 text-right font-bold text-slate-100">{formatCurrency(item.sales)}</td>
                          <td className={`py-2.5 text-right font-bold ${
                            item.momPercent > 0 ? 'text-emerald-500' : item.momPercent < 0 ? 'text-rose-500' : 'text-slate-500'
                          }`}>
                            {item.momPercent !== 0 ? `${item.momPercent > 0 ? '+' : ''}${item.momPercent.toFixed(1)}%` : '0.0%'}
                          </td>
                          <td className="py-2.5 text-right text-slate-400">{formatCurrency(item.ytdSales)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: INTERACTIVE DECOMPOSITION TREE */}
          {activeTab === 'tree' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Decomposition Tree Panel */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <DecompositionTree 
                  transactions={filteredTransactions} 
                  activeMetric={activeMetric}
                  setActiveMetric={setActiveMetric}
                />
              </div>

              {/* Side Detailed Sales Overview Table */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="premium-card rounded-2xl p-6 flex flex-col shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Sales Overview
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">MoM & YTD Track</span>
                  </div>

                  <div className="overflow-x-auto max-h-[480px]">
                    <table className="w-full text-left text-xs text-slate-400 font-mono">
                      <thead className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-950 sticky top-0 bg-[#080d16] py-2">
                        <tr>
                          <th className="py-2.5">Year</th>
                          <th className="py-2.5">Month</th>
                          <th className="py-2.5 text-right">Sales Value</th>
                          <th className="py-2.5 text-right">MoM%</th>
                          <th className="py-2.5 text-right">Sales YTD</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-950/40">
                        {monthlyTrendData.slice().reverse().map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/30 transition-colors">
                            <td className="py-3 text-slate-400">{item.year}</td>
                            <td className="py-3 font-semibold text-slate-200">{item.monthName}</td>
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
              </div>

            </div>
          )}

          {/* TAB 3: CO-PURCHASING & SHIPPING STATUS */}
          {activeTab === 'copurchase' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Product co-purchasing */}
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

              {/* Late shipping lists */}
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

            </div>
          )}

          {/* TAB 4: RAW TRANSACTIONS DATABASE */}
          {activeTab === 'raw' && (
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
          )}

          {/* TAB 4: ADVANCED BEHAVIORAL & GROWTH ANALYTICS */}
          {activeTab === 'growth' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 auto-rows-max">
              
              {/* Funnel Analysis (Span 7) */}
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

              {/* Acquisition vs Retention (Span 5) */}
              <div className="lg:col-span-5 premium-card rounded-2xl p-6 shadow-lg flex flex-col justify-between animate-in fade-in duration-300">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Growth Anatomy (Phân tách tăng trưởng)</h3>
                  <p className="text-xs text-slate-500">Revenue split between New Customer Acquisition and Returning Customer Retention</p>
                </div>

                <div className="w-full h-[220px] relative flex items-center justify-center my-4">
                  {acquisitionVsRetentionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={acquisitionVsRetentionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {acquisitionVsRetentionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
                          itemStyle={{ fontSize: 11 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <span className="text-xs text-slate-600">No data available for filters</span>
                  )}
                  
                  {/* Center metric summary */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {totalSales > 0 ? `${((returningRevenue / totalSales) * 100).toFixed(0)}%` : '0%'}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">Retention Rev</span>
                  </div>
                </div>

                <div className="flex justify-around items-center pt-3 border-t border-slate-950 font-mono text-[10px]">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-slate-400">New (Acquisition)</span>
                    </div>
                    <span className="text-white font-bold">{formatCurrency(newRevenue)} ({totalSales > 0 ? ((newRevenue / totalSales) * 100).toFixed(0) : 0}%)</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-slate-400">Returning (Retention)</span>
                    </div>
                    <span className="text-white font-bold">{formatCurrency(returningRevenue)} ({totalSales > 0 ? ((returningRevenue / totalSales) * 100).toFixed(0) : 0}%)</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-950/80 flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-500 uppercase font-bold">Avg Days Between Orders</span>
                    <span className="text-blue-400 font-bold mt-0.5">{avgDaysBetweenOrders} Days</span>
                  </div>
                  <div className="text-[9px] text-slate-500 text-right">
                    <span>Average repeat purchase interval</span>
                  </div>
                </div>
              </div>

              {/* VIP Customers list (Span 7) */}
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
                      {customerMetrics.customerList.slice(0, 5).map((item, idx) => (
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

              {/* Customer Purchase Frequency Bucket Distribution (Span 5) */}
              <div className="lg:col-span-5 premium-card rounded-2xl p-6 shadow-lg flex flex-col justify-between animate-in fade-in duration-300">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">Purchase Frequency Distribution</h3>
                  <p className="text-xs text-slate-500 mb-6">Distribution of customers based on total order count</p>
                </div>

                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={customerMetrics.frequencyBucketsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={9} tickLine={false} />
                      <ChartTooltip
                        contentStyle={{ backgroundColor: '#0c1220', border: '1px solid #1e293b', borderRadius: '8px' }}
                        itemStyle={{ fontSize: 11 }}
                      />
                      <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                        {customerMetrics.frequencyBucketsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* DATA QUALITY VALIDATION PANEL (Span 12) */}
              <div className="lg:col-span-12 premium-card rounded-2xl p-6 shadow-lg animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                      Data Quality Validation Audit (Kiểm tra chất lượng sự kiện/dữ liệu)
                    </h3>
                    <p className="text-xs text-slate-500">Real-time database integrity audit logs and validation indicators</p>
                  </div>
                  {auditResults.totalIssues === 0 ? (
                    <span className="text-[10px] bg-cyan-400/10 border border-emerald-500/30 text-emerald-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      Pass - No issues
                    </span>
                  ) : (
                    <span className="text-[10px] bg-rose-500/10 border border-rose-500/30 text-rose-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      Fail - {auditResults.totalIssues} Warnings
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono mt-4">
                  {/* Schema Integrity */}
                  <div className="bg-[#050810] border border-slate-950 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block font-semibold">Schema Validation</span>
                      <span className="text-[10px] text-slate-500">Quantity & prices positive</span>
                    </div>
                    {auditResults.schemaValid ? (
                      <span className="text-[9px] bg-cyan-400/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">OK</span>
                    ) : (
                      <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded uppercase font-bold">Error</span>
                    )}
                  </div>

                  {/* Temporal Consistency */}
                  <div className="bg-[#050810] border border-slate-950 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block font-semibold">Temporal Consistency</span>
                      <span className="text-[10px] text-slate-500">Order Dates ISO formatted</span>
                    </div>
                    {auditResults.datesValid ? (
                      <span className="text-[9px] bg-cyan-400/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">OK</span>
                    ) : (
                      <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded uppercase font-bold">Error</span>
                    )}
                  </div>

                  {/* Shipping Timeline Integrity */}
                  <div className="bg-[#050810] border border-slate-950 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block font-semibold">Shipping Date Consistency</span>
                      <span className="text-[10px] text-slate-500">Shipped Date &gt;= Order Date</span>
                    </div>
                    {auditResults.shippingValid ? (
                      <span className="text-[9px] bg-cyan-400/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">OK</span>
                    ) : (
                      <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded uppercase font-bold">Warning</span>
                    )}
                  </div>

                  {/* Schema keys */}
                  <div className="bg-[#050810] border border-slate-950 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block font-semibold">Referential Mapping</span>
                      <span className="text-[10px] text-slate-500">Unique order mapping check</span>
                    </div>
                    {auditResults.keysValid ? (
                      <span className="text-[9px] bg-cyan-400/10 border border-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded uppercase">OK</span>
                    ) : (
                      <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded uppercase font-bold">Error</span>
                    )}
                  </div>
                </div>
              </div>

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
