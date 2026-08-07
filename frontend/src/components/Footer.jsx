import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="bg-purple-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white text-xl font-bold mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-purple-100">
                Get updates on new arrivals and exclusive offers
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-2 rounded-l-lg focus:outline-none"
              />
              <button className="bg-gray-900 text-white px-6 py-2 rounded-r-lg hover:bg-gray-800 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-white">ShopPilot</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop destination for all your shopping needs. Quality products,
              great prices, and excellent service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-purple-500 transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-purple-500 transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-purple-500 transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="hover:text-purple-500 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-purple-500 transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-purple-500 transition">
                  Brands
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-purple-500 transition">
                  Deals & Offers
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-purple-500 transition">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="hover:text-purple-500 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-purple-500 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-purple-500 transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-purple-500 transition">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-purple-500 transition">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-purple-500 mt-0.5" />
                <span>
                  123 Shopping Street,
                  <br />
                  Commercial Area, City - 400001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-purple-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-500" />
                <span>support@shoppilot.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white font-semibold mb-2">Payment Methods</h4>
              <div className="flex space-x-4">
                <div className="bg-white rounded px-3 py-1 text-gray-800 text-sm font-bold">
                  VISA
                </div>
                <div className="bg-white rounded px-3 py-1 text-gray-800 text-sm font-bold">
                  MasterCard
                </div>
                <div className="bg-white rounded px-3 py-1 text-gray-800 text-sm font-bold">
                  Razorpay
                </div>
                <div className="bg-white rounded px-3 py-1 text-gray-800 text-sm font-bold">
                  UPI
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Secured by</span>
              <div className="bg-green-600 rounded px-3 py-1 text-white text-sm font-bold">
                SSL
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 ShopPilot. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="hover:text-purple-500 transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-purple-500 transition">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-purple-500 transition">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Made with Love */}
      <div className="bg-gray-950 py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm flex items-center justify-center space-x-2">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by ShopPilot Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
