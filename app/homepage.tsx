import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StyleSheet, View, Text, Pressable } from 'react-native';


export default function HomePage() {
     const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');

      router.replace('/login');

    } catch (error) {
    }
  };

  return (
    <View style={styles.darkTheme}>
        <Text style={styles.header}>HomePage</Text> 
        <Pressable
            onPress={() => logout()} 
            style={styles.buttonPrimary}
            >
            <Text style={styles.text}>Logout</Text>
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


