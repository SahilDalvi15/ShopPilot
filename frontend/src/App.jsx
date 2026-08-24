import { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, getCurrentUser } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';
import Header from './components/Header';
import Footer from './components/Footer';
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const BrandsPage = lazy(() => import('./pages/BrandsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const BundleBuilderPage = lazy(() => import('./pages/BundleBuilderPage'));
const ShopTheLookPage = lazy(() => import('./pages/ShopTheLookPage'));
const StyleQuizPage = lazy(() => import('./pages/StyleQuizPage'));
const LiveShoppingPage = lazy(() => import('./pages/LiveShoppingPage'));
const SubscribeAndSavePage = lazy(() => import('./pages/SubscribeAndSavePage'));
const SocialFeedPage = lazy(() => import('./pages/SocialFeedPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const SharedWishlistPage = lazy(() => import('./pages/SharedWishlistPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AddressesPage = lazy(() => import('./pages/AddressesPage'));
const LoyaltyDashboard = lazy(() => import('./pages/LoyaltyDashboard'));
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminStats = lazy(() => import('./pages/admin/AdminStats'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminProductForm = lazy(() => import('./pages/admin/AdminProductForm'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const VendorOnboarding = lazy(() => import('./pages/VendorOnboarding'));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard'));
const VendorStorePage = lazy(() => import('./pages/VendorStorePage'));
const ComparePage = lazy(() => import('./pages/ComparePage'));
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
      <Suspense fallback={<GlobalLoader />}>
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
            path="/subscriptions" 
            element={isAuthenticated ? <SubscriptionsPage /> : <Navigate to="/login" replace />} 
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
          <Route path="/vendor/register" element={isAuthenticated ? <VendorOnboarding /> : <Navigate to="/login" replace />} />
          <Route path="/vendor/dashboard" element={isAuthenticated ? <VendorDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/store/:slug" element={<VendorStorePage />} />
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
    </Suspense>
    
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
