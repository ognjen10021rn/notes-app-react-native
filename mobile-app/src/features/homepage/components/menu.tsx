import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type MenuProps = {
  isShown: boolean;
  onClose: () => void;
};
export default function Menu({ isShown, onClose }: MenuProps) {
  const slideAnim = useRef(new Animated.Value(200)).current; // Start below screen

  useEffect(() => {
    if (isShown) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(200); // Reset when closed
    }
  }, [isShown]);
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("/login/login");
    } catch (error) {
      console.log(error, "Logout error");
    }
  };

  const profile = async () => {};

  return (
    <Modal
      animationType='none'
      transparent={true}
      visible={isShown}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.darkTheme}>
          <TouchableWithoutFeedback>
            {/* <View style={styles.menu}> */}
            <Animated.View
              style={[styles.menu, { transform: [{ translateY: slideAnim }] }]}
            >
              <View style={styles.header}>
                <Text style={styles.headerText}>Menu</Text>
                <Ionicons
                  name='close'
                  size={28}
                  color='#fff'
                  onPress={onClose}
                />
              </View>

              <Pressable
                onPress={profile}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
              >
                <Feather name='user' size={20} style={styles.icon} />
                <Text style={styles.menuItemText}>Profile</Text>
              </Pressable>

              <Pressable
                onPress={logout}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
              >
                <MaterialIcons name='logout' size={20} style={styles.icon} />
                <Text style={styles.menuItemText}>Logout</Text>
              </Pressable>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  darkTheme: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  menu: {
    backgroundColor: "#282828",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },
  icon: {
    color: "#fff",
    marginRight: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemPressed: {
    backgroundColor: "#3a3a3a",
  },
  menuItemText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
});
