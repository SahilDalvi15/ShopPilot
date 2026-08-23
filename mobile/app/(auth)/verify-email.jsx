import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react-native';
import api from '../../services/api';

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setErrorMessage('Invalid or missing verification token.');
        return;
      }
      
      if (hasAttemptedRef.current) return;
      hasAttemptedRef.current = true;

      try {
        const res = await api.get(`/auth/verify-email/${token}`);
        if (res.data.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage('Failed to verify email.');
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(error.response?.data?.message || 'Failed to verify email. The token may be expired or invalid.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <ArrowLeft size={24} color="#64748b" />
      </TouchableOpacity>

      <View style={styles.content}>
        
        {status === 'verifying' && (
          <View style={styles.stateContainer}>
            <View style={[styles.iconCircle, { backgroundColor: '#f3e8ff' }]}>
              <ActivityIndicator size="large" color="#a855f7" />
            </View>
            <Text style={styles.title}>Verifying Email</Text>
            <Text style={styles.subtitle}>Please wait while we verify your email address...</Text>
          </View>
        )}

        {status === 'success' && (
          <View style={styles.stateContainer}>
            <View style={[styles.iconCircle, { backgroundColor: '#dcfce7' }]}>
              <CheckCircle size={40} color="#16a34a" />
            </View>
            <Text style={styles.title}>Email Verified!</Text>
            <Text style={styles.subtitle}>Thank you for verifying your email address. Your account is now fully active.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(auth)/login')}>
              <Text style={styles.primaryBtnText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.stateContainer}>
            <View style={[styles.iconCircle, { backgroundColor: '#fee2e2' }]}>
              <XCircle size={40} color="#ef4444" />
            </View>
            <Text style={styles.title}>Verification Failed</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/(auth)/register')}>
              <Text style={styles.primaryBtnText}>Sign Up Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/')}>
              <Text style={styles.secondaryBtnText}>Return Home</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  primaryBtn: {
    backgroundColor: '#6366f1',
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  secondaryBtnText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
