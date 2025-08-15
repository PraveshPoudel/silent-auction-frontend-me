import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/items');
      setItems(res.data);
      setFilteredItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (!text) {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) =>
          item.title.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  // const renderItem = ({ item }) => (
  //   <TouchableOpacity
  //     style={styles.card}
  //     onPress={() => navigation.navigate('ItemDetails', { item })}
  //   >
  //     <Image
  //       source={
  //         item.images && item.images.length > 0
  //           ? { uri: item.images[0] }
  //           : require('../assets/icon.png')
  //       }
  //       style={styles.cardImage}
  //     />
  //     <Text style={styles.cardTitle}>{item.title}</Text>
  //     <Text style={styles.cardBid}>
  //       {item.current_bid
  //         ? `$${item.current_bid}`
  //         : `$${item.starting_bid}`}
  //     </Text>
  //   </TouchableOpacity>
  // );

  const renderItem = ({ item }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate('ItemDetails', { item })}
  >
    <Image
      source={
        item.images && item.images.length > 0
          ? { uri: item.images[0] }
          : require('../assets/icon.png')
      }
      style={styles.cardImage}
    />
    <Text style={styles.cardTitle}>{item.title}</Text>
    <Text style={styles.cardBid}>Starting Bid: ${item.starting_bid}</Text>
    <Text style={styles.cardDeadline}>
      Ends: {new Date(item.deadline).toLocaleDateString()}
    </Text>
  </TouchableOpacity>
);


  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Welcome to Auctions</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={search}
        onChangeText={handleSearch}
      />

      {/* Item Grid */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          nestedScrollEnabled
          data={filteredItems}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 140 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Bottom Section */}
      <Text style={styles.bottomText}>Can't find your Interest?</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => navigation.navigate('UploadItem')}
      >
        <Text style={styles.uploadButtonText}>Upload Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15 },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    flex: 0.48,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardBid: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 2,
  },
  cardDeadline: {
  fontSize: 13,
  color: '#777',
  textAlign: 'center',
  },
  bottomText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    marginTop: 10,
    marginBottom: 8,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 20,
    width: '60%',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
