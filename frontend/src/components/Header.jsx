import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
} from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import { selectCartCount } from '../store/slices/cartSlice';
import { selectWishlistCount } from '../store/slices/wishlistSlice';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>Free shipping on orders over ₹999</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/products" className="hover:text-gray-300 transition">
              Shop
            </Link>
            <Link to="/orders" className="hover:text-gray-300 transition">
              Track Order
            </Link>
            <a href="#" className="hover:text-gray-300 transition">
              Support
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">ShopPilot</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 bg-purple-600 text-white px-4 py-1 rounded-md hover:bg-purple-700 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <Heart className="h-6 w-6 text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition">
                {isAuthenticated ? (
                  <>
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <User className="h-5 w-5 text-gray-700" />
                  </>
                ) : (
                  <User className="h-6 w-6 text-gray-700" />
                )}
              </button>

              {/* Dropdown Menu */}
              {isAuthenticated && (
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                  <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 transition">
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100 transition">
                      My Orders
                    </Link>
                    <Link to="/addresses" className="block px-4 py-2 hover:bg-gray-100 transition">
                      Addresses
                    </Link>
                    {['admin', 'super_admin'].includes(user?.role) && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 transition text-purple-600 font-medium flex items-center space-x-2">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}

              {!isAuthenticated && (
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                  <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 transition">
                      Login
                    </Link>
                    <Link to="/register" className="block px-4 py-2 hover:bg-gray-100 transition">
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            <nav className="flex flex-col space-y-2">
              <Link
                to="/products"
                className="px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/categories"
                className="px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/wishlist"
                className="px-4 py-2 hover:bg-gray-100 rounded-lg transition flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="px-4 py-2 hover:bg-gray-100 rounded-lg transition flex items-center justify-between"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <hr className="my-2" />
                  <Link
                    to="/profile"
                    className="px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/addresses"
                    className="px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Addresses
                  </Link>
                  {['admin', 'super_admin'].includes(user?.role) && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 hover:bg-gray-100 rounded-lg transition text-purple-600 font-medium flex items-center space-x-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg transition flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-2" />
                  <Link
                    to="/login"
                    className="px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 hover:bg-gray-100 rounded-lg transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Navigation Links - Desktop */}
      <nav className="hidden md:block border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 py-3">
            <Link
              to="/products"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              All Products
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Categories
            </Link>
            <Link
              to="/brands"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Brands
            </Link>
            <Link
              to="/deals"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Deals
            </Link>
            <Link
              to="/new-arrivals"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
