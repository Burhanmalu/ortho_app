// ========================================
// OrthoCare — Main Application Entry (Multi-Role)
// ========================================

// Styles
import './styles/variables.css';
import './styles/reset.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/screens.css';
import './styles/wholesale.css';
import './styles/admin.css';

// Core
import { registerRoute, startRouter } from './router.js';
import { initUniversalDemoRoleSwitcher } from './components/index.js';

// Retail Customer Screens
import SplashScreen from './screens/SplashScreen.js';
import OnboardingScreen from './screens/OnboardingScreen.js';
import LoginScreen from './screens/LoginScreen.js';
import HomeScreen from './screens/HomeScreen.js';
import CategoriesScreen from './screens/CategoriesScreen.js';
import ProductListingScreen from './screens/ProductListingScreen.js';
import ProductDetailScreen from './screens/ProductDetailScreen.js';
import SearchScreen from './screens/SearchScreen.js';
import CartScreen from './screens/CartScreen.js';
import CheckoutScreen from './screens/CheckoutScreen.js';
import OrderSuccessScreen from './screens/OrderSuccessScreen.js';
import OrdersScreen from './screens/OrdersScreen.js';
import WishlistScreen from './screens/WishlistScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import NotificationsScreen from './screens/NotificationsScreen.js';
import OffersScreen from './screens/OffersScreen.js';

// Wholesale B2B Screens
import WholesaleRegistrationScreen from './screens/wholesale/WholesaleRegistrationScreen.js';
import WholesaleLoginScreen from './screens/wholesale/WholesaleLoginScreen.js';
import WholesaleVerificationPendingScreen from './screens/wholesale/WholesaleVerificationPendingScreen.js';
import WholesaleDashboardScreen from './screens/wholesale/WholesaleDashboardScreen.js';
import WholesaleProductListingScreen from './screens/wholesale/WholesaleProductListingScreen.js';
import WholesaleProductDetailScreen from './screens/wholesale/WholesaleProductDetailScreen.js';
import WholesaleBulkOrderScreen from './screens/wholesale/WholesaleBulkOrderScreen.js';
import WholesaleCartScreen from './screens/wholesale/WholesaleCartScreen.js';
import WholesaleCheckoutScreen from './screens/wholesale/WholesaleCheckoutScreen.js';
import WholesaleOrdersScreen from './screens/wholesale/WholesaleOrdersScreen.js';
import WholesaleInvoicesScreen from './screens/wholesale/WholesaleInvoicesScreen.js';
import WholesaleProfileScreen from './screens/wholesale/WholesaleProfileScreen.js';

// Admin Portal Screens
import AdminDashboardScreen from './screens/admin/AdminDashboardScreen.js';
import AdminProductsScreen from './screens/admin/AdminProductsScreen.js';
import AdminCategoriesScreen from './screens/admin/AdminCategoriesScreen.js';
import AdminInventoryScreen from './screens/admin/AdminInventoryScreen.js';
import AdminOrdersScreen from './screens/admin/AdminOrdersScreen.js';
import AdminCustomersScreen from './screens/admin/AdminCustomersScreen.js';
import AdminWholesaleBuyersScreen from './screens/admin/AdminWholesaleBuyersScreen.js';
import AdminPricingScreen from './screens/admin/AdminPricingScreen.js';
import AdminCouponsScreen from './screens/admin/AdminCouponsScreen.js';
import AdminNotificationsScreen from './screens/admin/AdminNotificationsScreen.js';
import AdminReportsScreen from './screens/admin/AdminReportsScreen.js';
import AdminSettingsScreen from './screens/admin/AdminSettingsScreen.js';

// ========================================
// Register Retail Routes
// ========================================
registerRoute('splash', SplashScreen);
registerRoute('onboarding', OnboardingScreen);
registerRoute('login', LoginScreen);
registerRoute('home', HomeScreen);
registerRoute('categories', CategoriesScreen);
registerRoute('listing', ProductListingScreen);
registerRoute('product', ProductDetailScreen);
registerRoute('search', SearchScreen);
registerRoute('cart', CartScreen);
registerRoute('checkout', CheckoutScreen);
registerRoute('success', OrderSuccessScreen);
registerRoute('orders', OrdersScreen);
registerRoute('wishlist', WishlistScreen);
registerRoute('profile', ProfileScreen);
registerRoute('notifications', NotificationsScreen);
registerRoute('offers', OffersScreen);

// ========================================
// Register Wholesale B2B Routes
// ========================================
registerRoute('wholesale/register', WholesaleRegistrationScreen);
registerRoute('wholesale/login', WholesaleLoginScreen);
registerRoute('wholesale/verification-pending', WholesaleVerificationPendingScreen);
registerRoute('wholesale/dashboard', WholesaleDashboardScreen);
registerRoute('wholesale/products', WholesaleProductListingScreen);
registerRoute('wholesale/product', WholesaleProductDetailScreen);
registerRoute('wholesale/bulk-order', WholesaleBulkOrderScreen);
registerRoute('wholesale/cart', WholesaleCartScreen);
registerRoute('wholesale/checkout', WholesaleCheckoutScreen);
registerRoute('wholesale/orders', WholesaleOrdersScreen);
registerRoute('wholesale/invoices', WholesaleInvoicesScreen);
registerRoute('wholesale/profile', WholesaleProfileScreen);

// ========================================
// Register Admin Portal Routes
// ========================================
registerRoute('admin/dashboard', AdminDashboardScreen);
registerRoute('admin/products', AdminProductsScreen);
registerRoute('admin/categories', AdminCategoriesScreen);
registerRoute('admin/inventory', AdminInventoryScreen);
registerRoute('admin/orders', (appEl) => AdminOrdersScreen(appEl, 'retail'));
registerRoute('admin/wholesale-orders', (appEl) => AdminOrdersScreen(appEl, 'wholesale'));
registerRoute('admin/customers', AdminCustomersScreen);
registerRoute('admin/wholesale-buyers', AdminWholesaleBuyersScreen);
registerRoute('admin/pricing', AdminPricingScreen);
registerRoute('admin/coupons', AdminCouponsScreen);
registerRoute('admin/notifications', AdminNotificationsScreen);
registerRoute('admin/reports', AdminReportsScreen);
registerRoute('admin/settings', AdminSettingsScreen);

// ========================================
// Start App & Mount Demo Role Switcher
// ========================================
const appEl = document.getElementById('app');
startRouter(appEl);
initUniversalDemoRoleSwitcher();
