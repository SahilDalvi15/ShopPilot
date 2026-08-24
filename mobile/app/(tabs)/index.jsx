import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, RefreshControl, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import api, { getImageUrl } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { LayoutGrid, Tag, Package, Clock, PlayCircle, Smartphone, Sparkles, Wand2 } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=5');
      if (res.data.success) {
        setProducts(res.data.data || res.data.products || []);
      }
    } catch (error) {
      console.error('Error fetching home products', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push(`/product/${item._id}`)}
    >
      <Image 
        source={{ uri: getImageUrl(item.images && item.images[0] ? item.images[0] : null) }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.firstName || 'Guest'} 👋</Text>
        <Text style={styles.subtitle}>Find your favorite products today</Text>
      </View>

      <View style={styles.quickLinksContainer}>
        <View style={styles.quickLinksGrid}>
          <TouchableOpacity style={styles.quickLinkItem} onPress={() => router.push('/categories')}>
            <View style={[styles.iconCircle, { backgroundColor: '#e0e7ff' }]}>
              <LayoutGrid color="#4f46e5" size={24} />
            </View>
            <Text style={styles.quickLinkText}>Categories</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinkItem} onPress={() => router.push('/brands')}>
            <View style={[styles.iconCircle, { backgroundColor: '#fce7f3' }]}>
              <Tag color="#db2777" size={24} />
            </View>
            <Text style={styles.quickLinkText}>Brands</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinkItem} onPress={() => router.push('/bundle-builder')}>
            <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}>
              <Package color="#16a34a" size={24} />
            </View>
            <Text style={styles.quickLinkText}>Bundles</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinkItem} onPress={() => router.push('/subscribe')}>
            <View style={[styles.iconCircle, { backgroundColor: '#fef3c7' }]}>
              <Clock color="#d97706" size={24} />
            </View>
            <Text style={styles.quickLinkText}>Subscribe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinkItem} onPress={() => router.push('/live-shopping')}>
            <View style={[styles.iconCircle, { backgroundColor: '#fee2e2' }]}>
              <PlayCircle color="#ef4444" size={24} />
            </View>
            <Text style={styles.quickLinkText}>Live</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinkItem} onPress={() => router.push('/social-feed')}>
            <View style={[styles.iconCircle, { backgroundColor: '#0f172a' }]}>
              <Smartphone color="#fff" size={24} />
            </View>
            <Text style={styles.quickLinkText}>Social Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinkItem} onPress={() => router.push('/shop-the-look')}>
            <View style={[styles.iconCircle, { backgroundColor: '#f3e8ff' }]}>
              <Sparkles color="#a855f7" size={24} />
            </View>
            <Text style={styles.quickLinkText}>The Look</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLinkItem} onPress={() => router.push('/style-quiz')}>
            <View style={[styles.iconCircle, { backgroundColor: '#ffedd5' }]}>
              <Wand2 color="#f97316" size={24} />
            </View>
            <Text style={styles.quickLinkText}>Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderProduct}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />
            }
          />
        )}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  quickLinksContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  quickLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickLinkItem: {
    width: (width - 40 - 48) / 4, // 4 items per row, 3 gaps of 16
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quickLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  section: {
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  seeAll: {
    color: '#6366f1',
    fontWeight: '600',
  },
  productList: {
    paddingHorizontal: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 8,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
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
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});
