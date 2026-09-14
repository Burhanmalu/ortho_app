// ========================================
// OrthoCare Wholesale Orders & Invoices Data
// ========================================

export const wholesaleOrders = [
  {
    id: 'WHO-10482',
    date: '14 Sep 2026',
    buyerId: 'WB-001',
    businessName: 'Apollo Pharmacy Regional Supply',
    gstin: '07AAAAA0000A1Z5',
    status: 'processing', // pending | processing | shipped | delivered | cancelled
    items: [
      { productId: 'OC0001', name: 'Adjustable Knee Support Brace', sku: 'OC-KN-001', hsn: '90211000', qty: 50, unitPrice: 599, total: 29950 },
      { productId: 'OC0013', name: 'Ergonomic Lumbar Sacral Back Belt', sku: 'OC-BA-013', hsn: '90211000', qty: 30, unitPrice: 899, total: 26970 },
      { productId: 'OC0025', name: 'Rigid Philadelphia Cervical Collar', sku: 'OC-NE-025', hsn: '90211000', qty: 40, unitPrice: 489, total: 19560 },
      { productId: 'OC0037', name: 'Adjustable Wrist Brace with Splint', sku: 'OC-WR-037', hsn: '90211000', qty: 50, unitPrice: 349, total: 17450 }
    ],
    subtotal: 93930,
    bulkDiscount: 4697, // 5% tier rebate
    taxableAmount: 89233,
    gstRate: 18,
    gstType: 'CGST_SGST', // CGST_SGST for intra-state or IGST for inter-state
    cgst: 8031,
    sgst: 8031,
    igst: 0,
    shipping: 0, // Free B2B freight > ₹15,000
    total: 105295,
    paymentMethod: '30-Day Credit Term (Pre-approved)',
    paymentStatus: 'Credit Invoiced (Net 30)',
    shippingAddress: {
      facility: 'Central Receiving Dock #4',
      address: 'Plot 42, Karkardooma Institutional Area',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110092',
      contact: 'Mr. Satish Mehra (+91 98201 44825)'
    },
    billingAddress: {
      legalName: 'Apollo Pharmacy Retail Private Limited',
      address: 'Plot 42, Karkardooma Institutional Area',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110092',
      gstin: '07AAAAA0000A1Z5',
      pan: 'AAAAA0000A'
    },
    tracking: {
      courier: 'Blue Dart Surface Heavy Cargo',
      awb: 'BLUEDT-WHO-889104',
      status: 'Order packed in master cartons; dispatch scheduled today',
      estimatedDelivery: '16 Sep 2026'
    }
  },
  {
    id: 'WHO-10481',
    date: '12 Sep 2026',
    buyerId: 'WB-002',
    businessName: 'MedPlus Healthcare Supplies',
    gstin: '36AABCM3829N1Z2',
    status: 'shipped',
    items: [
      { productId: 'OC0003', name: 'Compression Knee Sleeve (Pair)', sku: 'OC-KN-003', hsn: '90211000', qty: 60, unitPrice: 319, total: 19140 },
      { productId: 'OC0049', name: 'Figure-8 Ankle Support Brace', sku: 'OC-AN-049', hsn: '90211000', qty: 40, unitPrice: 349, total: 13960 }
    ],
    subtotal: 33100,
    bulkDiscount: 1655,
    taxableAmount: 31445,
    gstRate: 18,
    gstType: 'IGST',
    cgst: 0,
    sgst: 0,
    igst: 5660,
    shipping: 0,
    total: 37105,
    paymentMethod: 'Bank Transfer (NEFT/RTGS)',
    paymentStatus: 'Paid (UTR: HDFC009218204)',
    shippingAddress: {
      facility: 'MedPlus Distribution Hub',
      address: 'Survey 115/1, Hitech City Main Rd',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      contact: 'K. Venkat Rao'
    },
    billingAddress: {
      legalName: 'MedPlus Health Services Limited',
      address: 'Survey 115/1, Hitech City Main Rd',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      gstin: '36AABCM3829N1Z2',
      pan: 'AABCM3829N'
    },
    tracking: {
      courier: 'GATI KWE Express B2B',
      awb: 'GATI-HYD-55019',
      status: 'In Transit — Departed Nagpur Transshipment Hub',
      estimatedDelivery: '15 Sep 2026'
    }
  },
  {
    id: 'WHO-10480',
    date: '10 Sep 2026',
    buyerId: 'WB-003',
    businessName: 'Max Super Speciality Hospital',
    gstin: '07AABCM7712Q1ZW',
    status: 'delivered',
    items: [
      { productId: 'OC0002', name: 'Hinged Knee Stabilizer Pro', sku: 'OC-KN-002', hsn: '90211000', qty: 25, unitPrice: 1299, total: 32475 },
      { productId: 'OC0015', name: 'Post-Operative Lumbosacral Orthosis', sku: 'OC-BA-015', hsn: '90211000', qty: 20, unitPrice: 1699, total: 33980 },
      { productId: 'OC0085', name: 'Lightweight Folding Wheelchair', sku: 'OC-MO-085', hsn: '87131090', qty: 6, unitPrice: 5499, total: 32994 }
    ],
    subtotal: 99449,
    bulkDiscount: 5966,
    taxableAmount: 93483,
    gstRate: 18,
    gstType: 'CGST_SGST',
    cgst: 8413,
    sgst: 8413,
    igst: 0,
    shipping: 0,
    total: 110309,
    paymentMethod: 'Corporate PO (30-Day Terms)',
    paymentStatus: 'Invoiced',
    shippingAddress: {
      facility: 'Ortho Stores & OT Basement',
      address: '1, 2 Press Enclave Road, Saket',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      contact: 'Store Incharge: Rajiv Khanna'
    },
    billingAddress: {
      legalName: 'Max Healthcare Institute Limited',
      address: '1, 2 Press Enclave Road, Saket',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      gstin: '07AABCM7712Q1ZW',
      pan: 'AABCM7712Q'
    },
    tracking: {
      courier: 'Delhivery Surface Logistics',
      awb: 'DELH-MAX-77182',
      status: 'Delivered — Received by Rajiv Khanna',
      estimatedDelivery: '12 Sep 2026'
    }
  },
  {
    id: 'WHO-10479',
    date: '08 Sep 2026',
    buyerId: 'WB-007',
    businessName: 'Metro Surgical & Ortho Distributors',
    gstin: '07AAECM4491D1ZM',
    status: 'delivered',
    items: [
      { productId: 'OC0026', name: 'Soft Foam Cervical Support Collar', sku: 'OC-NE-026', hsn: '90211000', qty: 100, unitPrice: 219, total: 21900 },
      { productId: 'OC0038', name: 'Elastic Wrist Support Strap Band', sku: 'OC-WR-038', hsn: '90211000', qty: 100, unitPrice: 179, total: 17900 },
      { productId: 'OC0050', name: 'Neoprene Ankle Binder with Wrap', sku: 'OC-AN-050', hsn: '90211000', qty: 80, unitPrice: 269, total: 21520 }
    ],
    subtotal: 61320,
    bulkDiscount: 6132, // 10% Platinum distributor tier
    taxableAmount: 55188,
    gstRate: 18,
    gstType: 'CGST_SGST',
    cgst: 4967,
    sgst: 4967,
    igst: 0,
    shipping: 0,
    total: 65122,
    paymentMethod: 'Bank Transfer (NEFT)',
    paymentStatus: 'Paid (UTR: SBIN00881923)',
    shippingAddress: {
      facility: 'Godown 3',
      address: 'B-12, Bhagirath Palace, Chandni Chowk',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110006',
      contact: 'Rajesh Agarwal'
    },
    billingAddress: {
      legalName: 'Metro Surgical & Ortho Distributors',
      address: 'B-12, Bhagirath Palace, Chandni Chowk',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110006',
      gstin: '07AAECM4491D1ZM',
      pan: 'AAECM4491D'
    },
    tracking: {
      courier: 'Local Logistics Van #9',
      awb: 'LLV-DEL-0912',
      status: 'Delivered',
      estimatedDelivery: '09 Sep 2026'
    }
  },
  {
    id: 'WHO-10478',
    date: '05 Sep 2026',
    buyerId: 'WB-004',
    businessName: 'Fortis Escorts Rehab Center',
    gstin: '19AAACF3412E1ZL',
    status: 'delivered',
    items: [
      { productId: 'OC0086', name: 'Adjustable Aluminium Walking Stick', sku: 'OC-MO-086', hsn: '90219090', qty: 30, unitPrice: 389, total: 11670 },
      { productId: 'OC0087', name: 'Foldable Reciprocal Walking Frame', sku: 'OC-MO-087', hsn: '90219090', qty: 15, unitPrice: 1199, total: 17985 }
    ],
    subtotal: 29655,
    bulkDiscount: 1482,
    taxableAmount: 28173,
    gstRate: 18,
    gstType: 'IGST',
    cgst: 0,
    sgst: 0,
    igst: 5071,
    shipping: 0,
    total: 33244,
    paymentMethod: 'Corporate Card',
    paymentStatus: 'Paid',
    shippingAddress: {
      facility: 'Rehab Department Store',
      address: '730 Anandapur, EM Bypass',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700107',
      contact: 'Dr. Anita Sengupta'
    },
    billingAddress: {
      legalName: 'Fortis Healthcare Limited',
      address: '730 Anandapur, EM Bypass',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700107',
      gstin: '19AAACF3412E1ZL',
      pan: 'AAACF3412E'
    },
    tracking: {
      courier: 'Blue Dart Air Express',
      awb: 'BLUEDT-CCU-44109',
      status: 'Delivered',
      estimatedDelivery: '07 Sep 2026'
    }
  },
  {
    id: 'WHO-10477',
    date: '02 Sep 2026',
    buyerId: 'WB-008',
    businessName: 'Sanjeevani Orthopedic Clinic',
    gstin: '27AAMPS8821B1ZU',
    status: 'delivered',
    items: [
      { productId: 'OC0001', name: 'Adjustable Knee Support Brace', sku: 'OC-KN-001', hsn: '90211000', qty: 25, unitPrice: 619, total: 15475 },
      { productId: 'OC0014', name: 'Contoured Lumbar Support Cushion', sku: 'OC-BA-014', hsn: '94049000', qty: 20, unitPrice: 599, total: 11980 }
    ],
    subtotal: 27455,
    bulkDiscount: 1098,
    taxableAmount: 26357,
    gstRate: 18,
    gstType: 'IGST',
    cgst: 0,
    sgst: 0,
    igst: 4744,
    shipping: 0,
    total: 31101,
    paymentMethod: 'UPI Business (razorpay)',
    paymentStatus: 'Paid',
    shippingAddress: {
      facility: 'Clinic Reception',
      address: 'Plot 18, Tilak Road, Sadashiv Peth',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411030',
      contact: 'Dr. Anand Kulkarni'
    },
    billingAddress: {
      legalName: 'Sanjeevani Orthopedic & Fracture Clinic',
      address: 'Plot 18, Tilak Road, Sadashiv Peth',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411030',
      gstin: '27AAMPS8821B1ZU',
      pan: 'AAMPS8821B'
    },
    tracking: {
      courier: 'DTDC Priority Cargo',
      awb: 'DTDC-PUN-0918',
      status: 'Delivered',
      estimatedDelivery: '04 Sep 2026'
    }
  },
  {
    id: 'WHO-10476',
    date: '28 Aug 2026',
    buyerId: 'WB-001',
    businessName: 'Apollo Pharmacy Regional Supply',
    gstin: '07AAAAA0000A1Z5',
    status: 'delivered',
    items: [
      { productId: 'OC0061', name: 'Tennis & Golfer Elbow Strap with Gel Pad', sku: 'OC-EL-061', hsn: '90211000', qty: 80, unitPrice: 289, total: 23120 },
      { productId: 'OC0073', name: 'Universal Shoulder Immobilizer Sling', sku: 'OC-SH-073', hsn: '90211000', qty: 40, unitPrice: 399, total: 15960 }
    ],
    subtotal: 39080,
    bulkDiscount: 2344,
    taxableAmount: 36736,
    gstRate: 18,
    gstType: 'CGST_SGST',
    cgst: 3306,
    sgst: 3306,
    igst: 0,
    shipping: 0,
    total: 43348,
    paymentMethod: '30-Day Credit Term',
    paymentStatus: 'Paid on Due Date',
    shippingAddress: {
      facility: 'Central Warehouse Dock #2',
      address: 'Plot 42, Karkardooma Institutional Area',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110092',
      contact: 'Mr. Satish Mehra'
    },
    billingAddress: {
      legalName: 'Apollo Pharmacy Retail Private Limited',
      address: 'Plot 42, Karkardooma Institutional Area',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110092',
      gstin: '07AAAAA0000A1Z5',
      pan: 'AAAAA0000A'
    },
    tracking: {
      courier: 'Safexpress B2B Cargo',
      awb: 'SAFE-DEL-99120',
      status: 'Delivered',
      estimatedDelivery: '30 Aug 2026'
    }
  },
  {
    id: 'WHO-10475',
    date: '22 Aug 2026',
    buyerId: 'WB-002',
    businessName: 'MedPlus Healthcare Supplies',
    gstin: '36AABCM3829N1Z2',
    status: 'delivered',
    items: [
      { productId: 'OC0097', name: 'Medical Graduated Compression Stockings Class II', sku: 'OC-CO-097', hsn: '61151000', qty: 60, unitPrice: 649, total: 38940 }
    ],
    subtotal: 38940,
    bulkDiscount: 1947,
    taxableAmount: 36993,
    gstRate: 18,
    gstType: 'IGST',
    cgst: 0,
    sgst: 0,
    igst: 6659,
    shipping: 0,
    total: 43652,
    paymentMethod: 'Bank Transfer (RTGS)',
    paymentStatus: 'Paid',
    shippingAddress: {
      facility: 'MedPlus Distribution Hub',
      address: 'Survey 115/1, Hitech City Main Rd',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      contact: 'K. Venkat Rao'
    },
    billingAddress: {
      legalName: 'MedPlus Health Services Limited',
      address: 'Survey 115/1, Hitech City Main Rd',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      gstin: '36AABCM3829N1Z2',
      pan: 'AABCM3829N'
    },
    tracking: {
      courier: 'Blue Dart Surface',
      awb: 'BLUEDT-HYD-1192',
      status: 'Delivered',
      estimatedDelivery: '25 Aug 2026'
    }
  },
  {
    id: 'WHO-10474',
    date: '15 Aug 2026',
    buyerId: 'WB-007',
    businessName: 'Metro Surgical & Ortho Distributors',
    gstin: '07AAECM4491D1ZM',
    status: 'delivered',
    items: [
      { productId: 'OC0121', name: 'Orthopedic Heating Pad with Digital Auto Cutoff', sku: 'OC-PA-121', hsn: '90191020', qty: 50, unitPrice: 799, total: 39950 },
      { productId: 'OC0122', name: 'Reusable Hot & Cold Gel Ice Pack Wrap', sku: 'OC-PA-122', hsn: '30059090', qty: 100, unitPrice: 229, total: 22900 }
    ],
    subtotal: 62850,
    bulkDiscount: 5028,
    taxableAmount: 57822,
    gstRate: 18,
    gstType: 'CGST_SGST',
    cgst: 5204,
    sgst: 5204,
    igst: 0,
    shipping: 0,
    total: 68230,
    paymentMethod: 'Bank Transfer (NEFT)',
    paymentStatus: 'Paid',
    shippingAddress: {
      facility: 'Godown 3',
      address: 'B-12, Bhagirath Palace, Chandni Chowk',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110006',
      contact: 'Rajesh Agarwal'
    },
    billingAddress: {
      legalName: 'Metro Surgical & Ortho Distributors',
      address: 'B-12, Bhagirath Palace, Chandni Chowk',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110006',
      gstin: '07AAECM4491D1ZM',
      pan: 'AAECM4491D'
    },
    tracking: {
      courier: 'Direct Delivery Truck',
      awb: 'TRUCK-DEL-8812',
      status: 'Delivered',
      estimatedDelivery: '16 Aug 2026'
    }
  },
  {
    id: 'WHO-10473',
    date: '10 Aug 2026',
    buyerId: 'WB-003',
    businessName: 'Max Super Speciality Hospital',
    gstin: '07AABCM7712Q1ZW',
    status: 'delivered',
    items: [
      { productId: 'OC0109', name: 'Full Clavicle Posture Corrector & Spine Support', sku: 'OC-PO-109', hsn: '90211000', qty: 40, unitPrice: 599, total: 23960 }
    ],
    subtotal: 23960,
    bulkDiscount: 1438,
    taxableAmount: 22522,
    gstRate: 18,
    gstType: 'CGST_SGST',
    cgst: 2027,
    sgst: 2027,
    igst: 0,
    shipping: 0,
    total: 26576,
    paymentMethod: 'Corporate PO (30-Day Terms)',
    paymentStatus: 'Paid',
    shippingAddress: {
      facility: 'Ortho OT Store',
      address: '1, 2 Press Enclave Road, Saket',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      contact: 'Rajiv Khanna'
    },
    billingAddress: {
      legalName: 'Max Healthcare Institute Limited',
      address: '1, 2 Press Enclave Road, Saket',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      gstin: '07AABCM7712Q1ZW',
      pan: 'AABCM7712Q'
    },
    tracking: {
      courier: 'Delhivery Surface',
      awb: 'DELH-MAX-11920',
      status: 'Delivered',
      estimatedDelivery: '12 Aug 2026'
    }
  },
  {
    id: 'WHO-10472',
    date: '02 Aug 2026',
    buyerId: 'WB-011',
    businessName: 'PrimeMed Pharma Wholesale',
    gstin: '03AABCP9012F1Z9',
    status: 'cancelled',
    items: [
      { productId: 'OC0001', name: 'Adjustable Knee Support Brace', sku: 'OC-KN-001', hsn: '90211000', qty: 100, unitPrice: 549, total: 54900 }
    ],
    subtotal: 54900,
    bulkDiscount: 3294,
    taxableAmount: 51606,
    gstRate: 18,
    gstType: 'IGST',
    cgst: 0,
    sgst: 0,
    igst: 9289,
    shipping: 0,
    total: 60895,
    paymentMethod: 'Cheque on Dispatch',
    paymentStatus: 'Cancelled (Credit limit exceeded)',
    shippingAddress: {
      facility: 'Warehouse B',
      address: 'Industrial Focal Point, Phase 4',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141010',
      contact: 'Naveen Chhabra'
    },
    billingAddress: {
      legalName: 'PrimeMed Pharma Wholesale',
      address: 'Industrial Focal Point, Phase 4',
      city: 'Ludhiana',
      state: 'Punjab',
      pincode: '141010',
      gstin: '03AABCP9012F1Z9',
      pan: 'AABCP9012F'
    },
    tracking: {
      courier: 'None',
      awb: 'N/A',
      status: 'Order Cancelled',
      estimatedDelivery: '-'
    }
  }
];
