import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Package, Clock, Pause, Play, XCircle, Loader2 } from 'lucide-react';
import { subscriptionService } from '../services/subscription.service';
import { useToast } from '../contexts/ToastContext';
import { useCurrency } from '../contexts/CurrencyContext';

const SubscriptionsPage = () => {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const { formatPrice } = useCurrency();
  const [updatingId, setUpdatingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: subscriptionService.getSubscriptions
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => subscriptionService.updateSubscriptionStatus(id, status),
    onMutate: (variables) => {
      setUpdatingId(variables.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['subscriptions']);
      success('Subscription Updated', 'Your subscription status has been updated successfully.');
    },
    onError: () => {
      toastError('Update Failed', 'Failed to update subscription status.');
    },
    onSettled: () => {
      setUpdatingId(null);
    }
  });

  const subscriptions = data?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
            <p className="text-gray-600 mt-1">Manage your recurring deliveries and Subscribe & Save boxes.</p>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No active subscriptions</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">You don't have any recurring boxes yet. Subscribe to your favorite essentials and save 15% on every order!</p>
            <a href="/subscribe" className="inline-block bg-green-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-600 transition shadow-md">
              Create a Subscription Box
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map(sub => (
              <div key={sub.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-8">
                
                {/* Info Column */}
                <div className="flex-1 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                          sub.status === 'active' ? 'bg-green-100 text-green-700' :
                          sub.status === 'paused' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {sub.status}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" /> Every {sub.frequency} days
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Subscription #{sub.id.substring(sub.id.length - 6)}</h3>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">Total Value</p>
                      <p className="font-bold text-xl text-gray-900">{formatPrice(sub.totalAmount)}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {sub.items.map(item => (
                      <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <img src={item.image || '/placeholder.jpg'} alt={item.title} className="w-16 h-16 object-cover rounded-lg bg-white shadow-sm" />
                        <div>
                          <p className="font-medium text-sm text-gray-900 line-clamp-2">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity} • {formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Column */}
                <div className="w-full xl:w-80 shrink-0 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Delivery Details</h4>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Next Delivery Date</p>
                        <p className="font-bold text-gray-900 text-lg">
                          {sub.status === 'active' ? new Date(sub.nextDeliveryDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Shipping To</p>
                        <p className="text-gray-900 font-medium">{sub.shippingAddress.fullName}</p>
                        <p className="text-gray-600">{sub.shippingAddress.city}, {sub.shippingAddress.state}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-3">
                    {sub.status === 'active' && (
                      <button 
                        onClick={() => updateMutation.mutate({ id: sub.id, status: 'paused' })}
                        disabled={updatingId === sub.id}
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-orange-100 text-orange-700 font-semibold hover:bg-orange-200 transition text-sm disabled:opacity-50"
                      >
                        {updatingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pause className="w-4 h-4" />}
                        Pause
                      </button>
                    )}
                    {sub.status === 'paused' && (
                      <button 
                        onClick={() => updateMutation.mutate({ id: sub.id, status: 'active' })}
                        disabled={updatingId === sub.id}
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition text-sm disabled:opacity-50"
                      >
                        {updatingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Resume
                      </button>
                    )}
                    
                    {sub.status !== 'cancelled' && (
                      <button 
                        onClick={() => {
                          if(window.confirm('Are you sure you want to cancel this subscription?')) {
                            updateMutation.mutate({ id: sub.id, status: 'cancelled' })
                          }
                        }}
                        disabled={updatingId === sub.id}
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition text-sm disabled:opacity-50"
                      >
                        {updatingId === sub.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                        Cancel
                      </button>
                    )}

                    {sub.status === 'cancelled' && (
                       <div className="col-span-2 text-center text-sm text-gray-500 font-medium py-2">
                         This subscription has been cancelled.
                       </div>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default SubscriptionsPage;
