import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi there! I'm your ShopPilot AI assistant. Looking for something specific?",
      products: []
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setMessage('');
    setIsLoading(true);
    
    try {
      const response = await api.post('/ai/chat', { message: userMessage });
      const { replyText, recommendedProducts } = response.data;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: replyText || "I'm not sure how to answer that.",
        products: recommendedProducts || []
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        products: []
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-50 group flex items-center gap-2 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Sparkles className="w-6 h-6 relative z-10 animate-pulse" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl z-50 flex flex-col border border-slate-100 overflow-hidden transform transition-all duration-300">
      
      {/* Header */}
      <div className="bg-slate-900 p-4 flex items-center justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Personal Shopper</h3>
            <p className="text-xs text-slate-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="relative z-10 text-slate-300 hover:text-white p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-br-sm' 
                  : 'bg-white border border-slate-100 shadow-sm text-slate-700 rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
            
            {/* Render recommended products if any */}
            {msg.products && msg.products.length > 0 && (
              <div className="mt-2 w-[85%] space-y-2">
                {msg.products.map(product => (
                  <Link 
                    key={product._id} 
                    to={`/products/${product.slug}`}
                    className="flex gap-3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 flex-shrink-0">
                      <img src={product.images[0]?.url} alt={product.title} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-xs font-semibold text-slate-900 truncate group-hover:text-purple-600 transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-xs font-bold text-slate-700 mt-1">
                        ${product.discountedPrice || product.price}
                      </p>
                    </div>
                    <div className="flex items-center text-slate-400 group-hover:text-purple-500 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] p-3 bg-white border border-slate-100 shadow-sm text-slate-700 rounded-2xl rounded-bl-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex gap-2 relative">
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-slate-50 border border-slate-200 text-sm rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          />
          <button 
            type="submit"
            disabled={!message.trim()}
            className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors"
          >
            <Send className="w-4 h-4 ml-1" />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" /> AI-generated recommendations
        </p>
      </div>
    </div>
  );
};

export default AIChatbot;
