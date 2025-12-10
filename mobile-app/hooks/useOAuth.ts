import { API_URL } from "@/paths";
import { Linking } from "react-native";

export async function useOAuth() {
  const url = `${API_URL}/oauth2/authorization/github`;
  console.log("Opening OAuth URL:", url);

  try {
    const canOpen = await Linking.canOpenURL(url);
    console.log("Can open URL:", canOpen);
    await Linking.openURL(url);
  } catch (e) {
    console.error("Error opening URL:", e);
  }
}
