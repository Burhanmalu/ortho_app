// ========================================
// OrthoCare Admin Data, Analytics & Config
// ========================================

export const adminKPIs = {
  totalSales: 1284500,
  retailOrders: 1248,
  wholesaleOrders: 184,
  totalCustomers: 8420,
  wholesaleBuyers: 326,
  totalProducts: 55,
  lowStockCount: 24,
  pendingVerifications: 3
};

// Monthly Sales Analytics (in INR)
export const monthlySalesData = [
  { month: 'Jan', retail: 68000, wholesale: 52000, total: 120000 },
  { month: 'Feb', retail: 74000, wholesale: 61000, total: 135000 },
  { month: 'Mar', retail: 81000, wholesale: 75000, total: 156000 },
  { month: 'Apr', retail: 79000, wholesale: 68000, total: 147000 },
  { month: 'May', retail: 86000, wholesale: 84000, total: 170000 },
  { month: 'Jun', retail: 92000, wholesale: 95000, total: 187000 },
  { month: 'Jul', retail: 99000, wholesale: 108000, total: 207000 },
  { month: 'Aug', retail: 105000, wholesale: 122000, total: 227000 },
  { month: 'Sep (MTD)', retail: 48000, wholesale: 65000, total: 113000 }
];

// Revenue Split
export const revenueSplit = {
  retailTotal: 732000, // ~57%
  wholesaleTotal: 552500, // ~43%
  percentRetail: 57,
  percentWholesale: 43
};

// Top Selling Products
export const topSellingProducts = [
  { id: 'OC0001', name: 'Adjustable Knee Support Brace', category: 'Knee Support', retailUnits: 480, wholesaleUnits: 1850, revenue: 148500 },
  { id: 'OC0013', name: 'Ergonomic Lumbar Sacral Back Belt', category: 'Back Support', retailUnits: 340, wholesaleUnits: 1200, revenue: 134200 },
  { id: 'OC0025', name: 'Rigid Philadelphia Cervical Collar', category: 'Neck Support', retailUnits: 290, wholesaleUnits: 1400, revenue: 98600 },
  { id: 'OC0037', name: 'Adjustable Wrist Brace with Splint', category: 'Wrist Support', retailUnits: 380, wholesaleUnits: 1600, revenue: 89400 },
  { id: 'OC0085', name: 'Lightweight Folding Wheelchair', category: 'Walking Aids', retailUnits: 45, wholesaleUnits: 120, revenue: 84500 }
];

// Wholesale Tiers Configuration
export const wholesaleTiers = [
  {
    tier: 'Bronze',
    badgeColor: '#CD7F32',
    minAnnualPurchases: 0,
    discountPercent: 0,
    minOrderQty: 10,
    creditDays: 0,
    description: 'Starting tier for new registered and verified clinics/stores'
  },
  {
    tier: 'Silver',
    badgeColor: '#A0AEC0',
    minAnnualPurchases: 250000,
    discountPercent: 5,
    minOrderQty: 25,
    creditDays: 15,
    description: 'For growing retail stores and physiotherapy centers'
  },
  {
    tier: 'Gold',
    badgeColor: '#D97706',
    minAnnualPurchases: 750000,
    discountPercent: 8,
    minOrderQty: 50,
    creditDays: 30,
    description: 'For busy hospital departments and multi-branch pharmacies'
  },
  {
    tier: 'Platinum',
    badgeColor: '#4F46E5',
    minAnnualPurchases: 2000000,
    discountPercent: 12,
    minOrderQty: 100,
    creditDays: 45,
    description: 'For major regional distributors and corporate hospital networks'
  }
];

