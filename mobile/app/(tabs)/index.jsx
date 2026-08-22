import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Fetch some featured products or latest products
      const res = await api.get('/products?limit=5');
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching home products', error);
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
        source={{ uri: item.images && item.images[0] ? item.images[0].url : 'https://via.placeholder.com/150' }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
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
  section: {
    paddingTop: 24,
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
