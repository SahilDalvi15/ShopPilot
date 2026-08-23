import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Store, ArrowRight, ArrowLeft } from 'lucide-react-native';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function VendorOnboardingScreen() {
  const router = useRouter();
  const { loadUser } = useContext(AuthContext);

  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!storeName || !description) {
      Alert.alert('Error', 'Store name and description are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/vendors/register', {
        storeName,
        description,
        logo,
        banner
      });
      if (res.data.success) {
        await loadUser(); // Reload user context to get 'vendor' role
        Alert.alert('Success', 'Store created successfully! Welcome to the marketplace.');
        router.replace('/vendor-hub');
      }
    } catch (error) {
      console.error('Error registering vendor', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Store size={32} color="#6366f1" />
          </View>
          <Text style={styles.title}>Become a Seller</Text>
          <Text style={styles.subtitle}>Open your own store and reach millions of customers instantly.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Store Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Tech Haven"
              placeholderTextColor="#94a3b8"
              value={storeName}
              onChangeText={setStoreName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Store Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell customers what you sell..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Logo URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/logo.png"
              placeholderTextColor="#94a3b8"
              value={logo}
              onChangeText={setLogo}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Banner URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/banner.jpg"
              placeholderTextColor="#94a3b8"
              value={banner}
              onChangeText={setBanner}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <TouchableOpacity 
            style={styles.submitBtn} 
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Create Store</Text>
                <ArrowRight size={20} color="#fff" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0f172a',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  submitBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
