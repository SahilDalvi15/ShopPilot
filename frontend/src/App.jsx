import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/slices/authSlice';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AddressesPage from './pages/AddressesPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route 
              path="/cart" 
              element={isAuthenticated ? <CartPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/checkout" 
              element={isAuthenticated ? <CheckoutPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/orders" 
              element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/addresses" 
              element={isAuthenticated ? <AddressesPage /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/wishlist" 
              element={isAuthenticated ? <WishlistPage /> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to="/products" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
