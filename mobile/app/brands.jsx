import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Award, ArrowRight } from 'lucide-react-native';
import api from '../services/api';

export default function BrandsScreen() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await api.get('/brands');
      if (res.data.success) {
        setBrands(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching brands', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBrand = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/(tabs)/products?brand=${item._id || item.id}`)}
    >
      <Image 
        source={{ uri: item.logo || 'https://via.placeholder.com/150' }} 
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description || 'Explore premium products from ' + item.name}
        </Text>
        <View style={styles.actionRow}>
          <Text style={styles.actionText}>View Brand</Text>
          <ArrowRight size={16} color="#6366f1" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Award size={32} color="#6366f1" style={{ marginRight: 12 }} />
        <Text style={styles.headerTitle}>Featured Brands</Text>
      </View>
      <Text style={styles.headerSubtitle}>
        Discover our curated selection of premium brands and their finest products.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={brands}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderBrand}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 8,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    marginRight: 4,
  },
});
