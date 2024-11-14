import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Modal, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";


type MenuProps = {
  isShown: boolean;
  onClose: () => void;
};
export default function Menu({isShown, onClose}: MenuProps){
    
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            router.replace('/login');
        } catch (error) {
            console.log(error, "Logout error")
        }
    }

    const profile = async () => {

    }

return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isShown}
      onRequestClose={onClose}
    >
    <TouchableWithoutFeedback onPress={onClose} >
      <View style={styles.darkTheme}>
      <TouchableWithoutFeedback>
        <View style={styles.menu}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Menu</Text>
            <Ionicons name="close" size={32} color="#fff" onPress={onClose} />
          </View>
        <Pressable
            onPress={() => profile()} 
            >
                {({ pressed }) => (
                <Text style={[styles.text, { color: pressed ? styles.buttonPrimary.backgroundColor : styles.text.color }]}>
                <Feather name="user" size={16} style={[styles.icon, {color: pressed ? styles.buttonPrimary.backgroundColor: styles.icon.color}]} />
                  Profile
                </Text>
              )}
        </Pressable>
        <Pressable
            onPress={() => logout()} 
            >
            {({ pressed }) => (
                <Text style={[styles.text, { color: pressed ? styles.buttonPrimary.backgroundColor : styles.text.color }]}>
                <MaterialIcons name="logout" size={16} style={[styles.icon, {color: pressed ? styles.buttonPrimary.backgroundColor: styles.icon.color}]} />
                  Logout
                </Text>
              )}
        </Pressable>
        </View>
        </TouchableWithoutFeedback>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
  );


}
const styles = StyleSheet.create({
  darkTheme: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: "5%"
  },
  menu: {
    backgroundColor: "#282828",
    borderRadius: 8,
    width:"90%",
    height: "60%",
    padding: 12,
    
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginVertical: 8
  },
  icon: {
    color: "white",
  },
  headerText: {
      fontSize: 24,
      color: "#fff",
      fontWeight: "500"
  },
  buttonPrimary: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    margin: 4,
    minWidth: "30%",
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'orange',
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.25,
    color: 'white',
    marginVertical: 8
  }
});
