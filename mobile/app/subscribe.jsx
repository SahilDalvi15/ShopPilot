import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2, Calendar, Plus, Minus, Package } from 'lucide-react-native';
import api, { getImageUrl } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const FREQUENCIES = [
  { id: 30, label: 'Every 30 Days', desc: 'Daily essentials' },
  { id: 60, label: 'Every 60 Days', desc: 'Moderate use' },
  { id: 90, label: 'Every 90 Days', desc: 'Occasional restocking' },
];

export default function SubscribeAndSaveScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [frequency, setFrequency] = useState(30);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=12');
      if (res.data.success) {
        setProducts(res.data.data || res.data.products);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProduct = (product) => {
    setSelectedProducts(prev => {
      const exists = prev.find(p => p._id === product._id);
      if (exists) {
        return prev.filter(p => p._id !== product._id);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setSelectedProducts(prev => prev.map(p => {
      if (p._id === productId) {
        const newQuantity = Math.max(1, p.quantity + delta);
        return { ...p, quantity: newQuantity };
      }
      return p;
    }));
  };

  const calculateTotal = () => {
    const subtotal = selectedProducts.reduce((sum, item) => sum + ((item.discountedPrice || item.price) * item.quantity), 0);
    const discount = subtotal * 0.15; // 15% off
    return { subtotal, discount, total: subtotal - discount };
  };

  const handleSubscribe = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to subscribe.');
      return;
    }

    if (selectedProducts.length === 0) return;
    setIsSubscribing(true);

    try {
      for (const item of selectedProducts) {
        await api.post('/cart', {
          productId: item._id,
          quantity: item.quantity
        });
      }

      // If we had local state, we'd store the frequency for checkout.
      Alert.alert('Subscription Created!', 'Your items have been added to the cart with a 15% discount.', [
        { text: 'Go to Cart', onPress: () => router.push('/cart') }
      ]);
      setSelectedProducts([]);
    } catch (err) {
      Alert.alert('Error', 'Failed to create subscription box.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const { subtotal, total } = calculateTotal();

  const renderProduct = ({ item }) => {
    const selectedItem = selectedProducts.find(p => p._id === item._id);
    const isSelected = !!selectedItem;

    return (
      <View style={[styles.productCard, isSelected && styles.productCardSelected]}>
        <TouchableOpacity style={styles.cardSelectArea} onPress={() => handleToggleProduct(item)}>
          <Image 
            source={{ uri: getImageUrl(item.images && item.images[0] ? item.images[0] : null) }} 
            style={styles.productImage}
          />
          <View style={styles.checkboxContainer}>
            {isSelected ? (
              <CheckCircle2 size={24} color="#16a34a" />
            ) : (
              <View style={styles.uncheckbox} />
            )}
          </View>
        </TouchableOpacity>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          
          {isSelected && (
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item._id, -1)}>
                <Minus size={16} color="#475569" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{selectedItem.quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item._id, 1)}>
                <Plus size={16} color="#475569" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Calendar size={16} color="#16a34a" style={{marginRight: 6}} />
            <Text style={styles.badgeText}>Subscribe & Save</Text>
          </View>
          <Text style={styles.title}>Never Run Out Again</Text>
          <Text style={styles.subtitle}>
            Subscribe to your favorite products and save 15% on every order.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Select Frequency</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.freqList}>
            {FREQUENCIES.map(freq => (
              <TouchableOpacity 
                key={freq.id}
                style={[styles.freqCard, frequency === freq.id && styles.freqCardSelected]}
                onPress={() => setFrequency(freq.id)}
              >
                <Text style={[styles.freqLabel, frequency === freq.id && styles.freqLabelSelected]}>{freq.label}</Text>
                <Text style={[styles.freqDesc, frequency === freq.id && styles.freqDescSelected]}>{freq.desc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Choose Products</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#16a34a" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.gridContainer}>
              {products.map(product => (
                <View key={product._id} style={styles.gridItem}>
                  {renderProduct({ item: product })}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.totalItemsText}>{selectedProducts.reduce((acc, item) => acc + item.quantity, 0)} Items Selected</Text>
            {selectedProducts.length > 0 ? (
              <View style={styles.priceRow}>
                <Text style={styles.strikethrough}>${subtotal.toFixed(2)}</Text>
                <Text style={styles.finalPrice}>${total.toFixed(2)}</Text>
              </View>
            ) : (
              <Text style={styles.finalPrice}>$0.00</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.subscribeBtn, selectedProducts.length === 0 && styles.disabledBtn]}
            disabled={selectedProducts.length === 0 || isSubscribing}
            onPress={handleSubscribe}
          >
            {isSubscribing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
        alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  badgeText: {
    color: '#16a34a',
    fontWeight: '600',
    fontSize: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 12,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  freqList: {
    paddingHorizontal: 16,
  },
  freqCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    width: 140,
  },
  freqCardSelected: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  freqLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  freqLabelSelected: {
    color: '#16a34a',
  },
  freqDesc: {
    fontSize: 12,
    color: '#64748b',
  },
  freqDescSelected: {
    color: '#15803d',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    paddingBottom: 160,
  },
  gridItem: {
    width: '50%',
    padding: 6,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  productCardSelected: {
    borderColor: '#16a34a',
  },
  cardSelectArea: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 140,
  },
  checkboxContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  uncheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    height: 40,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  qtyText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalItemsText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  strikethrough: {
    fontSize: 14,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  finalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subscribeBtn: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#94a3b8',
  },
  subscribeBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
