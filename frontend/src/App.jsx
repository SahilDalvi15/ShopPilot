import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, getCurrentUser } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import AIChatbot from './components/AIChatbot';
import SpinToWin from './components/SpinToWin';
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import BrandsPage from './pages/BrandsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AuthCallback from './pages/AuthCallback';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BundleBuilderPage from './pages/BundleBuilderPage';
import ShopTheLookPage from './pages/ShopTheLookPage';
import StyleQuizPage from './pages/StyleQuizPage';
import LiveShoppingPage from './pages/LiveShoppingPage';
import SubscribeAndSavePage from './pages/SubscribeAndSavePage';
import SocialFeedPage from './pages/SocialFeedPage';
import OrdersPage from './pages/OrdersPage';
import { Gift } from 'lucide-react';
import WishlistPage from './pages/WishlistPage';
import SharedWishlistPage from './pages/SharedWishlistPage';
import ProfilePage from './pages/ProfilePage';
import AddressesPage from './pages/AddressesPage';
import LoyaltyDashboard from './pages/LoyaltyDashboard';
import VerifyEmailPage from './pages/VerifyEmailPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStats from './pages/admin/AdminStats';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReviews from './pages/admin/AdminReviews';
import ComparePage from './pages/ComparePage';
import CompareWidget from './components/CompareWidget';
import GlobalLoader from './components/GlobalLoader';
import './App.css';

// Admin route guard component
const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const isAdmin = ['admin', 'super_admin'].includes(user?.role);
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 relative">
      <Outlet />
    </main>
    <Footer />
    <CompareWidget />
    <AIChatbot />
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isSpinToWinOpen, setIsSpinToWinOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  // Fetch cart and wishlist from backend whenever the user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <GlobalLoader />
      <Routes>
        <Route element={<MainLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/shared-wishlist/:token" element={<SharedWishlistPage />} />
        <Route 
          path="/cart" 
          element={isAuthenticated ? <CartPage /> : <Navigate to="/login" replace />} 
        />
        <Route path="/bundle-builder" element={<BundleBuilderPage />} />
        <Route path="/shop-the-look" element={<ShopTheLookPage />} />
        <Route path="/ai-stylist" element={<StyleQuizPage />} />
        <Route path="/live" element={<LiveShoppingPage />} />
        <Route path="/discover" element={<SocialFeedPage />} />
        <Route path="/subscribe" element={<SubscribeAndSavePage />} />
        <Route 
          path="/checkout" 
          element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/orders" 
          element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/loyalty" 
          element={isAuthenticated ? <LoyaltyDashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/addresses" 
          element={isAuthenticated ? <AddressesPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/wishlist" 
          element={isAuthenticated ? <WishlistPage /> : <Navigate to="/login" replace />} 
        />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/deals" element={<ProductsPage />} />
        <Route path="/new-arrivals" element={<ProductsPage />} />
        <Route path="/" element={<HomePage />} />
      </Route>
      
      {/* Admin Routes - Protected */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
        <Route index element={<AdminStats />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm isEdit />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
    
    {/* Global Spin to Win Widget */}
    <SpinToWin isOpen={isSpinToWinOpen} onClose={() => setIsSpinToWinOpen(false)} />
    
    {/* Floating Gift Button */}
    {!isSpinToWinOpen && (
      <button
        onClick={() => setIsSpinToWinOpen(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-pink-500 to-violet-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-40 group animate-bounce"
      >
        <Gift className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Spin & Win!
        </span>
      </button>
    )}
    </>
  );
}

export default App;
