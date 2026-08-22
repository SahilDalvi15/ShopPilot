import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Loader2, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../services/api';
import { useToast } from '../contexts/ToastContext';

const CryptoPaymentModal = ({ isOpen, onClose, amountINR, onSuccess }) => {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin'); // 'bitcoin' or 'ethereum'
  const [rates, setRates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [txHash, setTxHash] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { error: toastError, success: toastSuccess } = useToast();

  // Mock addresses for demo purposes
  const walletAddresses = {
    bitcoin: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    ethereum: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
  };

  useEffect(() => {
    if (isOpen) {
      fetchRates();
      setTxHash('');
      setIsCopied(false);
    }
  }, [isOpen]);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/crypto/rates');
      if (response.data.success) {
        setRates(response.data.data);
      } else {
        throw new Error('Failed to fetch rates');
      }
    } catch (err) {
      toastError('Pricing Error', 'Could not fetch live crypto rates. Using fallback rates.');
      // Provide fallback rates if API fails
      setRates({
        bitcoin: { inr: 5000000 },
        ethereum: { inr: 250000 }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCryptoAmount = () => {
    if (!rates) return 0;
    const rate = rates[selectedCoin].inr;
    return (amountINR / rate).toFixed(selectedCoin === 'bitcoin' ? 6 : 4);
  };

  const getPaymentURI = () => {
    const amount = getCryptoAmount();
    const address = walletAddresses[selectedCoin];
    if (selectedCoin === 'bitcoin') {
      return `bitcoin:${address}?amount=${amount}`;
    }
    return `ethereum:${address}?value=${amount}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddresses[selectedCoin]);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (!txHash.trim()) {
      toastError('Required', 'Please enter a transaction hash.');
      return;
    }
    
    // Simulate verifying the transaction
    onSuccess({
      currency: selectedCoin === 'bitcoin' ? 'BTC' : 'ETH',
      amount: getCryptoAmount(),
      walletAddress: walletAddresses[selectedCoin],
      transactionHash: txHash
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-4 right-4">
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Crypto Checkout</h2>
            <p className="text-gray-500 mt-2">Pay securely with digital assets.</p>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
              <p className="text-gray-500 animate-pulse">Fetching live prices...</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Coin Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedCoin('bitcoin')}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    selectedCoin === 'bitcoin' 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-orange-300 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center font-bold text-xl mb-2">₿</div>
                  <span className={`font-semibold ${selectedCoin === 'bitcoin' ? 'text-orange-700' : 'text-gray-700'}`}>Bitcoin</span>
                </button>
                <button
                  onClick={() => setSelectedCoin('ethereum')}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    selectedCoin === 'ethereum' 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300 bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center font-bold text-xl mb-2">Ξ</div>
                  <span className={`font-semibold ${selectedCoin === 'ethereum' ? 'text-indigo-700' : 'text-gray-700'}`}>Ethereum</span>
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Send exactly</p>
                <p className="text-3xl font-bold text-gray-900 mb-6 font-mono tracking-tight">
                  {getCryptoAmount()} {selectedCoin === 'bitcoin' ? 'BTC' : 'ETH'}
                </p>
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4 inline-block">
                  <QRCodeSVG value={getPaymentURI()} size={160} level="H" includeMargin={true} />
                </div>
                
                <p className="text-xs text-gray-400 mt-2 mb-4 text-center">Scan with your favorite wallet app</p>

                <div className="w-full">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">Destination Address</label>
                  <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <input 
                      type="text" 
                      readOnly 
                      value={walletAddresses[selectedCoin]}
                      className="w-full px-3 py-2 text-sm text-gray-700 font-mono outline-none bg-transparent"
                    />
                    <button 
                      onClick={handleCopy}
                      className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors border-l border-gray-200 flex items-center justify-center"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction Input */}
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Hash (TXID)
                </label>
                <input
                  type="text"
                  placeholder="Paste transaction ID after sending..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-600 outline-none transition-all font-mono text-sm"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
              </div>

              <button
                onClick={handleConfirm}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors flex items-center justify-center space-x-2"
              >
                <span>Confirm Payment</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CryptoPaymentModal;
