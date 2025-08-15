import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList
} from 'react-native';
import api from '../services/api';

export default function ItemDetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const [bidAmount, setBidAmount] = useState('');
  const [bidHistory, setBidHistory] = useState([]);

  useEffect(() => {
    fetchBidHistory();
  }, []);

  const fetchBidHistory = async () => {
    try {
      const res = await api.get(`/bids/item/${item._id}`);
      setBidHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBid = async () => {
    if (!bidAmount) {
      Alert.alert('Error', 'Please enter a bid amount');
      return;
    }
    try {
      await api.post('/bids', { item_id: item._id, bid_amount: bidAmount });
      Alert.alert('Success', 'Your bid has been placed');
      setBidAmount('');
      fetchBidHistory();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to place bid');
    }
  };

  const renderBidRow = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>
        {new Date(item.bid_time).toLocaleDateString()}
      </Text>
      <Text style={styles.tableCell}>${item.bid_amount}</Text>
    </View>
  );

  return (
    <FlatList
      data={bidHistory}
      keyExtractor={(b) => b._id}
      renderItem={renderBidRow}
      ListHeaderComponent={
        <View>
          <Image
            source={
              item.images && item.images.length > 0
                ? { uri: item.images[0] }
                : require('../assets/icon.png')
            }
            style={styles.image}
          />

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.price}>Starting Bid: ${item.starting_bid}</Text>
          <Text style={styles.deadline}>
            Ends: {new Date(item.deadline).toLocaleDateString()}
          </Text>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          <Text style={styles.sectionTitle}>Bid History</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Date</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText]}>Bid Amount</Text>
          </View>
        </View>
      }
      ListEmptyComponent={<Text style={styles.noBids}>No bids yet</Text>}
      ListFooterComponent={
        <View>
          <View style={styles.bidContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your bid amount"
              keyboardType="numeric"
              value={bidAmount}
              onChangeText={setBidAmount}
            />
            <TouchableOpacity style={styles.bidButton} onPress={handleBid}>
              <Text style={styles.bidButtonText}>Place Bid</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 80 }} />
        </View>
      }
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  price: {
    fontSize: 18,
    color: '#2e64e5',
    marginBottom: 3,
  },
  deadline: {
    fontSize: 16,
    color: '#777',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tableHeaderText: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  noBids: {
    fontSize: 14,
    color: '#777',
    marginVertical: 10,
  },
  bidContainer: {
    marginTop: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  bidButton: {
    backgroundColor: '#2e64e5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  bidButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
