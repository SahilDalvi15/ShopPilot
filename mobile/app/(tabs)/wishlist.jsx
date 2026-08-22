import { View, Text, StyleSheet } from 'react-native';

export default function WishlistScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wishlist</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});