// Admin Coupons (Retail / Wholesale / Both)
export const initialCoupons = [
  {
    code: 'ORTHOFIRST',
    title: 'First Order Welcome',
    discountType: 'percentage', // percentage | fixed
    discountValue: 15,
    minOrder: 799,
    maxDiscount: 300,
    userType: 'retail', // retail | wholesale | both
    startDate: '01 Jan 2026',
    endDate: '31 Dec 2026',
    usageLimit: 10000,
    usedCount: 4210,
    active: true
  },
  {
    code: 'KNEE20',
    title: 'Knee Health Recovery',
    discountType: 'percentage',
    discountValue: 20,
    minOrder: 999,
    maxDiscount: 400,
    userType: 'retail',
    startDate: '01 Sep 2026',
    endDate: '30 Sep 2026',
    usageLimit: 2000,
    usedCount: 892,
    active: true
  },
  {
    code: 'CARE500',
    title: 'Flat ₹500 Off Large Cart',
    discountType: 'fixed',
    discountValue: 500,
    minOrder: 2999,
    maxDiscount: 500,
    userType: 'retail',
    startDate: '15 Aug 2026',
    endDate: '15 Oct 2026',
    usageLimit: 1500,
    usedCount: 614,
    active: true
  },
  {
    code: 'B2BEXPEDITE',
    title: 'Wholesale B2B Bulk Launch',
    discountType: 'percentage',
    discountValue: 5,
    minOrder: 25000,
    maxDiscount: 5000,
    userType: 'wholesale',
    startDate: '01 Aug 2026',
    endDate: '31 Oct 2026',
    usageLimit: 500,
    usedCount: 142,
    active: true
  },
  {
    code: 'HOSPITAL10',
    title: 'Institutional Bulk Grant',
    discountType: 'percentage',
    discountValue: 10,
    minOrder: 50000,
    maxDiscount: 15000,
    userType: 'wholesale',
    startDate: '01 Jul 2026',
    endDate: '31 Dec 2026',
    usageLimit: 200,
    usedCount: 88,
    active: true
  },
  {
    code: 'FREESHIPB2B',
    title: 'Free Freight on Pallets',
    discountType: 'fixed',
    discountValue: 1500,
    minOrder: 30000,
    maxDiscount: 1500,
    userType: 'wholesale',
    startDate: '01 Jan 2026',
    endDate: '31 Dec 2026',
    usageLimit: 1000,
    usedCount: 310,
    active: true
  },
  {
    code: 'FESTIVECARE',
    title: 'Universal Festival Wellness',
    discountType: 'percentage',
    discountValue: 8,
    minOrder: 1500,
    maxDiscount: 2000,
    userType: 'both',
    startDate: '10 Sep 2026',
    endDate: '25 Oct 2026',
    usageLimit: 5000,
    usedCount: 1205,
    active: true
  }
];

// Broadcast Notification System
export const initialBroadcastNotifications = [
  {
    id: 'NOTIF-01',
    target: 'retail',
    title: 'Autumn Joint Care Season — Flat 20% OFF Knee Braces',
    message: 'Protect your joints this changing weather with our certified knee braces. Use code KNEE20.',
    sentAt: '12 Sep 2026, 10:00 AM',
    delivered: 8420,
    clicked: 1240
  },
  {
    id: 'NOTIF-02',
    target: 'wholesale',
    title: 'New Bulk Pallet Pricing on Cervical & Lumbar Supports',
    message: 'Hospitals & Pharmacies can now procure 50+ carton lots at an extra 8% margin. Dispatch in 24h.',
    sentAt: '13 Sep 2026, 02:30 PM',
    delivered: 326,
    clicked: 184
  },
  {
    id: 'NOTIF-03',
    target: 'all',
    title: 'New ISO-Certified Walking Aids & Wheelchairs Added',
    message: 'Explore our latest lightweight aluminium walking frames and compact wheelchairs with warranty.',
    sentAt: '08 Sep 2026, 11:15 AM',
    delivered: 8746,
    clicked: 2110
  }
];

export const businessTypes = [
  'Hospital / Clinic',
  'Retail Pharmacy / Medical Store',
  'Orthopedic Care Center',
  'Physiotherapy Center',
  'Medical Equipment Distributor',
  'Rehabilitation Center',
  'Surgical & Nursing Home',
  'Other Healthcare Business'
];
