import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Heart, MessageCircle, Share2, ShoppingBag, Volume2, VolumeX, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

// Reliable public sample videos
const MOCK_VIDEOS = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
  'https://media.w3.org/2010/05/bunny/trailer.mp4',
  'https://media.w3.org/2010/05/video/movie_300.mp4'
];

export default function SocialFeedScreen() {
  const router = useRouter();
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      if (res.data.success) {
        // Map products to mock videos to simulate a real social feed
        const products = res.data.data;
        const mapped = products.slice(0, 10).map((prod, index) => ({
          id: prod._id,
          product: prod,
          videoUrl: MOCK_VIDEOS[index % MOCK_VIDEOS.length],
          likes: Math.floor(Math.random() * 1000) + 50,
          comments: Math.floor(Math.random() * 100) + 5,
        }));
        setFeedItems(mapped);
      }
    } catch (error) {
      console.error('Error fetching social feed', error);
      Alert.alert('Error', 'Failed to load feed.');
    } finally {
      setLoading(false);
    }
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 70,
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const renderItem = ({ item, index }) => {
    const isActive = index === activeIndex;

    return (
      <FeedItem 
        item={item}
        isActive={isActive}
        isMuted={isMuted}
        toggleMute={toggleMute}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0f172a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feedItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
      />
      
      {/* Absolute Back Button */}
      <SafeAreaView style={styles.backButtonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const FeedItem = ({ item, isActive, isMuted, toggleMute }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
      videoRef.current.setPositionAsync(0);
    }
  }, [isActive]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddToCart = async () => {
    if (!item.product) return;
    setAddingToCart(true);
    try {
      const res = await api.post('/cart/items', {
        productId: item.product._id,
        quantity: 1,
      });
      if (res.data.success) {
        Alert.alert('Success', `${item.product.title} added to cart!`);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: item.videoUrl }}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted={isMuted}
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      
      {/* Gradient Overlay Simulation */}
      <View style={styles.overlay} />

      {/* Mute Button */}
      <SafeAreaView style={styles.muteButtonContainer}>
        <TouchableOpacity style={styles.iconCircle} onPress={toggleMute}>
          {isMuted ? <VolumeX size={20} color="#fff" /> : <Volume2 size={20} color="#fff" />}
        </TouchableOpacity>
      </SafeAreaView>

      {/* Right Action Bar */}
      <View style={styles.rightActions}>
        <View style={styles.actionItem}>
          <TouchableOpacity 
            style={styles.iconCircle} 
            onPress={handleLike}
          >
            <Heart size={28} color={isLiked ? "#ef4444" : "#fff"} fill={isLiked ? "#ef4444" : "transparent"} />
          </TouchableOpacity>
          <Text style={styles.actionText}>{likes}</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity style={styles.iconCircle}>
            <MessageCircle size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.actionText}>{item.comments}</Text>
        </View>

        <View style={styles.actionItem}>
          <TouchableOpacity style={styles.iconCircle}>
            <Share2 size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.actionText}>Share</Text>
        </View>
      </View>

      {/* Bottom Product Info */}
      <SafeAreaView style={styles.bottomInfoContainer}>
        <View style={styles.bottomInfo}>
          <View style={styles.productDetails}>
            <Text style={styles.vendorName}>@{item.product.vendor?.storeName || 'ShopPilot'}</Text>
            <Text style={styles.productTitle} numberOfLines={2}>{item.product.title}</Text>
            <Text style={styles.productPrice}>${item.product.price?.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.buyBtn} 
            onPress={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? (
              <ActivityIndicator color="#0f172a" size="small" />
            ) : (
              <>
                <ShoppingBag size={18} color="#0f172a" />
                <Text style={styles.buyBtnText}>Buy Now</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  videoContainer: {
    width,
    height,
    backgroundColor: '#000',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 0,
    left: 20,
    zIndex: 50,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 20 : 0,
    right: 20,
    zIndex: 50,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 160,
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 6,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 40, // Account for tabs/nav bar
  },
  productDetails: {
    flex: 1,
    marginRight: 20,
  },
  vendorName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  productTitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  productPrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buyBtnText: {
    color: '#0f172a',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
});
