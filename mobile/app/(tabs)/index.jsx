import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import api, { getImageUrl } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

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
        source={{ uri: getImageUrl(item).images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/150' }} 
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

      <View style={styles.categoriesContainer}>
        <TouchableOpacity style={styles.categoryBadge} onPress={() => router.push('/categories')}>
          <Text style={styles.categoryBadgeText}>Shop by Category</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.brandBadge} onPress={() => router.push('/brands')}>
          <Text style={styles.brandBadgeText}>Explore Brands</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bundleBadge} onPress={() => router.push('/bundle-builder')}>
          <Text style={styles.bundleBadgeText}>Build a Bundle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.subscribeBadge} onPress={() => router.push('/subscribe')}>
          <Text style={styles.subscribeBadgeText}>Subscribe & Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.liveBadge} onPress={() => router.push('/live-shopping')}>
          <Text style={styles.liveBadgeText}>Live Shopping 🔴</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBadge} onPress={() => router.push('/shop-the-look')}>
          <Text style={styles.socialBadgeText}>Shop The Look</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quizBadge} onPress={() => router.push('/style-quiz')}>
          <Text style={styles.quizBadgeText}>Style Quiz ✨</Text>
        </TouchableOpacity>
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginTop: 16,
    gap: 12,
  },
  categoryBadge: {
    backgroundColor: '#e0e7ff', // Indigo 100
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  categoryBadgeText: {
    color: '#4f46e5', // Indigo 600
    fontWeight: '600',
  },
  brandBadge: {
    backgroundColor: '#fce7f3', // Pink 100
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  brandBadgeText: {
    color: '#db2777', // Pink 600
    fontWeight: '600',
  },
  bundleBadge: {
    backgroundColor: '#dcfce7', // Green 100
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bundleBadgeText: {
    color: '#16a34a', // Green 600
    fontWeight: '600',
  },
  subscribeBadge: {
    backgroundColor: '#fef3c7', // Amber 100
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  subscribeBadgeText: {
    color: '#d97706', // Amber 600
    fontWeight: '600',
  },
  liveBadge: {
    backgroundColor: '#fee2e2', // Red 100
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  liveBadgeText: {
    color: '#ef4444', // Red 500
    fontWeight: '600',
  },
  socialBadge: {
    backgroundColor: '#f3e8ff', // Purple 100
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  socialBadgeText: {
    color: '#a855f7', // Purple 500
    fontWeight: '600',
  },
  quizBadge: {
    backgroundColor: '#ffedd5', // Orange 100
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  quizBadgeText: {
    color: '#f97316', // Orange 500
    fontWeight: '600',
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
