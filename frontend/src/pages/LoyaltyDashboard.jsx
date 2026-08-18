import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Award, ChevronRight, Gift, TrendingUp, Sparkles, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoyaltyDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  
  const currentPoints = user?.loyaltyPoints || 0;
  const currentTier = user?.loyaltyTier || 'Bronze';

  const TIERS = [
    { name: 'Bronze', min: 0, max: 499, color: 'from-[#cd7f32] to-[#8c5a24]', icon: Star, benefits: ['Earn 1 point per $1 spent', 'Birthday surprise'] },
    { name: 'Silver', min: 500, max: 1999, color: 'from-gray-300 to-gray-500', icon: Zap, benefits: ['1.5x points multiplier', 'Early access to sales', 'Free standard shipping'] },
    { name: 'Gold', min: 2000, max: 4999, color: 'from-yellow-400 to-yellow-600', icon: Award, benefits: ['2x points multiplier', 'Free express shipping', 'Priority customer support', 'Exclusive events'] },
    { name: 'Platinum', min: 5000, max: Infinity, color: 'from-slate-800 to-slate-900', icon: Sparkles, benefits: ['3x points multiplier', 'Personal styling session', 'VIP gifts & experiences', 'Free overnight shipping'] },
  ];

  const currentTierIndex = TIERS.findIndex(t => t.name === currentTier);
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;

  const progress = useMemo(() => {
    if (!nextTier) return 100;
    const currentTierData = TIERS[currentTierIndex];
    const range = nextTier.min - currentTierData.min;
    const currentProgress = currentPoints - currentTierData.min;
    return Math.min(Math.max((currentProgress / range) * 100, 0), 100);
  }, [currentPoints, nextTier, currentTierIndex]);

  const pointsToNext = nextTier ? nextTier.min - currentPoints : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            ShopPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Rewards</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Earn points with every purchase and unlock exclusive perks, early access, and VIP experiences.
          </p>
        </div>

        {/* Dashboard Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
          <div className={`h-32 bg-gradient-to-r ${TIERS[currentTierIndex].color} absolute top-0 left-0 right-0 opacity-20`}></div>
          <div className="relative p-8 md:p-12 z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 space-y-2 text-center md:text-left">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Your Status</p>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h2 className="text-5xl font-bold text-slate-900">{currentTier}</h2>
                {React.createElement(TIERS[currentTierIndex].icon, { className: "w-10 h-10 text-slate-800" })}
              </div>
              <p className="text-2xl font-medium text-slate-700 mt-2">
                {currentPoints.toLocaleString()} <span className="text-slate-500 text-lg">pts</span>
              </p>
            </div>
            
            {/* Progress Section */}
            <div className="flex-1 w-full bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {nextTier ? (
                <>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Next Tier: {nextTier.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{pointsToNext.toLocaleString()} points away</p>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{nextTier.min.toLocaleString()} pts</span>
                  </div>
                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${TIERS[currentTierIndex].color} transition-all duration-1000 ease-out`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <Sparkles className="w-8 h-8 text-slate-800 mx-auto mb-2" />
                  <p className="text-lg font-bold text-slate-900">You've reached the highest tier!</p>
                  <p className="text-sm text-slate-500">Enjoy your Platinum benefits.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">Tier Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TIERS.map((tier, idx) => {
              const isCurrent = tier.name === currentTier;
              const isLocked = currentTierIndex < idx;
              
              return (
                <div 
                  key={tier.name} 
                  className={`relative p-6 rounded-3xl border transition-all duration-300 ${isCurrent ? 'bg-white shadow-xl border-slate-200 scale-105 z-10' : 'bg-slate-50/50 border-slate-100'}`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 inset-x-0 flex justify-center">
                      <span className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Current Tier</span>
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6 shadow-lg ${isLocked ? 'opacity-50' : ''}`}>
                    {React.createElement(tier.icon, { className: "w-6 h-6 text-white" })}
                  </div>
                  <h4 className={`text-xl font-bold mb-2 ${isLocked ? 'text-slate-500' : 'text-slate-900'}`}>{tier.name}</h4>
                  <p className="text-sm font-medium text-slate-500 mb-6">
                    {tier.min.toLocaleString()} {tier.max !== Infinity ? `- ${tier.max.toLocaleString()} pts` : '+ pts'}
                  </p>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className={`flex items-start gap-2 text-sm ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>
                        <div className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-slate-300' : 'bg-purple-500'}`} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ways to Earn / Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Ways to Earn</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Gift className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">Make a purchase</span>
                </div>
                <span className="font-bold text-slate-900">1 pt / $1</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">Leave a review</span>
                </div>
                <span className="font-bold text-slate-900">50 pts</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-slate-400" />
                  <span className="font-medium text-slate-700">Birthday bonus</span>
                </div>
                <span className="font-bold text-slate-900">500 pts</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden">
             <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
             <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50"></div>
             
             <div className="z-10 relative">
               <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to redeem?</h3>
               <p className="text-slate-600 mb-8 max-w-sm mx-auto">Explore exclusive rewards and apply your points at checkout for huge discounts.</p>
               <Link to="/products" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg">
                 Start Shopping <ChevronRight className="w-5 h-5" />
               </Link>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDashboard;
