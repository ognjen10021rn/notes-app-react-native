import { Image, StyleSheet, Platform, View, useColorScheme, Text, Alert, ActivityIndicator } from 'react-native';

import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomePage from './homepage';
import LoginScreen from './login';

export default function MainScreen() {
    
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        _checkLoginStatus();
  }, []);

    const _checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
        console.log(isLoggedIn)
        setLoading(false)
      } else {
        setIsLoggedIn(false);
      }
    };

  return (
      <>
        { isLoggedIn ? (
            <HomePage />
        ) : (
            <LoginScreen />
        )}
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  darkTheme: {
    flex: 1, // Makes the view take the whole screen
    justifyContent: 'center', // Centers the content vertically
    alignItems: 'center', // Centers the content horizontally
  },
  header: {
      color:"#fff",
      fontSize: 28,
      fontWeight: "700"
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  
});

