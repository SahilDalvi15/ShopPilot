import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShoppingCart, Heart, ArrowRightLeft } from 'lucide-react-native';
import api from '../../services/api';
import { CompareContext } from '../../context/CompareContext';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCompare } = useContext(CompareContext);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching product details', error);
      Alert.alert('Error', 'Could not load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    Alert.alert('Success', 'Added to cart!');
  };

  const handleCompare = () => {
    const res = addToCompare(product);
    if (res.success) {
      Alert.alert('Added to Compare', res.message, [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Compare', onPress: () => router.push('/compare') }
      ]);
    } else {
      Alert.alert('Notice', res.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCompare}>
            <ArrowRightLeft size={24} color="#0f172a" style={{marginRight: 12}} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Heart size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image 
          source={{ uri: product.images && product.images[0] ? product.images[0].url : 'https://via.placeholder.com/400' }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
          
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.addToCartButton, product.stock === 0 && styles.disabledButton]} 
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 350,
  },
  detailsContainer: {
    padding: 24,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: '700',
    color: '#6366f1',
    marginBottom: 16,
  },
  stockBadge: {
    backgroundColor: '#dcfce7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  stockText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  bottomBar: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  addToCartButton: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
