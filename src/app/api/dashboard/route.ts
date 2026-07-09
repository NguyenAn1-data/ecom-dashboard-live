import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/sheets';

// Defensive parser for numbers
function parseNumber(val: any): number {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  // Handle formatting like $1,234.56 or 1.234,56 or 1234.56
  let clean = val.toString().trim();
  // Remove currency signs
  clean = clean.replace(/[\$\s€đ]/g, '');
  
  // Detect European/Vietnamese format: dots as thousands, comma as decimal (e.g. 1.234,56)
  const hasComma = clean.includes(',');
  const hasDot = clean.includes('.');
  if (hasComma && hasDot) {
    if (clean.indexOf('.') < clean.indexOf(',')) {
      // 1.234,56 -> 1234.56
      clean = clean.replace(/\./g, '').replace(/,/g, '.');
    } else {
      // 1,234.56 -> 1234.56
      clean = clean.replace(/,/g, '');
    }
  } else if (hasComma) {
    // 1234,56 -> 1234.56
    // Check if it's thousands separator or decimal. Usually with 2 decimal places, it's decimal.
    const parts = clean.split(',');
    if (parts[parts.length - 1].length === 3 && parts.length > 2) {
      // 1,234,567 -> 1234567
      clean = clean.replace(/,/g, '');
    } else {
      clean = clean.replace(/,/g, '.');
    }
  } else if (hasDot) {
    // Check if dot is thousands separator: e.g. 1.234.567 or 1.234 (which could be decimal or thousand)
    // In our Excel output, we saw '8124.98', so dot is decimal.
    const parts = clean.split('.');
    if (parts[parts.length - 1].length === 3 && parts.length > 2) {
      clean = clean.replace(/\./g, '');
    }
  }

  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export async function GET() {
  try {
    // Fetch all 4 sheets in parallel
    const [
      productDbRaw,
      purchaseChangeRaw,
      creditLimitRaw,
      shippingRaw
    ] = await Promise.all([
      getSheetData('Product Database!A:L'),
      getSheetData('Purchase Value change!A:H'),
      getSheetData('Credit Limit!A:D'),
      getSheetData('Sheet3!A:J')
    ]);

    if (!productDbRaw || productDbRaw.length <= 1) {
      return NextResponse.json({ error: 'No data found in Product Database sheet.' }, { status: 404 });
    }

    // 1. Parse Purchase Value change to get customer mappings: orderNumber -> customerName, customerNumber
    // Headers: ['orderNumber', 'orderDate', 'customerNumber', 'sales_value', 'customerName', ...]
    const orderToCustomerMap = new Map<string, { customerName: string; customerNumber: string }>();
    if (purchaseChangeRaw && purchaseChangeRaw.length > 1) {
      const headers = purchaseChangeRaw[0].map((h: string) => h.trim());
      const orderIdx = headers.indexOf('orderNumber');
      const custNameIdx = headers.indexOf('customerName');
      const custNumIdx = headers.indexOf('customerNumber');

      if (orderIdx !== -1 && custNameIdx !== -1) {
        for (let i = 1; i < purchaseChangeRaw.length; i++) {
          const row = purchaseChangeRaw[i];
          const orderNum = row[orderIdx]?.toString().trim();
          const custName = row[custNameIdx]?.toString().trim();
          const custNum = custNumIdx !== -1 ? row[custNumIdx]?.toString().trim() : '';
          if (orderNum && custName) {
            orderToCustomerMap.set(orderNum, {
              customerName: custName,
              customerNumber: custNum || ''
            });
          }
        }
      }
    }

    // 2. Parse Credit Limit to get limit groupings: customerNumber (or orderNumber) -> creditLimit_grp
    // Headers: ['orderNumber', 'customerNumber', 'creditLimit_grp', 'Sales_Value']
    const orderToCreditLimitMap = new Map<string, string>();
    if (creditLimitRaw && creditLimitRaw.length > 1) {
      const headers = creditLimitRaw[0].map((h: string) => h.trim());
      const orderIdx = headers.indexOf('orderNumber');
      const limitIdx = headers.indexOf('creditLimit_grp');

      if (orderIdx !== -1 && limitIdx !== -1) {
        for (let i = 1; i < creditLimitRaw.length; i++) {
          const row = creditLimitRaw[i];
          const orderNum = row[orderIdx]?.toString().trim();
          const limitGrp = row[limitIdx]?.toString().trim();
          if (orderNum && limitGrp) {
            orderToCreditLimitMap.set(orderNum, limitGrp);
          }
        }
      }
    }

    // 3. Parse Shipping Details (Sheet3) to get late flag, required date, shipped date
    // Headers: ['orderNumber', 'orderDate', 'requiredDate', 'shippedDate', 'status', 'comments', 'customerNumber', 'Latest_Shipped_Date', 'Late_Flag']
    const orderToShippingMap = new Map<string, { requiredDate: string; shippedDate: string; status: string; lateFlag: number }>();
    if (shippingRaw && shippingRaw.length > 1) {
      const headers = shippingRaw[0].map((h: string) => h.trim());
      const orderIdx = headers.indexOf('orderNumber');
      const reqIdx = headers.indexOf('requiredDate');
      const shipIdx = headers.indexOf('shippedDate');
      const statusIdx = headers.indexOf('status');
      const lateIdx = headers.indexOf('Late_Flag');

      if (orderIdx !== -1) {
        for (let i = 1; i < shippingRaw.length; i++) {
          const row = shippingRaw[i];
          const orderNum = row[orderIdx]?.toString().trim();
          if (orderNum) {
            const reqDate = reqIdx !== -1 ? row[reqIdx]?.toString().trim() : '';
            const shipDate = shipIdx !== -1 ? row[shipIdx]?.toString().trim() : '';
            const status = statusIdx !== -1 ? row[statusIdx]?.toString().trim() : '';
            const lateFlagStr = lateIdx !== -1 ? row[lateIdx]?.toString().trim() : '0';
            const lateFlag = parseInt(lateFlagStr) || 0;
            orderToShippingMap.set(orderNum, {
              requiredDate: reqDate || '',
              shippedDate: shipDate || '',
              status: status || '',
              lateFlag
            });
          }
        }
      }
    }

    // 4. Parse Product Database (raw transactions) and JOIN with other sheets
    // Headers: ['orderDate', 'orderNumber', 'quantityOrdered', 'priceEach', 'productName', 'productLine', 'buyPrice', 'city', 'country', 'Sales Value', 'Cost of Sales', 'Net Profit']
    const prodHeaders = productDbRaw[0].map((h: string) => h.trim());
    const oDateIdx = prodHeaders.indexOf('orderDate');
    const oNumIdx = prodHeaders.indexOf('orderNumber');
    const qtyIdx = prodHeaders.indexOf('quantityOrdered');
    const priceIdx = prodHeaders.indexOf('priceEach');
    const pNameIdx = prodHeaders.indexOf('productName');
    const pLineIdx = prodHeaders.indexOf('productLine');
    const buyPriceIdx = prodHeaders.indexOf('buyPrice');
    const cityIdx = prodHeaders.indexOf('city');
    const countryIdx = prodHeaders.indexOf('country');
    const salesIdx = prodHeaders.indexOf('Sales Value');
    const costIdx = prodHeaders.indexOf('Cost of Sales');
    const profitIdx = prodHeaders.indexOf('Net Profit');

    const transactions: any[] = [];

    // Helper to format date strings
    const parseDateStr = (val: any) => {
      if (!val) return '';
      // Google sheets date serial numbers can occur, or standard strings
      // If it looks like a ISO date or MM/DD/YYYY, standard parse
      return val.toString().split('T')[0];
    };

    for (let i = 1; i < productDbRaw.length; i++) {
      const row = productDbRaw[i];
      const orderNum = row[oNumIdx]?.toString().trim();
      if (!orderNum) continue;

      const salesVal = parseNumber(row[salesIdx]);
      const costVal = parseNumber(row[costIdx]);
      const profitVal = parseNumber(row[profitIdx]);

      // Join data
      const custInfo = orderToCustomerMap.get(orderNum) || { customerName: 'Unknown Customer', customerNumber: 'Unknown' };
      const creditLimitGrp = orderToCreditLimitMap.get(orderNum) || 'd: Unknown';
      const shippingInfo = orderToShippingMap.get(orderNum) || { requiredDate: '', shippedDate: '', status: 'Unknown', lateFlag: 0 };

      transactions.push({
        orderDate: parseDateStr(row[oDateIdx]),
        orderNumber: orderNum,
        quantityOrdered: parseInt(row[qtyIdx]) || 0,
        priceEach: parseNumber(row[priceIdx]),
        productName: row[pNameIdx]?.toString().trim() || 'Unknown Product',
        productLine: row[pLineIdx]?.toString().trim() || 'Other',
        buyPrice: parseNumber(row[buyPriceIdx]),
        city: row[cityIdx]?.toString().trim() || 'Unknown City',
        country: row[countryIdx]?.toString().trim() || 'Unknown Country',
        salesValue: salesVal,
        costOfSales: costVal,
        netProfit: profitVal,
        customerName: custInfo.customerName,
        customerNumber: custInfo.customerNumber,
        creditLimitGrp,
        requiredDate: shippingInfo.requiredDate,
        shippedDate: shippingInfo.shippedDate,
        shippingStatus: shippingInfo.status,
        lateFlag: shippingInfo.lateFlag
      });
    }

    // 5. Generate Sales Overview Table Metrics (Year, Month aggregates with MoM% and YTD)
    // Format: key 'YYYY-MM'
    const monthlyAgg: { [key: string]: { year: number; month: number; salesValue: number; costOfSales: number; netProfit: number } } = {};
    
    transactions.forEach(t => {
      if (!t.orderDate) return;
      const dateParts = t.orderDate.split('-');
      if (dateParts.length < 2) return;
      const y = parseInt(dateParts[0]);
      const m = parseInt(dateParts[1]);
      if (isNaN(y) || isNaN(m)) return;

      const key = `${y}-${m.toString().padStart(2, '0')}`;
      if (!monthlyAgg[key]) {
        monthlyAgg[key] = { year: y, month: m, salesValue: 0, costOfSales: 0, netProfit: 0 };
      }
      monthlyAgg[key].salesValue += t.salesValue;
      monthlyAgg[key].costOfSales += t.costOfSales;
      monthlyAgg[key].netProfit += t.netProfit;
    });

    const sortedMonths = Object.keys(monthlyAgg).sort();
    const salesOverviewTable: any[] = [];
    
    // YTD runs within calendar years
    const ytdTracker: { [year: number]: number } = {};

    sortedMonths.forEach((key, index) => {
      const monthData = monthlyAgg[key];
      const year = monthData.year;
      
      // Calculate MoM%
      let momPercent = 0;
      if (index > 0) {
        const prevKey = sortedMonths[index - 1];
        const prevData = monthlyAgg[prevKey];
        // Only calculate if previous month has sales to avoid division by zero
        if (prevData.salesValue > 0) {
          momPercent = ((monthData.salesValue - prevData.salesValue) / prevData.salesValue) * 100;
        }
      }

      // Calculate YTD
      if (!ytdTracker[year]) {
        ytdTracker[year] = 0;
      }
      ytdTracker[year] += monthData.salesValue;

      salesOverviewTable.push({
        year,
        month: monthData.month,
        monthName: new Date(year, monthData.month - 1).toLocaleString('en-US', { month: 'long' }),
        salesValue: monthData.salesValue,
        netProfit: monthData.netProfit,
        costOfSales: monthData.costOfSales,
        momPercent,
        ytdSalesValue: ytdTracker[year]
      });
    });

    // 6. Products frequently purchased together (co-purchasing)
    // Group products by orderNumber
    const orderToProdLines = new Map<string, string[]>();
    transactions.forEach(t => {
      if (!orderToProdLines.has(t.orderNumber)) {
        orderToProdLines.set(t.orderNumber, []);
      }
      const list = orderToProdLines.get(t.orderNumber)!;
      if (!list.includes(t.productLine)) {
        list.push(t.productLine);
      }
    });

    const coPurchasingMap = new Map<string, number>();
    orderToProdLines.forEach((lines) => {
      if (lines.length < 2) return;
      // Generate pairs
      for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
          const pair = [lines[i], lines[j]].sort().join(' & ');
          coPurchasingMap.set(pair, (coPurchasingMap.get(pair) || 0) + 1);
        }
      }
    });

    const coPurchasingList = Array.from(coPurchasingMap.entries())
      .map(([pair, count]) => {
        const [product_one, product_two] = pair.split(' & ');
        return { product_one, product_two, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      transactions,
      salesOverviewTable: salesOverviewTable.reverse(), // Show newest first for table representation
      coPurchasingList
    });
  } catch (error: any) {
    console.error('API Error in GET:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
