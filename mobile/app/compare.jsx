import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trash2, ShoppingCart, Info } from 'lucide-react-native';
import { CompareContext } from '../context/CompareContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function CompareScreen() {
  const { compareItems, removeFromCompare, clearCompare } = useContext(CompareContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const handleAddToCart = async (productId) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to add items to your cart.');
      return;
    }

    try {
      const res = await api.post('/cart', { productId, quantity: 1 });
      if (res.data.success) {
        Alert.alert('Success', 'Item added to cart');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  if (compareItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compare Products</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContent}>
          <Info size={64} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyTitle}>Nothing to compare</Text>
          <Text style={styles.emptyText}>Add some products to see them side-by-side.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/(tabs)/products')}>
            <Text style={styles.primaryButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Extract all unique specification keys
  const allSpecKeys = Array.from(new Set(
    compareItems.reduce((acc, item) => {
      if (item.specifications) {
        return [...acc, ...Object.keys(item.specifications)];
      }
      return acc;
    }, [])
  ));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compare Products</Text>
        <TouchableOpacity onPress={clearCompare} style={styles.clearButton}>
          <Trash2 size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.row}>
            <View style={[styles.cell, styles.headerCell]}>
              <Text style={styles.featureTitle}>Features</Text>
            </View>
            {compareItems.map(item => (
              <View key={item._id} style={[styles.cell, styles.productCell]}>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeFromCompare(item._id)}
                >
                  <Trash2 size={16} color="#64748b" />
                </TouchableOpacity>
                <Image 
                  source={{ uri: item.images && item.images[0] ? item.images[0].url : 'https://via.placeholder.com/150' }} 
                  style={styles.productImage}
                  resizeMode="contain"
                />
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity 
                  style={styles.addToCartButton}
                  onPress={() => handleAddToCart(item._id)}
                >
                  <ShoppingCart size={16} color="#fff" style={{marginRight: 8}} />
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Description Row */}
          <View style={styles.row}>
            <View style={[styles.cell, styles.headerCell]}>
              <Text style={styles.rowLabel}>Description</Text>
            </View>
            {compareItems.map(item => (
              <View key={`desc-${item._id}`} style={styles.cell}>
                <Text style={styles.cellText} numberOfLines={4}>{item.description}</Text>
              </View>
            ))}
          </View>

          {/* Dynamic Spec Rows */}
          {allSpecKeys.map(key => (
            <View key={key} style={styles.row}>
              <View style={[styles.cell, styles.headerCell]}>
                <Text style={styles.rowLabel}>{key}</Text>
              </View>
              {compareItems.map(item => (
                <View key={`${key}-${item._id}`} style={styles.cell}>
                  <Text style={styles.cellText}>
                    {item.specifications && item.specifications[key] ? item.specifications[key] : '-'}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  clearButton: {
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    marginRight: -8,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  table: {
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  cell: {
    width: 200,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
    justifyContent: 'center',
  },
  headerCell: {
    width: 120,
    backgroundColor: '#f8fafc',
  },
  productCell: {
    alignItems: 'center',
    paddingTop: 32, // space for remove button
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 12,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  cellText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
});
