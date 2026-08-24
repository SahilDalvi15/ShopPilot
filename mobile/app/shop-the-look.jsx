import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Modal, Dimensions, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Heart, MessageCircle, Share2, Tag, X, ShoppingCart, ArrowLeft } from 'lucide-react-native';
import api, { getImageUrl } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const MOCK_POSTS = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    influencer: { name: 'Sarah Style', handle: '@sarahstyle', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    likes: 1240,
    caption: 'Loving this new summer fit! The perfect blend of comfort and style. ☀️✨',
    tags: [
      { id: 'tag1', x: 45, y: 30, productIndex: 0 },
      { id: 'tag2', x: 60, y: 70, productIndex: 1 }
    ]
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    influencer: { name: 'Alex Designs', handle: '@alexdesigns', avatar: 'https://i.pravatar.cc/150?u=alex' },
    likes: 892,
    caption: 'Current skincare routine featuring my holy grail products. Dewy skin all day! 💧🌿',
    tags: [
      { id: 'tag3', x: 50, y: 50, productIndex: 2 }
    ]
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    influencer: { name: 'Emma Vogue', handle: '@emmavogue', avatar: 'https://i.pravatar.cc/150?u=emma' },
    likes: 3205,
    caption: 'Date night ready. This bag is everything! 🖤👜',
    tags: [
      { id: 'tag4', x: 70, y: 65, productIndex: 3 },
      { id: 'tag5', x: 30, y: 25, productIndex: 4 }
    ]
  }
];

export default function ShopTheLookScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=10');
      if (res.data.success) {
        setProducts(res.data.data || res.data.products);
      }
    } catch (error) {
      console.error('Error fetching products for shop the look', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to purchase items.');
      return;
    }

    if (!quickViewProduct) return;
    setIsAddingToCart(true);

    try {
      await api.post('/cart', {
        productId: quickViewProduct._id,
        quantity: 1
      });
      Alert.alert('Success', 'Item added to cart');
      setQuickViewProduct(null);
    } catch (err) {
      Alert.alert('Error', 'Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleTagClick = (tag) => {
    const product = products[tag.productIndex % products.length];
    if (product) {
      setQuickViewProduct(product);
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: getImageUrl(item.influencer?.avatar) }} style={styles.avatar} />
        <View>
          <Text style={styles.influencerName}>{item.influencer.name}</Text>
          <Text style={styles.influencerHandle}>{item.influencer.handle}</Text>
        </View>
      </View>

      {/* Post Image & Tags */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: getImageUrl(item.imageUrl) }} style={styles.postImage} />
        {item.tags.map(tag => (
          <TouchableOpacity 
            key={tag.id}
            style={[styles.tagMarker, { left: `${tag.x}%`, top: `${tag.y}%` }]}
            onPress={() => handleTagClick(tag)}
          >
            <View style={styles.tagDot} />
          </TouchableOpacity>
        ))}
        <View style={styles.shopLookBadge}>
          <Tag size={12} color="#fff" style={{marginRight: 4}} />
          <Text style={styles.shopLookText}>Tap dots to shop</Text>
        </View>
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.actionLeft}>
          <TouchableOpacity style={styles.actionBtn}>
            <Heart size={24} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <MessageCircle size={24} color="#0f172a" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Share2 size={24} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Likes & Caption */}
      <View style={styles.postContent}>
        <Text style={styles.likesText}>{item.likes.toLocaleString()} likes</Text>
        <Text style={styles.captionText}>
          <Text style={styles.captionUser}>{item.influencer.handle} </Text>
          {item.caption}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop The Look</Text>
        <View style={{width: 40}} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" style={{marginTop: 40}} />
      ) : (
        <FlatList
          data={MOCK_POSTS}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}

      {/* Quick View Modal */}
      <Modal
        visible={!!quickViewProduct}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setQuickViewProduct(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setQuickViewProduct(null)}
        >
          {quickViewProduct && (
            <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
              <View style={styles.modalHandle} />
              
              <View style={styles.quickViewHeader}>
                <Text style={styles.quickViewTitle}>Product Details</Text>
                <TouchableOpacity onPress={() => setQuickViewProduct(null)}>
                  <X size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <View style={styles.quickViewProduct}>
                <Image 
                  source={{ uri: quickViewProduct.images && quickViewProduct.images[0] ? quickViewProduct.images[0] : 'https://via.placeholder.com/150' }}
                  style={styles.quickViewImage}
                  resizeMode="contain"
                />
                <View style={styles.quickViewInfo}>
                  <Text style={styles.quickViewName} numberOfLines={2}>{quickViewProduct.title}</Text>
                  <Text style={styles.quickViewBrand}>{quickViewProduct.brand}</Text>
                  <Text style={styles.quickViewPrice}>${quickViewProduct.price.toFixed(2)}</Text>
                  
                  <TouchableOpacity 
                    style={styles.addToCartBtn} 
                    onPress={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <ShoppingCart size={18} color="#fff" style={{marginRight: 8}} />
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.viewDetailsBtn}
                    onPress={() => {
                      setQuickViewProduct(null);
                      router.push(`/product/${quickViewProduct._id}`);
                    }}
                  >
                    <Text style={styles.viewDetailsText}>View Full Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  postCard: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  influencerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  influencerHandle: {
    fontSize: 12,
    color: '#64748b',
  },
  imageContainer: {
    width: width,
    height: width,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  tagMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  tagDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  shopLookBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  shopLookText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  actionLeft: {
    flexDirection: 'row',
  },
  actionBtn: {
    marginRight: 16,
  },
  postContent: {
    paddingHorizontal: 12,
  },
  likesText: {
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  captionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  captionUser: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#cbd5e1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  quickViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quickViewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  quickViewProduct: {
    flexDirection: 'row',
  },
  quickViewImage: {
    width: 100,
    height: 140,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#f8fafc',
  },
  quickViewInfo: {
    flex: 1,
  },
  quickViewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  quickViewBrand: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  quickViewPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 16,
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  viewDetailsBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
  },
});
