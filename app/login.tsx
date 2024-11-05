import { StyleSheet, View, Text, TextInput, Alert, Pressable } from 'react-native';

import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';


export default function LoginScreen() {
    

    const [text, setText] = useState('')
    const [password, setPassword] = useState('')


     const submit = async (text: string, password: string) => {
    try {
      const response = await fetch(`http://192.168.0.101:8080/api/v1/user/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: text,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const tkn = await response.json();
      await AsyncStorage.setItem('token', tkn.token);

      Alert.alert('Success', 'Logged in successfully!');

      router.replace('/homepage');

    } catch (error) {
    }
  };


  return (
    <View style={styles.darkTheme}>
        <Text style={styles.header}>Create account/Login</Text>
        <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={styles.input.color}
                value={text}
                onChangeText={setText}
              />
        <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={styles.input.color}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />

        <Pressable
            onPress={() => submit(text, password)} 
            style={styles.buttonPrimary}
            >
            <Text style={styles.text}>Submit</Text>
        </Pressable>
    
    </View>
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
    backgroundColor: '#151718'
  },
  header: {
      color:"#fff",
      fontSize: 28,
      fontWeight: "700"
  },
  placeholder: {
    color: "#fff",
  },
  input: {
    height: 40,
    color: "#fff",
    borderColor: 'gray',
    borderWidth: 1,
    minWidth: "60%",
    paddingHorizontal: 10,
    borderRadius: 8,
    margin: 4,
  },
  buttonPrimary: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    margin: 4,
    minWidth: "60%",
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'orange',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  
});


