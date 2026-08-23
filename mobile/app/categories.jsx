import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Box, ArrowRight } from 'lucide-react-native';
import api from '../services/api';

const categoryImages = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
  'home-kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
  'sports-fitness': 'https://images.unsplash.com/photo-1461896836934-bd45ba9fe922?w=400&q=80',
  audio: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
  wearables: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
  accessories: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&q=80',
};

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/(tabs)/products?category=${item._id || item.id}`)}
    >
      <Image 
        source={{ uri: categoryImages[item.slug] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80' }} 
        style={styles.image}
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.actionRow}>
          <Text style={styles.actionText}>Browse Products</Text>
          <ArrowRight size={16} color="#c084fc" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Box size={32} color="#7c3aed" style={{ marginRight: 12 }} />
        <Text style={styles.headerTitle}>Shop by Category</Text>
      </View>
      <Text style={styles.headerSubtitle}>
        Explore our wide range of products across various categories.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#7c3aed" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id || item.id}
          renderItem={renderCategory}
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
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c084fc', // purple-400
    marginRight: 6,
  },
});
