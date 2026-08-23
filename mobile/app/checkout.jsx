import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Banknote } from 'lucide-react-native';
import api from '../services/api';

export default function CheckoutScreen() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      if (res.data.success) {
        setCart(res.data.data);
      }
    } catch (error) {
      console.log('Error fetching cart', error);
      Alert.alert('Error', 'Could not load checkout data');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!cart || cart.items.length === 0) {
      Alert.alert('Error', 'Cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      // Typically, an order is placed by sending shippingAddress, paymentMethod
      // Since we don't have shipping address in this quick flow, we pass dummy or fetched data
      // For this implementation we'll pass standard mock data to backend `/orders`
      
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          street: '123 Main St',
          city: 'Techville',
          state: 'CA',
          country: 'USA',
          zipCode: '12345',
        },
        paymentMethod: paymentMethod,
        totalAmount: cart.totalPrice,
      };

      const res = await api.post('/orders', orderData);
      
      if (res.data.success) {
        // Clear cart after successful order
        await api.delete('/cart');
        Alert.alert('Success', 'Order placed successfully!');
        router.replace('/(tabs)/profile');
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Payment Failed', error.response?.data?.message || 'Could not process order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        
        <View style={styles.summaryBox}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Items ({cart?.items.length})</Text>
            <Text style={styles.rowValue}>${cart?.totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Shipping</Text>
            <Text style={styles.rowValue}>Free</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${cart?.totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        
        <TouchableOpacity 
          style={[styles.paymentOption, paymentMethod === 'crypto' && styles.paymentOptionActive]} 
          onPress={() => setPaymentMethod('crypto')}
        >
          <Banknote size={24} color={paymentMethod === 'crypto' ? '#6366f1' : '#64748b'} />
          <Text style={[styles.paymentText, paymentMethod === 'crypto' && styles.paymentTextActive]}>
            Crypto Payment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.paymentOption, paymentMethod === 'card' && styles.paymentOptionActive]} 
          onPress={() => setPaymentMethod('card')}
        >
          <CreditCard size={24} color={paymentMethod === 'card' ? '#6366f1' : '#64748b'} />
          <Text style={[styles.paymentText, paymentMethod === 'card' && styles.paymentTextActive]}>
            Credit/Debit Card (Mock)
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.payButton} 
          onPress={placeOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay ${cart?.totalPrice.toFixed(2)}</Text>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  content: {
    padding: 24,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
    marginTop: 8,
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowLabel: {
    color: '#64748b',
    fontSize: 16,
  },
  rowValue: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '500',
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginBottom: 0,
  },
  totalLabel: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#6366f1',
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentOptionActive: {
    borderColor: '#6366f1',
    backgroundColor: '#eff6ff',
  },
  paymentText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  paymentTextActive: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  bottomBar: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  payButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
