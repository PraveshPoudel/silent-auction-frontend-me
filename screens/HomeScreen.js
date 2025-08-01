import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/items');
      setItems(res.data);
      setFiltered(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching items:', err);
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filteredItems = items.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredItems);
  };

  const handleCategoryFilter = (cat) => {
    setCategory(cat);
    if (!cat) {
      setFiltered(items);
    } else {
      const filteredItems = items.filter(item =>
        item.category && item.category.toLowerCase() === cat.toLowerCase()
      );
      setFiltered(filteredItems);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ItemDetails', { item })}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.bid}>Starting Bid: ${item.starting_bid}</Text>
      <Text style={styles.category}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Silent Auction</Text>

      <TextInput
        style={styles.input}
        placeholder="Search items..."
        value={search}
        onChangeText={handleSearch}
      />

      <TextInput
        style={styles.input}
        placeholder="Filter by category..."
        value={category}
        onChangeText={handleCategoryFilter}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={() => navigation.navigate('UploadItem')}
      >
        <Text style={styles.uploadText}>+ Upload Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  bid: { fontSize: 14, color: '#444' },
  category: { fontSize: 12, color: '#999' },
  uploadBtn: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16
  },
  uploadText: { color: '#fff', fontSize: 16 }
});
