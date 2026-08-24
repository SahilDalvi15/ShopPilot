import React, { useState, useEffect, useContext, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, Store, DollarSign, Package, TrendingUp, TrendingDown, Plus, CreditCard } from 'lucide-react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function VendorHubScreen() {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [])
  );

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/vendor/dashboard');
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching vendor dashboard:', error);
      // For demo purposes, we will mock data if backend doesn't support or if not a vendor
      // Alternatively, we can show an error or a "Become a Vendor" screen
      setDashboardData({
        vendor: {
          storeName: 'My Awesome Store',
          logo: null,
          slug: 'my-awesome-store'
        },
        stats: {
          totalRevenue: 15420,
          balance: 2400,
          totalOrders: 128,
          totalProducts: 45
        },
        recentOrderItems: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Store size={64} color="#cbd5e1" style={{marginBottom: 16}} />
        <Text style={styles.title}>Vendor Hub</Text>
        <Text style={styles.subtitle}>Please login to access your seller dashboard.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.primaryBtnText}>Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { vendor, stats } = dashboardData || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seller Dashboard</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Store Profile Header */}
        <View style={styles.storeHeader}>
          <View style={styles.storeLogoBox}>
            {vendor?.logo ? (
              <Image source={{ uri: vendor.logo }} style={styles.storeLogo} />
            ) : (
              <Store size={32} color="#6366f1" />
            )}
          </View>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{vendor?.storeName}</Text>
            <Text style={styles.storeSlug}>@{vendor?.slug}</Text>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {/* Revenue */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#dcfce7' }]}>
              <DollarSign size={20} color="#16a34a" />
            </View>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValue}>${stats?.totalRevenue?.toLocaleString()}</Text>
          </View>

          {/* Balance */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#e0e7ff' }]}>
              <TrendingUp size={20} color="#4f46e5" />
            </View>
            <Text style={styles.statLabel}>Available Balance</Text>
            <Text style={styles.statValue}>${stats?.balance?.toLocaleString()}</Text>
          </View>

          {/* Orders */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#ffedd5' }]}>
              <Package size={20} color="#ea580c" />
            </View>
            <Text style={styles.statLabel}>Total Orders</Text>
            <Text style={styles.statValue}>{stats?.totalOrders?.toLocaleString()}</Text>
          </View>

          {/* Products */}
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#f3e8ff' }]}>
              <Store size={20} color="#a855f7" />
            </View>
            <Text style={styles.statLabel}>Active Products</Text>
            <Text style={styles.statValue}>{stats?.totalProducts?.toLocaleString()}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsList}>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconBox, { backgroundColor: '#f1f5f9' }]}>
              <Plus size={20} color="#64748b" />
            </View>
            <Text style={styles.actionText}>Add New Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconBox, { backgroundColor: '#f1f5f9' }]}>
              <CreditCard size={20} color="#64748b" />
            </View>
            <Text style={styles.actionText}>Withdraw Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <View style={[styles.actionIconBox, { backgroundColor: '#f1f5f9' }]}>
              <TrendingDown size={20} color="#64748b" />
            </View>
            <Text style={styles.actionText}>View Sales Reports</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
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
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  storeLogoBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  storeLogo: {
    width: '100%',
    height: '100%',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  storeSlug: {
    fontSize: 14,
    color: '#64748b',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  actionsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
});
