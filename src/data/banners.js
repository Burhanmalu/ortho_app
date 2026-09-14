// ========================================
// Banner & Promotional Data
// ========================================

export const banners = [
  {
    id: 1,
    title: 'Find the Right Support for Every Move',
    subtitle: 'ORTHOCARE ESSENTIALS',
    cta: 'Shop Now',
    bgGradient: 'linear-gradient(135deg, #176B87 0%, #1A8FAD 100%)',
    textColor: '#fff',
    ctaBg: '#fff',
    ctaColor: '#176B87',
    route: '#/categories',
  },
  {
    id: 2,
    title: 'Comfortable Support. Everyday Mobility.',
    subtitle: 'MOBILITY AIDS',
    cta: 'Explore',
    bgGradient: 'linear-gradient(135deg, #2E7D6A 0%, #39A96B 100%)',
    textColor: '#fff',
    ctaBg: '#fff',
    ctaColor: '#2E7D6A',
    route: '#/listing/mobility',
  },
  {
    id: 3,
    title: 'Mobility Essentials at Your Doorstep',
    subtitle: 'FREE DELIVERY ON ₹999+',
    cta: 'Shop Deals',
    bgGradient: 'linear-gradient(135deg, #123B4A 0%, #176B87 100%)',
    textColor: '#fff',
    ctaBg: '#39A96B',
    ctaColor: '#fff',
    route: '#/offers',
  },
];

export const notifications = [
  {
    id: 1, type: 'order', icon: '📦',
    title: 'Order Shipped!',
    text: 'Your order #OR48291 has been shipped and is on its way.',
    time: '2 min ago', unread: true,
    iconBg: '#E3F2F7',
  },
  {
    id: 2, type: 'offer', icon: '🏷️',
    title: '20% Off Knee Supports',
    text: 'Use code ORTHO20 to get 20% off on selected knee supports.',
    time: '1 hour ago', unread: true,
    iconBg: '#E8F7EF',
  },
  {
    id: 3, type: 'delivery', icon: '🚚',
    title: 'Arriving Tomorrow',
    text: 'Your Lumbar Back Support Belt will arrive by tomorrow.',
    time: '3 hours ago', unread: false,
    iconBg: '#F0E8F7',
  },
  {
    id: 4, type: 'product', icon: '💙',
    title: 'Back in Stock!',
    text: 'Hinged Knee Stabilizer Pro from your wishlist is back in stock.',
    time: 'Yesterday', unread: false,
    iconBg: '#F7EDE3',
  },
  {
    id: 5, type: 'offer', icon: '⚡',
    title: 'Flash Sale Starting!',
    text: 'Up to 40% off on selected orthopedic supports. Hurry!',
    time: 'Yesterday', unread: false,
    iconBg: '#FDE8E5',
  },
  {
    id: 6, type: 'order', icon: '✅',
    title: 'Order Delivered',
    text: 'Your order #OR47823 has been delivered successfully.',
    time: '2 days ago', unread: false,
    iconBg: '#E8F7EF',
  },
];

export const coupons = [
  { code: 'ORTHO20', offer: 'Get 20% OFF', condition: 'Minimum order ₹999', maxDiscount: 200 },
  { code: 'FIRSTORDER', offer: 'Get ₹150 OFF', condition: 'On your first order', maxDiscount: 150 },
  { code: 'KNEE30', offer: 'Get 30% OFF', condition: 'On Knee Support products', maxDiscount: 300 },
  { code: 'MOBILITY10', offer: 'Flat ₹500 OFF', condition: 'On Mobility Aids above ₹2,999', maxDiscount: 500 },
];

export const bankOffers = [
  { bank: 'HDFC Bank', offer: '10% instant discount on HDFC credit cards', icon: '🏦' },
  { bank: 'SBI Cards', offer: '5% cashback on SBI debit cards', icon: '💳' },
  { bank: 'Paytm UPI', offer: 'Flat ₹50 cashback on first Paytm UPI payment', icon: '📱' },
];

export const addresses = [
  {
    id: 1, type: 'Home', name: 'Rahul Sharma',
    line1: '42, Green Meadows Apartment',
    line2: 'Vijay Nagar, Indore',
    city: 'Indore', state: 'Madhya Pradesh', pin: '452010',
    phone: '9876543210',
    selected: true,
  },
  {
    id: 2, type: 'Work', name: 'Rahul Sharma',
    line1: 'Office 305, Tech Park',
    line2: 'AB Road, Indore',
    city: 'Indore', state: 'Madhya Pradesh', pin: '452001',
    phone: '9876543210',
    selected: false,
  },
];

export const paymentMethods = [
  { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: '🏦' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' },
];
