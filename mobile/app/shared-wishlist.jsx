import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, ShoppingCart, Share2, ArrowLeft } from 'lucide-react-native';
import api, { getImageUrl } from '../services/api';

export default function SharedWishlistScreen() {
  const { token } = useLocalSearchParams();
  const router = useRouter();
  
  const [wishlistData, setWishlistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    if (token) {
      fetchSharedWishlist();
    } else {
      Alert.alert('Error', 'Invalid shared wishlist link.');
      router.back();
    }
  }, [token]);

  const fetchSharedWishlist = async () => {
    try {
      const res = await api.get(`/wishlist/shared/${token}`);
      if (res.data.success) {
        setWishlistData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching shared wishlist', error);
      Alert.alert('Error', 'Failed to load shared wishlist. Link may be expired or invalid.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    setAddingToCart(item.product._id);
    try {
      const res = await api.post('/cart/items', {
        productId: item.product._id,
        quantity: 1,
      });
      if (res.data.success) {
        Alert.alert('Success', 'Item added to your cart!');
      }
    } catch (error) {
      console.error('Error adding to cart', error);
      Alert.alert('Error', 'Could not add item to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#f43f5e" />
      </View>
    );
  }

  if (!wishlistData) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Wishlist not found.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { user, items } = wishlistData;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image 
        source={{ uri: getImageUrl(item.product?.images?.[0]) }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.productName} numberOfLines={2}>{item.product?.title}</Text>
          <Text style={styles.productPrice}>${item.product?.price?.toFixed(2)}</Text>
        </View>
        <Text style={styles.dateAdded}>
          Added on {new Date(item.addedAt).toLocaleDateString()}
        </Text>
        
        <TouchableOpacity 
          style={styles.addToCartBtn}
          onPress={() => addToCart(item)}
          disabled={addingToCart === item.product._id}
        >
          {addingToCart === item.product._id ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <ShoppingCart size={16} color="#fff" />
              <Text style={styles.addToCartBtnText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{user?.firstName}'s Wishlist</Text>
          <Text style={styles.subtitle}>{items.length} items shared with you</Text>
        </View>
        <View style={styles.iconCircle}>
          <Share2 size={24} color="#f43f5e" />
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Heart size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>This wishlist is empty</Text>
          </View>
        }
      />
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
        paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffe4e6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginRight: 8,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#f43f5e',
  },
  dateAdded: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  addToCartBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: '#64748b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
