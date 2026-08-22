import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react-native';
import api from '../../services/api';

export default function CartScreen() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching cart', error.response?.status);
      if (error.response?.status === 401) {
        // User not logged in, ignore or redirect
        setCart(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCart();
    setRefreshing(false);
  };

  const updateQuantity = async (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;

    try {
      const res = await api.put(`/cart/items/${productId}`, { quantity: newQuantity });
      if (res.data.success) setCart(res.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await api.delete(`/cart/items/${productId}`);
      if (res.data.success) setCart(res.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const renderItem = ({ item }) => {
    const product = item.product;
    return (
      <View style={styles.cartItem}>
        <Image 
          source={{ uri: product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/80' }} 
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => updateQuantity(product._id, item.quantity, -1)} style={styles.qtyButton}>
              <Minus size={16} color="#475569" />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => updateQuantity(product._id, item.quantity, 1)} style={styles.qtyButton}>
              <Plus size={16} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => removeItem(product._id)} style={styles.removeButton}>
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View style={styles.centered}>
        <ShoppingCart size={64} color="#cbd5e1" style={{ marginBottom: 16 }} />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(tabs)/products')}>
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.product._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />
        }
      />
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${cart.totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    backgroundColor: '#f1f5f9',
    padding: 6,
    borderRadius: 4,
  },
  qtyText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  removeButton: {
    padding: 8,
  },
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  checkoutButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
