import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Trash2, ShoppingCart, Heart } from 'lucide-react-native';
import api, { getImageUrl } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import LoginRequiredView from '../../components/LoginRequiredView';

export default function WishlistScreen() {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchWishlist();
      } else {
        setLoading(false);
      }
    }, [user])
  );

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      if (res.data.success) {
        setWishlist(res.data.data.products || []);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.log('Error fetching wishlist', error.response?.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWishlist();
    setRefreshing(false);
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(`/wishlist/${productId}`);
      if (res.data.success) {
        setWishlist(res.data.data.products || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from wishlist');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/product/${item._id}`)}>
      <Image 
        source={{ uri: getImageUrl(item.images && item.images[0] ? item.images[0] : null) }} 
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromWishlist(item._id)}>
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (!user) {
    return <LoginRequiredView message="Please log in to view your wishlist." />;
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.centered}>
        <Heart size={64} color="#cbd5e1" style={{ marginBottom: 16 }} />
        <Text style={styles.emptyText}>Your wishlist is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  removeBtn: {
    padding: 8,
  },
});
