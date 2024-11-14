import { StyleSheet, View, Text, TextInput, Alert, Pressable, Image } from 'react-native';

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import { API_URL } from '../paths'

export default function LoginScreen() {
    

    const [text, setText] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<string[]>([]);
    const navigation = useNavigation()
    useEffect(() => {
        navigation.setOptions({headerShown: false})
    })

    const submit = async (text: string, password: string) => {

        try {
            let errs = [] as string[]
            setErrors([])
            if(text.length < 4){
                errs.push("Username can't be shorter than 4 characters.") 
            }       
            if(password.length < 8){
                errs.push("Password can't be shorter than 8 characters.") 
            }       
            setErrors(errs)
            if(errs.length > 0){
                console.log("Nedovoljno karaktera")
                return
            }
          const response = await fetch(`${API_URL}/api/v1/user/auth/login`, {
            
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: text,
              password: password,
            }),
          });
          console.log(response.json)
          if (!response.ok) {
            throw new Error('Login failed');
          }

          const tkn = await response.json();
          await AsyncStorage.setItem('token', tkn.token);

          Alert.alert('Success', 'Logged in successfully!');

          router.replace('/homepage');

        } catch (error) {
            console.log(error, "Login screen")
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
            style={({pressed}) => [styles.buttonPrimary, {backgroundColor: pressed ? '#fff' : styles.buttonPrimary.backgroundColor}]}
            >
            {({ pressed }) => (
                <Text style={[styles.text, { color: pressed ? '#151718' : styles.text.color }]}>
                  Submit
                </Text>
              )}
        </Pressable>
        {errors.map((err, index) => (
            <Text key={index} style={styles.errorText}>{err}</Text>
        ))}
    
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

  burger: {
      width: 16
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
  errorText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: 'red',
  },
  
});


