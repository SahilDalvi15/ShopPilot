import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Eye, Heart, Send, ArrowLeft, ShoppingBag, X } from 'lucide-react-native';
import api, { getImageUrl } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const MOCK_CHAT = [
  { id: 1, user: 'Sarah123', message: 'Omg love that color!' },
  { id: 2, user: 'Mike_T', message: 'Is it true to size?' },
  { id: 3, user: 'FashionGuru', message: 'I need this right now 🔥' },
  { id: 4, user: 'Elena_V', message: 'Just bought it!' },
  { id: 5, user: 'ShopAholic', message: 'Are there other colors available?' },
  { id: 6, user: 'Jessica.B', message: 'So cute 😍' },
];

export default function LiveShoppingScreen() {
  const [products, setProducts] = useState([]);
  const [chatMessages, setChatMessages] = useState(MOCK_CHAT.slice(0, 2));
  const [newMessage, setNewMessage] = useState('');
  const [viewers, setViewers] = useState(1243);
  const [featuredProductIndex, setFeaturedProductIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [hearts, setHearts] = useState([]);

  const flatListRef = useRef(null);
  const router = useRouter();
  const { user } = useContext(AuthContext);

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
      console.error('Error fetching live products', error);
    }
  };

  useEffect(() => {
    let messageIndex = 2;
    
    const chatInterval = setInterval(() => {
      if (messageIndex < MOCK_CHAT.length) {
        setChatMessages(prev => [...prev, MOCK_CHAT[messageIndex]]);
        messageIndex++;
      } else {
        const randomMessage = MOCK_CHAT[Math.floor(Math.random() * MOCK_CHAT.length)];
        setChatMessages(prev => [...prev, { ...randomMessage, id: Date.now() }]);
      }
    }, 3500);

    const viewersInterval = setInterval(() => {
      setViewers(prev => prev + Math.floor(Math.random() * 11) - 3);
    }, 5000);

    const productInterval = setInterval(() => {
      setFeaturedProductIndex(prev => {
        if (products.length === 0) return 0;
        return (prev + 1) % products.length;
      });
    }, 12000);

    return () => {
      clearInterval(chatInterval);
      clearInterval(viewersInterval);
      clearInterval(productInterval);
    };
  }, [products.length]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), user: 'You', message: newMessage }]);
    setNewMessage('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleHeart = () => {
    const id = Date.now();
    setHearts(prev => [...prev, { id, right: Math.random() * 50 + 20 }]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== id));
    }, 2000);
  };

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to purchase items.');
      return;
    }

    const featuredProduct = products[featuredProductIndex];
    if (!featuredProduct) return;

    setIsAdding(true);
    try {
      await api.post('/cart', {
        productId: featuredProduct._id,
        quantity: 1
      });
      Alert.alert('Got it!', `${featuredProduct.title} added to your cart.`);
    } catch (err) {
      Alert.alert('Error', 'Failed to add item to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  const featuredProduct = products[featuredProductIndex];

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1558769132-cb1fac9c632e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }} // Simulated host video background
        style={styles.background}
      >
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.leftHeader}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <View style={styles.viewersBadge}>
                <Eye size={14} color="#fff" style={{marginRight: 4}} />
                <Text style={styles.viewersText}>{viewers}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Main Content Area */}
          <View style={styles.content}>
            
            {/* Floating Hearts Animation layer would go here */}
            {hearts.map(heart => (
              <View key={heart.id} style={[styles.floatingHeart, { right: heart.right }]}>
                <Heart size={24} color="#ef4444" fill="#ef4444" />
              </View>
            ))}

            {/* Featured Product Card */}
            {featuredProduct && (
              <View style={styles.productCard}>
                <Image 
                  source={{ uri: featuredProduct.images && featuredProduct.images[0] ? featuredProduct.images[0] : 'https://via.placeholder.com/150' }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{featuredProduct.title}</Text>
                  <Text style={styles.productPrice}>${featuredProduct.price.toFixed(2)}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.buyBtn} 
                  onPress={handleAddToCart}
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <ShoppingBag size={14} color="#fff" style={{marginRight: 4}} />
                      <Text style={styles.buyBtnText}>BUY</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Chat Area */}
            <View style={styles.chatArea}>
              <FlatList
                ref={flatListRef}
                data={chatMessages}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.chatMessage}>
                    <Text style={styles.chatUser}>{item.user}</Text>
                    <Text style={styles.chatText}>{item.message}</Text>
                  </View>
                )}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              />
            </View>

            {/* Input Area */}
            <View style={styles.inputArea}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Say something..."
                  placeholderTextColor="#9ca3af"
                  value={newMessage}
                  onChangeText={setNewMessage}
                  onSubmitEditing={handleSendMessage}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                  <Send size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.heartBtn} onPress={handleHeart}>
                <Heart size={28} color="#fff" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 70,
    justifyContent: 'center',
  },
  buyBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatArea: {
    height: 200,
    marginBottom: 16,
    // Mask for fading out top of chat would go here
  },
  chatMessage: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chatUser: {
    color: '#cbd5e1',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 6,
  },
  chatText: {
    color: '#fff',
    fontSize: 13,
    flexShrink: 1,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingRight: 8,
  },
  sendBtn: {
    padding: 4,
  },
  heartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingHeart: {
    position: 'absolute',
    bottom: 80,
    opacity: 0.8,
  },
});
