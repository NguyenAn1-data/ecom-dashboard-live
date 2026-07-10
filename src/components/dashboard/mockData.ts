import { Transaction, CoPurchasingItem } from './types';

export const MOCK_TRANSACTIONS: Transaction[] = [
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

export const MOCK_CO_PURCHASE: CoPurchasingItem[] = [
  { product_one: 'Classic Cars', product_two: 'Vintage Cars', count: 42 },
  { product_one: 'Classic Cars', product_two: 'Motorcycles', count: 28 },
  { product_one: 'Trucks and Buses', product_two: 'Vintage Cars', count: 19 },
  { product_one: 'Classic Cars', product_two: 'Planes', count: 12 },
  { product_one: 'Vintage Cars', product_two: 'Ships', count: 8 }
];
