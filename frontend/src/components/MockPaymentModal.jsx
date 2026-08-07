import { useState, useEffect } from 'react';
import { CreditCard, X, ShieldCheck, Loader2 } from 'lucide-react';

const MockPaymentModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setCardNumber('');
      setExpiry('');
      setCvv('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate network request
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  const handleCardNumberChange = (e) => {
    // Format as 0000 0000 0000 0000
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    // Format as MM/YY
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 sm:p-0">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute -right-4 -top-10 opacity-20">
            <CreditCard size={120} />
          </div>
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              Secure Checkout
            </h3>
            <p className="text-indigo-200 mt-1 text-sm">Powered by MockGateway</p>
          </div>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="text-indigo-200 hover:text-white transition z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
            <span className="text-gray-600 font-medium">Amount to Pay</span>
            <span className="text-2xl font-bold text-gray-900">₹{amount?.toLocaleString()}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    disabled={isProcessing}
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 font-mono tracking-widest text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isProcessing}
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 text-center font-mono tracking-wider text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    required
                    disabled={isProcessing}
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="•••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 text-center font-mono tracking-widest text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  required
                  disabled={isProcessing}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-500 text-sm"
                />
              </div>

            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isProcessing || cardNumber.length < 19 || expiry.length < 5 || cvv.length < 3}
                className="w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${amount?.toLocaleString()}`
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4 flex justify-center items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            Your payment info is safely mocked for this demo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockPaymentModal;
