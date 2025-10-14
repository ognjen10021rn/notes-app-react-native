import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  Pressable,
  Image,
  Button,
} from "react-native";
import * as Linking from "expo-linking";

import { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useOAuth } from "@/hooks/useOAuth";
import { handleDeepLink, loginUser } from "@/src/features/login/api";

export default function LoginScreen() {
  const [text, setText] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    const checkInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log("Initial URL:", initialUrl);
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };
    checkInitialURL();
    const subscription = Linking.addEventListener("url", (event) => {
      console.log("URL event received:", event.url);
      handleDeepLink(event.url);
    });

    return () => subscription.remove();
  }, []);

  const submit = (username: string, password: string) => {
    let errs = [] as string[];

    setErrors([]);

    if (text.length < 4) {
      errs.push("Username can't be shorter than 4 characters.");
    }

    // if(password.length < 8){
    //     errs.push("Password can't be shorter than 8 characters.")
    // }

    setErrors(errs);

    if (errs.length > 0) {
      console.log("Nedovoljno karaktera");
      return;
    }

    loginUser(username, password);
  };

  return (
    <View style={styles.darkTheme}>
      <Text style={styles.header}>Create account/Login</Text>
      <TextInput
        style={styles.input}
        placeholder='Username'
        placeholderTextColor={styles.input.color}
        value={text}
        onChangeText={setText}
      />
      <TextInput
        style={styles.input}
        placeholder='Password'
        placeholderTextColor={styles.input.color}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Pressable
        onPress={() => submit(text, password)}
        style={({ pressed }) => [
          styles.buttonPrimary,
          {
            backgroundColor: pressed
              ? "#fff"
              : styles.buttonPrimary.backgroundColor,
          },
        ]}
      >
        {({ pressed }) => (
          <Text
            style={[
              styles.text,
              { color: pressed ? "#151718" : styles.text.color },
            ]}
          >
            Submit
          </Text>
        )}
      </Pressable>
      <Pressable onPress={async () => await useOAuth()}>
        <Text style={{ color: "#fff" }}>Github</Text>
      </Pressable>
      {errors.map((err, index) => (
        <Text key={index} style={styles.errorText}>
          {err}
        </Text>
      ))}
    </View>
  );
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
    backgroundColor: "#151718",
  },
  header: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  burger: {
    width: 16,
  },
  placeholder: {
    color: "#fff",
  },
  input: {
    height: 40,
    color: "#fff",
    borderColor: "gray",
    borderWidth: 1,
    minWidth: "60%",
    paddingHorizontal: 10,
    borderRadius: 8,
    margin: 4,
  },
  buttonPrimary: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    margin: 4,
    minWidth: "60%",
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "orange",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  errorText: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "red",
  },
});
