import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function MyBidsScreen() {
  const { user } = useContext(AuthContext);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      const res = await api.get(`/bids/user/${user.id}`);
      setBids(res.data);
    } catch (err) {
      console.error('Failed to fetch my bids', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderBid = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.item_id?.title || 'Item'}</Text>
      <Text>Bid: ${item.bid_amount}</Text>
      <Text>Date: {new Date(item.bid_time).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bids</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={bids}
          keyExtractor={(bid) => bid._id}
          renderItem={renderBid}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10
  },
  title: { fontSize: 16, fontWeight: 'bold' }
});
