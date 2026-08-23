import React, { useState, useEffect, useMemo, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, ArrowRight, ArrowLeft, Wallet, CreditCard, Gem, CheckCircle2, ShoppingBag } from 'lucide-react-native';
import api, { getImageUrl } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const QUIZ_QUESTIONS = [
  {
    id: 'style',
    title: 'What best describes your personal style?',
    subtitle: 'Select the vibe that resonates most with you.',
    options: [
      { id: 'minimalist', label: 'Minimalist & Clean', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
      { id: 'streetwear', label: 'Streetwear & Edgy', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
      { id: 'classic', label: 'Classic & Elegant', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
      { id: 'casual', label: 'Casual & Comfy', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
    ]
  },
  {
    id: 'color',
    title: 'What is your preferred color palette?',
    subtitle: 'We will curate products that match your tones.',
    options: [
      { id: 'neutrals', label: 'Neutrals (Black, White, Beige)', bg: '#f5f5f4' },
      { id: 'earthy', label: 'Earthy (Brown, Olive, Rust)', bg: '#78350f' },
      { id: 'pastels', label: 'Pastels (Pink, Mint, Lilac)', bg: '#fbcfe8' },
      { id: 'bold', label: 'Bold (Red, Royal Blue, Yellow)', bg: '#dc2626' }
    ]
  },
  {
    id: 'budget',
    title: 'What is your ideal budget range?',
    subtitle: 'This helps us find the best value for you.',
    options: [
      { id: 'budget', label: 'Budget Friendly (Under $50)', icon: Wallet, desc: 'Great style doesn\'t have to break the bank.' },
      { id: 'mid', label: 'Mid-Range ($50 - $150)', icon: CreditCard, desc: 'The sweet spot for quality and price.' },
      { id: 'premium', label: 'Premium (Over $150)', icon: Gem, desc: 'Treat yourself to luxury and premium materials.' }
    ]
  }
];

export default function StyleQuizScreen() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 is the intro screen
  const [answers, setAnswers] = useState({});
  const [products, setProducts] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAddingAll, setIsAddingAll] = useState(false);
  
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=50');
      if (res.data.success) {
        setProducts(res.data.data || res.data.products);
      }
    } catch (error) {
      console.error('Error fetching quiz products', error);
    }
  };

  const recommendedProducts = useMemo(() => {
    if (!products.length) return [];
    
    let filtered = [...products];

    // Basic logic
    if (answers.budget === 'budget') {
      filtered = filtered.filter(p => p.price < 50);
    } else if (answers.budget === 'mid') {
      filtered = filtered.filter(p => p.price >= 50 && p.price <= 150);
    } else if (answers.budget === 'premium') {
      filtered = filtered.filter(p => p.price > 150);
    }

    return filtered.sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [answers, products]);

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      runAnalysis();
    }
  };

  const handleSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
    setTimeout(() => handleNext(), 300); // Auto advance
  };

  const runAnalysis = () => {
    setCurrentStep(QUIZ_QUESTIONS.length);
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleAddAllToCart = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to add these to your cart.');
      return;
    }

    if (!recommendedProducts.length) return;
    setIsAddingAll(true);
    try {
      for (const product of recommendedProducts) {
        await api.post('/cart', {
          productId: product._id,
          quantity: 1
        });
      }
      Alert.alert('Added to Cart', 'Your curated wardrobe has been added to the cart!', [
        { text: 'Go to Cart', onPress: () => router.push('/cart') }
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to add items to cart.');
    } finally {
      setIsAddingAll(false);
    }
  };

  // 1. Intro Screen
  if (currentStep === -1) {
    return (
      <View style={styles.introContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButtonAbsolute}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        
        <View style={styles.introContent}>
          <View style={styles.iconCircle}>
            <Sparkles size={48} color="#6366f1" />
          </View>
          <Text style={styles.introTitle}>Find Your Perfect Style</Text>
          <Text style={styles.introText}>
            Take our quick 1-minute quiz and let our AI stylist curate a personalized wardrobe just for you.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setCurrentStep(0)}>
            <Text style={styles.primaryBtnText}>Start the Quiz</Text>
            <ArrowRight size={20} color="#fff" style={{marginLeft: 8}} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 2. Loading / Analyzing Screen
  if (currentStep === QUIZ_QUESTIONS.length && isAnalyzing) {
    return (
      <View style={styles.introContainer}>
        <ActivityIndicator size="large" color="#6366f1" style={{marginBottom: 24}} />
        <Text style={styles.introTitle}>Analyzing Your Style</Text>
        <Text style={styles.introText}>Curating the perfect pieces for you...</Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: `${analysisProgress}%` }]} />
        </View>
        <Text style={{color: '#64748b', marginTop: 12}}>{analysisProgress}% Complete</Text>
      </View>
    );
  }

  // 3. Results Screen
  if (currentStep === QUIZ_QUESTIONS.length && !isAnalyzing) {
    const totalValue = recommendedProducts.reduce((sum, item) => sum + item.price, 0);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentStep(-1)} style={styles.backButton}>
            <ArrowLeft size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Matches</Text>
          <View style={{width: 40}} />
        </View>

        <ScrollView contentContainerStyle={styles.resultsContent}>
          <View style={styles.resultsHeader}>
            <CheckCircle2 size={48} color="#16a34a" style={{marginBottom: 16}} />
            <Text style={styles.resultsTitle}>We Found Your Style!</Text>
            <Text style={styles.resultsSubtitle}>Based on your answers, we think you'll love these pieces.</Text>
          </View>

          <View style={styles.productsGrid}>
            {recommendedProducts.map(product => (
              <View key={product._id} style={styles.productCard}>
                <Image source={{ uri: getImageUrl(product.images[0]) }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>{product.title}</Text>
                  <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.totalLabel}>Total Value</Text>
            <Text style={styles.totalPrice}>${totalValue.toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.addAllBtn} 
            onPress={handleAddAllToCart}
            disabled={isAddingAll || recommendedProducts.length === 0}
          >
            {isAddingAll ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <ShoppingBag size={18} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.addAllText}>Add All</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 4. Quiz Question Screens
  const question = QUIZ_QUESTIONS[currentStep];
  const progressPercent = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.quizHeader}>
        <TouchableOpacity onPress={() => setCurrentStep(prev => prev - 1)} style={styles.backButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={styles.quizProgressHeader}>
          <Text style={styles.quizStepText}>Step {currentStep + 1} of {QUIZ_QUESTIONS.length}</Text>
          <View style={styles.quizProgressBar}>
            <View style={[styles.quizProgressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.questionContent}>
        <Text style={styles.questionTitle}>{question.title}</Text>
        <Text style={styles.questionSubtitle}>{question.subtitle}</Text>

        <View style={styles.optionsList}>
          {question.options.map(option => {
            const isSelected = answers[question.id] === option.id;
            const IconComponent = option.icon;

            return (
              <TouchableOpacity 
                key={option.id}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => handleSelect(question.id, option.id)}
              >
                {question.id === 'style' && (
                  <Image source={{ uri: option.image }} style={styles.optionImage} />
                )}
                {question.id === 'color' && (
                  <View style={[styles.colorBlock, { backgroundColor: option.bg }]} />
                )}
                <View style={styles.optionInfo}>
                  <View style={styles.optionHeaderRow}>
                    {IconComponent && <IconComponent size={20} color="#6366f1" style={{marginRight: 12}} />}
                    <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>{option.label}</Text>
                  </View>
                  {option.desc && <Text style={styles.optionDesc}>{option.desc}</Text>}
                </View>
                <View style={styles.radioCircle}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  introContainer: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', padding: 24 },
  backButtonAbsolute: { position: 'absolute', top: 60, left: 24, zIndex: 10, padding: 8 },
  introContent: { alignItems: 'center', maxWidth: 400 },
  iconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#e0e7ff', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  introTitle: { fontSize: 32, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginBottom: 16 },
  introText: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 40, lineHeight: 24 },
  primaryBtn: { flexDirection: 'row', backgroundColor: '#6366f1', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  progressContainer: { width: '80%', height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#6366f1' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  quizHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  quizProgressHeader: { flex: 1, alignItems: 'center', paddingHorizontal: 16 },
  quizStepText: { fontSize: 12, fontWeight: 'bold', color: '#64748b', marginBottom: 8, textTransform: 'uppercase' },
  quizProgressBar: { width: '100%', height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' },
  quizProgressFill: { height: '100%', backgroundColor: '#6366f1', borderRadius: 2 },
  questionContent: { padding: 24 },
  questionTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  questionSubtitle: { fontSize: 16, color: '#64748b', marginBottom: 32 },
  optionsList: { gap: 16 },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 2, borderColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  optionCardSelected: { borderColor: '#6366f1', backgroundColor: '#f5f7ff' },
  optionImage: { width: 64, height: 64, borderRadius: 8, marginRight: 16 },
  colorBlock: { width: 64, height: 64, borderRadius: 8, marginRight: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  optionInfo: { flex: 1, justifyContent: 'center' },
  optionHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  optionLabel: { fontSize: 16, fontWeight: 'bold', color: '#334155' },
  optionLabelSelected: { color: '#4f46e5' },
  optionDesc: { fontSize: 13, color: '#64748b', marginTop: 4 },
  radioCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center', marginLeft: 16 },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#6366f1' },
  resultsContent: { padding: 24, paddingBottom: 100 },
  resultsHeader: { alignItems: 'center', marginBottom: 32 },
  resultsTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  resultsSubtitle: { fontSize: 16, color: '#64748b', textAlign: 'center' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between' },
  productCard: { width: '47%', backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginBottom: 16 },
  productImage: { width: '100%', height: 160 },
  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginBottom: 4, height: 40 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#6366f1' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 40, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 10 },
  totalLabel: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  totalPrice: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  addAllBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f172a', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  addAllText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
