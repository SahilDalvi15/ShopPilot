import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Package, Clock, Play, Pause, XCircle } from 'lucide-react-native';
import api, { getImageUrl } from '../services/api';

export default function SubscriptionsScreen() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await api.get('/subscriptions');
      if (res.data.success) {
        setSubscriptions(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching subscriptions', error);
      Alert.alert('Error', 'Failed to load subscriptions.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSubscriptions();
    setRefreshing(false);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/subscriptions/${id}/status`, { status });
      if (res.data.success) {
        setSubscriptions(subs => subs.map(sub => 
          sub._id === id ? { ...sub, status } : sub
        ));
        Alert.alert('Success', `Subscription ${status} successfully.`);
      }
    } catch (error) {
      console.error('Error updating subscription', error);
      Alert.alert('Error', 'Failed to update subscription status.');
    }
  };

  const confirmCancel = (id) => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel this subscription? You will lose your 15% discount.',
      [
        { text: 'Keep It', style: 'cancel' },
        { text: 'Cancel Delivery', style: 'destructive', onPress: () => handleUpdateStatus(id, 'cancelled') }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const isActive = item.status === 'active';
    const isPaused = item.status === 'paused';
    
    let statusColor = '#ef4444'; // cancelled
    if (isActive) statusColor = '#16a34a';
    if (isPaused) statusColor = '#f97316';

    const nextDelivery = new Date(item.nextDeliveryDate).toLocaleDateString();

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <View style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.subId}>Sub #{item._id.substring(item._id.length - 6)}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.priceValue}>${item.totalAmount?.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.itemsList}>
          {item.items.map((subItem, idx) => (
            <View key={idx} style={styles.productRow}>
              <Image 
                source={{ uri: getImageUrl(subItem.product?.images?.[0]) }} 
                style={styles.productImage} 
              />
              <View style={styles.productDetails}>
                <Text style={styles.productTitle} numberOfLines={2}>{subItem.product?.title || 'Product'}</Text>
                <Text style={styles.productQty}>Qty: {subItem.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.deliveryInfo}>
          <Clock size={16} color="#64748b" />
          <Text style={styles.deliveryText}>Every {item.frequency} days • Next: {nextDelivery}</Text>
        </View>

        {item.status !== 'cancelled' && (
          <View style={styles.actions}>
            {isActive ? (
              <TouchableOpacity 
                style={[styles.actionBtn, styles.pauseBtn]}
                onPress={() => handleUpdateStatus(item._id, 'paused')}
              >
                <Pause size={18} color="#f97316" />
                <Text style={[styles.actionBtnText, { color: '#f97316' }]}>Pause</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.actionBtn, styles.playBtn]}
                onPress={() => handleUpdateStatus(item._id, 'active')}
              >
                <Play size={18} color="#16a34a" />
                <Text style={[styles.actionBtnText, { color: '#16a34a' }]}>Resume</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={() => confirmCancel(item._id)}
            >
              <XCircle size={18} color="#ef4444" />
              <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Calendar size={28} color="#16a34a" />
            </View>
            <View>
              <Text style={styles.title}>My Subscriptions</Text>
              <Text style={styles.subtitle}>Manage your recurring deliveries.</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Package size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No active subscriptions</Text>
            <Text style={styles.emptyText}>You don't have any recurring boxes yet.</Text>
            <TouchableOpacity 
              style={styles.shopBtn}
              onPress={() => router.push('/subscribe')}
            >
              <Text style={styles.shopBtnText}>Browse Subscribe & Save</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  listContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  subId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  itemsList: {
    marginBottom: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  productQty: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  deliveryText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 8,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  pauseBtn: {
    backgroundColor: '#fff7ed',
    borderColor: '#ffedd5',
  },
  playBtn: {
    backgroundColor: '#f0fdf4',
    borderColor: '#dcfce7',
  },
  cancelBtn: {
    backgroundColor: '#fef2f2',
    borderColor: '#fee2e2',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  shopBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
