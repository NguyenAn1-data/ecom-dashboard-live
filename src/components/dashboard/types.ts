export interface Transaction {
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

export interface SalesOverviewItem {
  year: number;
  month: number;
  monthName: string;
  salesValue: number;
  netProfit: number;
  costOfSales: number;
  momPercent: number;
  ytdSalesValue: number;
}

export interface CoPurchasingItem {
  product_one: string;
  product_two: string;
  count: number;
}
