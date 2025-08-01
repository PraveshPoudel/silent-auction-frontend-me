import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../services/api';

export default function UploadItemScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUpload = async () => {
    if (!title || !description || !startingBid || !category) {
      return Alert.alert('Error', 'Please fill all fields');
    }

    try {
      await api.post('/items', {
        title,
        description,
        starting_bid: parseFloat(startingBid),
        deadline,
        category,
        images: [] // Optional for now
      });

      Alert.alert('Success', 'Item uploaded successfully');
      setTitle('');
      setDescription('');
      setStartingBid('');
      setCategory('');
      setDeadline(new Date());
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert('Error', 'Failed to upload item');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload Auction Item</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TextInput
        placeholder="Starting Bid (e.g. 100)"
        value={startingBid}
        onChangeText={setStartingBid}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />

      <Button
        title={`Select Deadline: ${deadline.toDateString()}`}
        onPress={() => setShowDatePicker(true)}
      />

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={deadline}
          onChange={(e, date) => {
            setShowDatePicker(false);
            if (date) setDeadline(date);
          }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Upload Item" onPress={handleUpload} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6
  }
});
