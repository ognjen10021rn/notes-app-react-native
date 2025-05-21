import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // or 'react-native-vector-icons/FontAwesome'

export default function UserHeader({ username = 'zika' }) {
  const [isAdded, setIsAdded] = useState(false);

  const toggleUser = () => {
    setIsAdded((prev) => !prev);
    // Add/remove user logic can be placed here
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{username[0].toUpperCase()}</Text>
      </View>

      <View style={{ marginLeft: 10 }}>
        <Text style={styles.username}>{username}</Text>
      </View>

      <TouchableOpacity onPress={toggleUser} style={styles.iconContainer}>
        <FontAwesome
          name={isAdded ? 'user-times' : 'user-plus'}
          size={16}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 10,
    justifyContent: 'space-between',
  },
  avatar: {
    backgroundColor: '#444',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    color: '#aaa',
    fontSize: 12,
  },
  iconContainer: {
    padding: 8,
  },
});

