// ========================================
// OrthoCare — Main Application Entry
// ========================================

// Styles
import './styles/variables.css';
import './styles/reset.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/screens.css';

// Core
import { registerRoute, startRouter } from './router.js';

// Screens
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

// Register all routes
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

// Start the app
const appEl = document.getElementById('app');
startRouter(appEl);
