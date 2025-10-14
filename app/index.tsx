import { Image, StyleSheet } from "react-native";

import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as encoding from "text-encoding";
import { Homepage } from "../src/features/homepage";
import { Login } from "../src/features/login";

export default function MainScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    _checkLoginStatus();
  }, []);

  const _checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setLoading(false);
    } else {
      setIsLoggedIn(false);
    }
  };

  return <>{isLoggedIn ? <Homepage /> : <Login />}</>;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  darkTheme: {
    flex: 1, // Makes the view take the whole screen
    justifyContent: "center", // Centers the content vertically
    alignItems: "center", // Centers the content horizontally
  },
  header: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
