import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert
} from 'react-native';
import api from '../services/api';

export default function ItemDetailsScreen({ route }) {
  const { item } = route.params;
  const [bids, setBids] = useState([]);
  const [newBid, setNewBid] = useState('');

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const res = await api.get(`/bids/item/${item._id}`);
      setBids(res.data);
    } catch (err) {
      console.log('Failed to fetch bids', err.message);
    }
  };

  const handlePlaceBid = async () => {
    const amount = parseFloat(newBid);

    if (!amount || amount <= 0) {
      return Alert.alert('Invalid', 'Enter a valid bid amount');
    }

    try {
      await api.post('/bids', {
        item_id: item._id,
        bid_amount: amount
      });
      Alert.alert('Success', 'Your bid was placed!');
      setNewBid('');
      fetchBids();
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert('Failed', err.response?.data?.message || 'Bid failed');
    }
  };

  const renderBid = ({ item }) => (
    <View style={styles.bidItem}>
      <Text>{item.user_id?.name || 'Anonymous'} bid ${item.bid_amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.label}>Category: {item.category}</Text>
      <Text style={styles.label}>Starting Bid: ${item.starting_bid}</Text>
      <Text style={styles.label}>Deadline: {new Date(item.deadline).toDateString()}</Text>
      <Text style={styles.desc}>{item.description}</Text>

      <Text style={styles.section}>Bidding</Text>

      <TextInput
        placeholder="Enter your bid"
        keyboardType="numeric"
        value={newBid}
        onChangeText={setNewBid}
        style={styles.input}
      />

      <Button title="Place Bid" onPress={handlePlaceBid} />

      <Text style={styles.section}>Bid History</Text>

      <FlatList
        data={bids}
        keyExtractor={(bid) => bid._id}
        renderItem={renderBid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  label: { fontSize: 14, color: '#666' },
  desc: { marginTop: 10, marginBottom: 20, fontSize: 14 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 6
  },
  section: { marginTop: 20, fontSize: 16, fontWeight: 'bold' },
  bidItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#eee'
  }
});
