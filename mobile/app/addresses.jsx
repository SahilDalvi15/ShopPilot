import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Plus, Edit2, Trash2, Check, ArrowLeft } from 'lucide-react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/addresses');
      if (res.data.success) {
        setAddresses(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      Alert.alert('Error', 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await api.delete(`/users/addresses/${id}`);
            if (res.data.success) {
              setAddresses(addresses.filter(a => a._id !== id));
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to delete address');
          }
        }
      }
    ]);
  };

  const setDefaultAddress = async (id) => {
    try {
      const res = await api.put(`/users/addresses/${id}/default`);
      if (res.data.success) {
        fetchAddresses();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to set default address');
    }
  };

  const renderAddress = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressTypeBadge}>
          <Text style={styles.addressTypeText}>{item.addressType.toUpperCase()}</Text>
        </View>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <Check size={12} color="#16a34a" style={{marginRight: 4}} />
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.addressName}>{item.fullName}</Text>
      <Text style={styles.addressText}>{item.addressLine1}</Text>
      {item.addressLine2 ? <Text style={styles.addressText}>{item.addressLine2}</Text> : null}
      <Text style={styles.addressText}>
        {item.city}, {item.state} {item.postalCode}
      </Text>
      <Text style={styles.addressText}>{item.country}</Text>
      <Text style={styles.phoneText}>Phone: {item.phoneNumber}</Text>

      <View style={styles.addressActions}>
        {!item.isDefault && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setDefaultAddress(item._id)}
          >
            <Text style={styles.actionButtonText}>Set as Default</Text>
          </TouchableOpacity>
        )}
        <View style={{flex: 1}} />
        <TouchableOpacity style={styles.iconButton} onPress={() => {/* Edit later */}}>
          <Edit2 size={18} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, {marginLeft: 8}]} onPress={() => deleteAddress(item._id)}>
          <Trash2 size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => {/* Add later */}}>
          <Plus size={20} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 40 }} />
      ) : addresses.length === 0 ? (
        <View style={styles.emptyState}>
          <MapPin size={48} color="#cbd5e1" />
          <Text style={styles.emptyStateTitle}>No Addresses Yet</Text>
          <Text style={styles.emptyStateText}>Add an address for faster checkout</Text>
          <TouchableOpacity style={styles.addPrimaryButton} onPress={() => {/* Add later */}}>
            <Text style={styles.addPrimaryButtonText}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          renderItem={renderAddress}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  addButton: {
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    marginRight: -8,
  },
  list: {
    padding: 16,
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTypeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addressTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#475569',
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 2,
  },
  phoneText: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
    marginBottom: 16,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  addPrimaryButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addPrimaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
