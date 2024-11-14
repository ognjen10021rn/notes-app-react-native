import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { NoteModel } from "./model";


export const Note: React.FC<{ note: NoteModel }> = ({ note }) => {

  return (
    <>
        <View style={styles.note}>
            <Text style={styles.headerText}>{note.title}</Text> 
            <Text style={styles.content} numberOfLines={10} ellipsizeMode="tail">{note.content}</Text> 
            <Text style={styles.date}>{note.updatedAt}</Text>
        </View>
    </>
  );
}

const styles = StyleSheet.create({
    note:{
        flex: 1,
        margin: 8,
        padding: 16,
        backgroundColor: '#333',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        minHeight: 80,
    },
    darkTheme: {
        flex: 1,
        backgroundColor: '#151718'
    },
    content:{
        fontSize: 14,
        color: '#ccc',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    
    date: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 8,
      },  
});
