import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert, Dimensions, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, MapPin, ArrowLeft, Store, ShoppingCart } from 'lucide-react-native';
import api, { getImageUrl } from '../../services/api';

const { width } = Dimensions.get('window');

export default function VendorStoreScreen() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorData();
  }, [slug]);

  const fetchVendorData = async () => {
    try {
      const res = await api.get(`/vendors/store/${slug}`);
      if (res.data.success) {
        setVendor(res.data.data);
        // In a real app we might fetch products from /products?vendor=id, 
        // but let's assume it might be included or we just fetch general products for demo
        fetchVendorProducts(res.data.data._id);
      }
    } catch (error) {
      console.error('Error fetching vendor store', error);
      Alert.alert('Error', 'Vendor not found.');
      router.back();
    }
  };

  const fetchVendorProducts = async (vendorId) => {
    try {
      const res = await api.get(`/products?limit=10`); // Mocking for now, ideally filter by vendorId
      if (res.data.success) {
        setProducts(res.data.data || res.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push(`/product/${item._id}`)}
    >
      <Image 
        source={{ uri: getImageUrl(item.images?.[0]) }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price?.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!vendor) return null;

  return (
    <View style={styles.container}>
      {/* Dynamic Header */}
      <View style={styles.headerContainer}>
        <ImageBackground 
          source={{ uri: vendor.banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000' }} 
          style={styles.banner}
        >
          <View style={styles.bannerOverlay} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.profileSection}>
          <Image 
            source={{ uri: vendor.logo || 'https://via.placeholder.com/100' }} 
            style={styles.logo} 
          />
          <View style={styles.headerInfo}>
            <Text style={styles.storeName}>{vendor.storeName}</Text>
            <View style={styles.ratingRow}>
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.ratingText}>{vendor.rating?.toFixed(1) || '5.0'}</Text>
              <Text style={styles.reviewsText}>({vendor.reviewCount || 0} reviews)</Text>
            </View>
          </View>
        </View>

        <Text style={styles.description}>{vendor.description}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Positive Feedback</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>24h</Text>
            <Text style={styles.statLabel}>Response Time</Text>
          </View>
        </View>
      </View>

      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>All Products</Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
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
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 24,
  },
  banner: {
    width: '100%',
    height: 180,
    justifyContent: 'flex-start',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    marginTop: 50,
    marginLeft: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -40,
    alignItems: 'flex-end',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
    paddingBottom: 4,
  },
  storeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#475569',
    paddingHorizontal: 20,
    marginTop: 16,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e2e8f0',
  },
  productsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  productImage: {
    width: '100%',
    height: width / 2 - 24,
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6366f1',
  },
});
