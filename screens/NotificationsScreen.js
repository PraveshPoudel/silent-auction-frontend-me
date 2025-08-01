import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  ActivityIndicator
} from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function NotificationsScreen() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Notification fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications(); // reload after update
    } catch (err) {
      console.error('Failed to mark as read', err.message);
    }
  };

  const renderNotification = ({ item }) => (
    <View style={[styles.card, !item.is_read && styles.unread]}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
      {!item.is_read && (
        <Button title="Mark as Read" onPress={() => markAsRead(item._id)} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotification}
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
  unread: {
    borderColor: 'orange',
    backgroundColor: '#fff7ec'
  },
  message: { fontSize: 16 },
  time: { fontSize: 12, color: '#888', marginTop: 6 }
});
