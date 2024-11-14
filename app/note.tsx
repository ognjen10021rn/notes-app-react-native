import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function Note(){

  return (
    <>
        <View style={styles.container}>
            <Text style={styles.headerText}>Note</Text> 
        </View>
    </>
  );
}

const styles = StyleSheet.create({
    container:{
        width: "40%",
        height: 300,
        backgroundColor: "#101010"
    },
    darkTheme: {
        flex: 1,
        backgroundColor: '#151718'
    },
    header: {
      display: "flex",
      // alignItems: "flex-start",
      paddingTop: "15%",
      paddingLeft: "5%",
      paddingRight: "5%",
      paddingBottom: "5%",
      justifyContent: "space-between",
      backgroundColor: "#101010",
      flexDirection: "row",
    },
    headerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 24
    },
    text: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    },
  
});
