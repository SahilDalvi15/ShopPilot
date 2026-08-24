import React, { useState, useEffect, useMemo, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { PackagePlus, Plus, Minus, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import api, { getImageUrl } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const BUNDLE_TIERS = [
  { minItems: 2, discountPercent: 10, code: 'BUNDLE10' },
  { minItems: 3, discountPercent: 15, code: 'BUNDLE15' },
  { minItems: 4, discountPercent: 25, code: 'BUNDLE25' },
];

export default function BundleBuilderScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bundleItems, setBundleItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
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
      console.error('Error fetching bundle products', error);
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (product) => {
    setBundleItems((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveItem = (productId) => {
    setBundleItems((prev) => {
      const existing = prev.find((item) => item.product._id === productId);
      if (existing.quantity > 1) {
        return prev.map((item) =>
          item.product._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.product._id !== productId);
    });
  };

  const totalItems = bundleItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = bundleItems.reduce((acc, item) => acc + (item.product.discountedPrice || item.product.price) * item.quantity, 0);

  const currentTier = useMemo(() => {
    return [...BUNDLE_TIERS].reverse().find(tier => totalItems >= tier.minItems) || { discountPercent: 0, code: null };
  }, [totalItems]);

  const nextTier = useMemo(() => {
    return BUNDLE_TIERS.find(tier => totalItems < tier.minItems);
  }, [totalItems]);

  const discountAmount = (subtotal * currentTier.discountPercent) / 100;
  const finalPrice = subtotal - discountAmount;

  const handleAddBundleToCart = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to add this bundle to your cart.');
      return;
    }

    setIsAdding(true);
    try {
      // Add all items to cart sequentially
      for (const item of bundleItems) {
        await api.post('/cart', {
          productId: item.product._id,
          quantity: item.quantity
        });
      }

      // If we had a coupon API, we'd apply it here
      Alert.alert(
        'Bundle Added!', 
        currentTier.discountPercent > 0 
          ? `You unlocked ${currentTier.discountPercent}% off! Use code ${currentTier.code} at checkout.` 
          : 'Items added to your cart.',
        [{ text: 'Go to Cart', onPress: () => router.push('/cart') }]
      );
      setBundleItems([]);
    } catch (err) {
      Alert.alert('Error', 'Failed to add bundle to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  const getQuantity = (productId) => {
    const item = bundleItems.find(i => i.product._id === productId);
    return item ? item.quantity : 0;
  };

  const renderProduct = ({ item }) => {
    const quantity = getQuantity(item._id);
    return (
      <View style={styles.productCard}>
        <Image 
          source={{ uri: getImageUrl(item.images && item.images[0] ? item.images[0] : null) }} 
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          
          <View style={styles.quantityControls}>
            {quantity > 0 ? (
              <>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => handleRemoveItem(item._id)}>
                  <Minus size={16} color="#475569" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => handleAddItem(item)}>
                  <Plus size={16} color="#475569" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={() => handleAddItem(item)}>
                <Text style={styles.addButtonText}>Add to Bundle</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.badge}>
            <PackagePlus size={16} color="#6366f1" style={{marginRight: 6}} />
            <Text style={styles.badgeText}>Build Your Own Bundle</Text>
          </View>
          <Text style={styles.title}>Mix, Match & Save More</Text>
          <Text style={styles.subtitle}>
            Select 2 or more products to unlock automatic discounts. The more you bundle, the more you save!
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.gridContainer}>
            {products.map(product => (
              <View key={product._id} style={styles.gridItem}>
                {renderProduct({ item: product })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {nextTier 
              ? `Add ${nextTier.minItems - totalItems} more item${nextTier.minItems - totalItems > 1 ? 's' : ''} to get ${nextTier.discountPercent}% off!` 
              : 'You have unlocked the maximum discount! 🎉'
            }
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View>
            <Text style={styles.totalItemsText}>{totalItems} Items Selected</Text>
            {currentTier.discountPercent > 0 ? (
              <View style={styles.priceRow}>
                <Text style={styles.strikethrough}>${subtotal.toFixed(2)}</Text>
                <Text style={styles.finalPrice}>${finalPrice.toFixed(2)}</Text>
              </View>
            ) : (
              <Text style={styles.finalPrice}>${subtotal.toFixed(2)}</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.addBundleBtn, totalItems === 0 && styles.disabledBtn]}
            disabled={totalItems === 0 || isAdding}
            onPress={handleAddBundleToCart}
          >
            {isAdding ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addBundleBtnText}>Add to Cart</Text>
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
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  badgeText: {
    color: '#4f46e5',
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
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 140,
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
    color: '#6366f1',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  addButtonText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
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
    paddingBottom: 40, // For home indicator
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  progressSection: {
    marginBottom: 16,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6366f1',
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
  addBundleBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#94a3b8',
  },
  addBundleBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
