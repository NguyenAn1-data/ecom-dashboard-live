'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Plus, X, BarChart3, TrendingUp, DollarSign, Maximize2, Minimize2 } from 'lucide-react';

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

interface TreeColumn {
  dimension: string;
  selectedValue: string;
}

interface DecompositionTreeProps {
  transactions: Transaction[];
  activeMetric: 'salesValue' | 'netProfit' | 'costOfSales';
  setActiveMetric: (metric: 'salesValue' | 'netProfit' | 'costOfSales') => void;
}

const DIMENSIONS = [
  { id: 'country', label: 'Customer Country' },
  { id: 'productLine', label: 'Product Line' },
  { id: 'customerName', label: 'Customer Name' },
  { id: 'productName', label: 'Product Name' },
  { id: 'creditLimitGrp', label: 'Credit Limit Group' },
  { id: 'shippingStatus', label: 'Shipping Status' }
];

export default function DecompositionTree({
  transactions,
  activeMetric,
  setActiveMetric
}: DecompositionTreeProps) {
  // Tree state: Array of columns. Starts with none, just the root node.
  const [columns, setColumns] = useState<TreeColumn[]>([
    { dimension: 'country', selectedValue: '' }
  ]);

  const [activeParentIndex, setActiveParentIndex] = useState<number>(-1); // -1 means root is active parent
  
  // Track open dropdowns
  const [openDropdownColIndex, setOpenDropdownColIndex] = useState<number | null>(null);

  // For bezier path measurements
  const containerRef = useRef<HTMLDivElement>(null);
  const rootNodeRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [connections, setConnections] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Toggle browser native fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Sync state on fullscreen change (e.g. if user presses Esc)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement === containerRef.current;
      setIsFullscreen(isCurrentlyFullscreen);
      // Give DOM time to update layout, then recalculate SVG connections
      setTimeout(() => {
        updateConnections();
      }, 100);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Reset columns selection when active metric changes
  useEffect(() => {
    // Keep columns but reset selections to let it recalculate
    setColumns(prev => prev.map(col => ({ ...col, selectedValue: '' })));
    setOpenDropdownColIndex(null);
  }, [activeMetric]);

  // Reset columns selection when transactions change (due to global filters)
  useEffect(() => {
    setColumns([{ dimension: 'country', selectedValue: '' }]);
    setOpenDropdownColIndex(null);
  }, [transactions]);

  // Recalculate bezier connections when columns, selections, or layout changes
  const updateConnections = () => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newConnections: any[] = [];

    // Helper to get center right/left coordinates relative to the container
    const getCoordinates = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return {
        leftX: rect.left - containerRect.left,
        rightX: rect.right - containerRect.left,
        centerY: rect.top - containerRect.top + rect.height / 2
      };
    };

    // 1. Connection from Root to Column 0
    if (rootNodeRef.current) {
      const rootCoords = getCoordinates(rootNodeRef.current);
      const col0Id = `col-0-items`;
      // Find all item divs in Column 0
      const colItems = containerRef.current.querySelectorAll(`[data-col-index="0"]`);
      colItems.forEach((itemEl: any) => {
        const itemCoords = getCoordinates(itemEl);
        newConnections.push({
          fromX: rootCoords.rightX,
          fromY: rootCoords.centerY,
          toX: itemCoords.leftX,
          toY: itemCoords.centerY,
          isActive: columns[0]?.selectedValue === itemEl.dataset.value || !columns[0]?.selectedValue
        });
      });
    }

    // 2. Connections between columns
    for (let c = 0; c < columns.length - 1; c++) {
      const parentVal = columns[c].selectedValue;
      if (!parentVal) continue;

      const parentEl = nodeRefs.current[`col-${c}-item-${parentVal}`];
      if (!parentEl) continue;

      const parentCoords = getCoordinates(parentEl);
      const nextColItems = containerRef.current.querySelectorAll(`[data-col-index="${c + 1}"]`);

      nextColItems.forEach((itemEl: any) => {
        const itemCoords = getCoordinates(itemEl);
        newConnections.push({
          fromX: parentCoords.rightX,
          fromY: parentCoords.centerY,
          toX: itemCoords.leftX,
          toY: itemCoords.centerY,
          isActive: columns[c + 1]?.selectedValue === itemEl.dataset.value || !columns[c + 1]?.selectedValue
        });
      });
    }

    setConnections(newConnections);
  };

  useEffect(() => {
    // Delay slightly to let the DOM render before measuring
    const timer = setTimeout(() => {
      updateConnections();
    }, 100);

    window.addEventListener('resize', updateConnections);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateConnections);
    };
  }, [columns, transactions, activeMetric]);

  // Total value for root
  const rootValue = transactions.reduce((acc, t) => acc + t[activeMetric], 0);

  // Helper to format values
  const formatVal = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getMetricLabel = () => {
    if (activeMetric === 'salesValue') return 'Revenue';
    if (activeMetric === 'netProfit') return 'Net Profit';
    return 'Cost of Sales';
  };

  // Get data for a specific column index
  const getColumnData = (colIndex: number) => {
    // Filter transactions based on all selected parent values in previous columns
    let filtered = [...transactions];
    for (let i = 0; i < colIndex; i++) {
      const prevCol = columns[i];
      if (prevCol.selectedValue) {
        filtered = filtered.filter(t => {
          const val = t[prevCol.dimension as keyof Transaction];
          return val?.toString() === prevCol.selectedValue;
        });
      } else {
        // If a previous column doesn't have a selection, this column shouldn't have data
        return { items: [], total: 0 };
      }
    }

    const currentDimension = columns[colIndex].dimension;
    const totals: { [key: string]: number } = {};

    filtered.forEach(t => {
      const val = t[currentDimension as keyof Transaction];
      if (val !== undefined && val !== null && val !== '') {
        const key = val.toString();
        totals[key] = (totals[key] || 0) + t[activeMetric];
      }
    });

    // Parent value for ratio
    let parentValue = rootValue;
    if (colIndex > 0) {
      const prevSelectedVal = columns[colIndex - 1].selectedValue;
      // Filter transactions up to prev column to get parent total
      let parentFiltered = [...transactions];
      for (let i = 0; i < colIndex; i++) {
        const prevCol = columns[i];
        parentFiltered = parentFiltered.filter(t => t[prevCol.dimension as keyof Transaction]?.toString() === prevCol.selectedValue);
      }
      parentValue = parentFiltered.reduce((acc, t) => acc + t[activeMetric], 0);
    }

    const items = Object.entries(totals)
      .map(([name, val]) => ({
        name,
        value: val,
        percentageOfParent: parentValue > 0 ? (val / parentValue) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Show top 7 items

    return { items, total: parentValue };
  };

  // Expand next level by dimension
  const addColumn = (dimensionId: string, fromColIndex: number) => {
    const updated = [...columns.slice(0, fromColIndex + 1)];
    updated.push({ dimension: dimensionId, selectedValue: '' });
    setColumns(updated);
    setOpenDropdownColIndex(null);
  };

  // Remove column
  const removeColumn = (colIndex: number) => {
    const updated = [...columns.slice(0, colIndex)];
    if (updated.length === 0) {
      // Keep at least one column
      updated.push({ dimension: 'country', selectedValue: '' });
    }
    setColumns(updated);
    setOpenDropdownColIndex(null);
  };

  // Handle card selection
  const selectNode = (colIndex: number, value: string) => {
    const updated = [...columns];
    
    if (updated[colIndex].selectedValue === value) {
      // Deselecting: clear this selection and all subsequent selections/columns
      updated[colIndex].selectedValue = '';
      setColumns(updated.slice(0, colIndex + 1));
    } else {
      // Selecting: set value and clear subsequent selections
      updated[colIndex].selectedValue = value;
      // Clear selections in columns after this one
      for (let i = colIndex + 1; i < updated.length; i++) {
        updated[i].selectedValue = '';
      }
      setColumns(updated.slice(0, colIndex + 2)); // keep next column visible if already defined
    }
    setOpenDropdownColIndex(null);
  };

  return (
    <div className={`w-full flex flex-col h-full premium-card rounded-xl p-6 relative select-none transition-all duration-300 ${
      isFullscreen ? 'fixed inset-0 z-[9999] premium-bg border-none rounded-none w-screen h-screen p-10 overflow-auto' : 'overflow-hidden'
    }`} ref={containerRef}>
      
      {/* Top controls */}
      <div className="flex justify-between items-center mb-6 z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Decomposition Tree (Sơ đồ phân rã)
          </h2>
          <p className="text-xs text-slate-400">Drill down and split metrics by dimensions dynamically</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Metric Selector Tabs */}
          <div className="flex bg-[#0d1220] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveMetric('salesValue')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeMetric === 'salesValue'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveMetric('netProfit')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeMetric === 'netProfit'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Net Profit
            </button>
            <button
              onClick={() => setActiveMetric('costOfSales')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeMetric === 'costOfSales'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cost of Sales
            </button>
          </div>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#0d1220] border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-all flex items-center justify-center"
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Xem toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SVG Canvas for Connections */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="w-full h-full">
          {connections.map((conn, idx) => {
            const dx = conn.toX - conn.fromX;
            const controlOffset = Math.min(dx * 0.4, 40);
            const path = `M ${conn.fromX},${conn.fromY} C ${conn.fromX + controlOffset},${conn.fromY} ${conn.toX - controlOffset},${conn.toY} ${conn.toX},${conn.toY}`;
            return (
              <path
                key={idx}
                d={path}
                fill="none"
                stroke={conn.isActive ? (activeMetric === 'netProfit' ? '#10b981' : activeMetric === 'costOfSales' ? '#f59e0b' : '#3b82f6') : '#1e293b'}
                strokeWidth={conn.isActive ? 2 : 1}
                strokeOpacity={conn.isActive ? 0.8 : 0.2}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
      </div>

      {/* Main tree layout */}
      <div className="flex-1 flex gap-[70px] items-start z-10 overflow-x-auto min-h-[500px] pb-4">
        
        {/* ROOT NODE (Metric Selector output) */}
        <div className="flex flex-col pt-12">
          <div className="text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider text-center">Root Metric</div>
          <div
            ref={rootNodeRef}
            className={`w-[170px] bg-[#0c111d] border-2 rounded-lg p-3 text-center flex flex-col justify-center cursor-pointer transition-all duration-300 ${
              activeMetric === 'netProfit'
                ? 'border-emerald-500/50 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : activeMetric === 'costOfSales'
                ? 'border-amber-500/50 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                : 'border-blue-500/50 hover:border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
            }`}
          >
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">{getMetricLabel()}</span>
            <span className="text-lg font-bold text-slate-100 mt-1 font-mono tracking-tight">
              {formatVal(rootValue)}
            </span>
          </div>
        </div>

        {/* DYNAMIC COLUMNS */}
        {columns.map((col, colIdx) => {
          const { items } = getColumnData(colIdx);
          const usedDimensions = columns.map(c => c.dimension);
          const availableDimensions = DIMENSIONS.filter(d => !usedDimensions.includes(d.id));

          return (
            <div key={colIdx} className="flex flex-col w-[200px] shrink-0">
              
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-2">
                <span className="text-slate-300 text-xs font-bold font-mono uppercase tracking-wider truncate">
                  {DIMENSIONS.find(d => d.id === col.dimension)?.label}
                </span>
                
                {/* Remove button (only if it's not the first column or if there's multiple columns) */}
                {(columns.length > 1) && (
                  <button
                    onClick={() => removeColumn(colIdx)}
                    className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3 relative min-h-[300px]">
                {items.map((item) => {
                  const isSelected = col.selectedValue === item.name;
                  const isAnySelected = !!col.selectedValue;
                  const isParentSelected = colIdx === 0 || columns[colIdx - 1].selectedValue !== '';

                  // Dynamic color styling depending on selected metric
                  const getProgressBarColor = () => {
                    if (activeMetric === 'netProfit') return 'bg-emerald-600/30 border-r border-emerald-500/50';
                    if (activeMetric === 'costOfSales') return 'bg-amber-600/30 border-r border-amber-500/50';
                    return 'bg-blue-600/30 border-r border-blue-500/50';
                  };

                  const getBorderColor = () => {
                    if (isSelected) {
                      if (activeMetric === 'netProfit') return 'border-emerald-500 ring-1 ring-emerald-500/30';
                      if (activeMetric === 'costOfSales') return 'border-amber-500 ring-1 ring-amber-500/30';
                      return 'border-blue-500 ring-1 ring-blue-500/30';
                    }
                    return 'border-slate-800 hover:border-slate-700';
                  };

                  return (
                    <div
                      key={item.name}
                      data-col-index={colIdx}
                      data-value={item.name}
                      ref={el => { nodeRefs.current[`col-${colIdx}-item-${item.name}`] = el; }}
                      onClick={() => selectNode(colIdx, item.name)}
                      className={`relative w-full bg-[#070b13] border rounded-lg p-2.5 flex flex-col justify-center cursor-pointer overflow-hidden transition-all duration-300 ${getBorderColor()} ${
                        isAnySelected && !isSelected ? 'opacity-40 hover:opacity-75' : ''
                      }`}
                    >
                      {/* Background fill based on value percentage */}
                      <div
                        className={`absolute top-0 left-0 bottom-0 ${getProgressBarColor()} transition-all duration-500 pointer-events-none`}
                        style={{ width: `${item.percentageOfParent}%` }}
                      />

                      {/* Content */}
                      <div className="relative z-10 flex justify-between items-start">
                        <div className="flex flex-col max-w-[130px]">
                          <span className="text-slate-200 text-xs font-bold truncate leading-tight mb-1" title={item.name}>
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.percentageOfParent.toFixed(1)}% of parent
                          </span>
                        </div>
                        <span className="text-[11px] font-bold font-mono text-slate-100 tracking-tighter">
                          {formatVal(item.value)}
                        </span>
                      </div>

                      {/* Expand trigger indicator */}
                      {isSelected && colIdx === columns.length - 1 && availableDimensions.length > 0 && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownColIndex(openDropdownColIndex === colIdx ? null : colIdx);
                            }}
                            className="bg-slate-900 border border-slate-700 text-slate-300 rounded-full p-1 hover:text-white hover:bg-slate-800 hover:scale-115 transition-all shadow-md"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* If selected card at the end column, show the dimension expand selector directly if no items dropdown is toggled */}
                {col.selectedValue && colIdx === columns.length - 1 && availableDimensions.length > 0 && openDropdownColIndex === colIdx && (
                  <div className="absolute right-[-70px] top-[40%] translate-x-full z-50 bg-[#0d1220] border border-slate-800 rounded-lg p-2 shadow-2xl flex flex-col gap-1 w-[160px] animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1">Split By</div>
                    {availableDimensions.map(d => (
                      <button
                        key={d.id}
                        onClick={() => addColumn(d.id, colIdx)}
                        className="text-left w-full text-slate-300 hover:text-white hover:bg-slate-800/80 px-2 py-1.5 rounded text-xs font-medium transition-colors"
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Show a placeholder message if previous column is not selected */}
                {items.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-900 rounded-lg p-4 text-center">
                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Select Node Above</span>
                    <span className="text-[10px] text-slate-700 mt-1">Select a parent in the previous column to view split</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* ADD COLUMN PLACEHOLDER FOR LAST COLUMN */}
        {columns[columns.length - 1].selectedValue === '' && (
          <div className="flex flex-col w-[200px] shrink-0 h-[400px] border border-dashed border-slate-900 rounded-xl items-center justify-center p-6 text-center">
            <span className="text-slate-600 text-xs font-bold font-mono uppercase tracking-widest mb-1">Select Parent Node</span>
            <p className="text-[10px] text-slate-700 leading-normal">
              Click on a card in the left column to activate the split options for this column
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
