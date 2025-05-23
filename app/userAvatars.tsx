import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { UserModel, UserModelDto } from '@/assets/model';

type UserAvatarType = {
    users: UserModelDto[];
    onAddUser: () => void;
    onRemoveUser: (id : number) => void;
}

export default function UserAvatars({ users, onAddUser, onRemoveUser } : UserAvatarType){
  return (
    <View style={styles.avatarRow}>
      {users.map((user) => (
        <TouchableOpacity
          key={user.userId}
          style={styles.avatar}
          onPress={() => onRemoveUser(user.userId)}
        >
          <Text style={styles.avatarText}>{user.username[0].toUpperCase()}</Text>
        </TouchableOpacity>
      )).splice(0, 3)}

      <TouchableOpacity onPress={onAddUser} style={styles.addButton}>
        <FontAwesome name="user-plus" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

