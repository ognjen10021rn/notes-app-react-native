import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
// import Clipboard from '@react-native-clipboard/clipboard';
import { API_URL } from "@/paths";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NoteModel } from "@/assets/model";
// import Clipboard from '@react-native-clipboard/clipboard';
import * as Clipboard from 'expo-clipboard';
import { router } from "expo-router";

type OptionsProps = {
  isShown: boolean;
  noteId: number;
  userId: number;
  onClose: () => void;
};


export default function Options({isShown, noteId, userId, onClose} : OptionsProps) {
    
    const [note, setNote] = useState<NoteModel | null>(null)

    useEffect(() => {
        fetchNoteById(noteId)
    }, [note])

    //done
    const copyContent = async() => {
        if (note?.content) {
            Clipboard.setStringAsync(note.content);
            const noteText = await Clipboard.getStringAsync();
            console.log('Copied note content:', noteText);
        }
        onClose();
    }
    const deleteNote = () => {
        // refreshaj stranicu
        deleteNoteById(noteId)
        onClose();
    }
    const editNote = () => {

        router.push({
            pathname: '/editNote',
            params: { noteId: noteId, userId: userId },
        });
        onClose();
    }

    
    const deleteNoteById = async (noteId: number) => {
        const response = await fetch(`${API_URL}/api/v1/note/deleteNoteById/${noteId}`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${await AsyncStorage.getItem("token")}`
            }
        });
        let res = await response.json();
        console.log(res)
    }
    const fetchNoteById = async (noteId: number) => {
        const response = await fetch(`${API_URL}/api/v1/note/getNoteById/${noteId}`, {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${await AsyncStorage.getItem("token")}`
            }
        });
        let res = await response.json();
        if(res){
            setNote(res)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={onClose} >
        <View style={styles.container}>
            <TouchableWithoutFeedback>
            <View style={styles.icons}>
                <Pressable
                    onPress={copyContent} 
                >
                    <MaterialIcons style={styles.icon} name="content-copy" size={24} color="white" />
                </Pressable>
                <Pressable
                    onPress={() => editNote()} 
                >
                <MaterialIcons style={styles.icon} name="edit-document" size={24} color="white" />
                </Pressable>
                <Pressable
                    onPress={() => deleteNote()} 
                >
                <MaterialIcons style={styles.icon} name="delete" size={28} color="red" />
                </Pressable>
            </View>
            </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
    )
}


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        display: "flex",
        left: "50%",
        borderRadius: 16,
        bottom: -5,
        transform: [
            {
                translateX: "-50%",
            },
            {
                translateY: "-50%",
            }
        ],
        backgroundColor: "#111",
        padding: 8,

        zIndex: 1
    },
    container2: {
        position: "relative"
    },
    icons: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    text: {
        color: "#fff"
    },
    icon: {
        margin: 4
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
})