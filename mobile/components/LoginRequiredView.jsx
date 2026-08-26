import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';

export default function LoginRequiredView({ message = "Please log in to view this page" }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Lock size={64} color="#cbd5e1" style={styles.icon} />
      <Text style={styles.title}>Login Required</Text>
      <Text style={styles.message}>{message}</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push('/(auth)/login')}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => router.push('/(auth)/register')}
      >
        <Text style={styles.secondaryButtonText}>Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
  },
  secondaryButtonText: {
    color: '#4f46e5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
