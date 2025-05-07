
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, FlatList, KeyboardAvoidingView, KeyboardAvoidingViewComponent, TextInput } from 'react-native';
import Menu from './menu';
import { Note } from './note'
import { NoteModel, UserModel, UserModelDto } from './model';
import { API_URL } from '@/paths';
import CreateNote from './createNote';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function EditNote() {
    const { noteId } = useLocalSearchParams();
    const [note, setNote] = useState<NoteModel | null>(null);
    const [value, onChangeText] = useState(note?.content);
    const navigation = useNavigation();

    useEffect(() => {
        if(noteId){
            fetchNoteById(Number(noteId));
        }
        navigation.setOptions({title: "Notes"})
        
    },[noteId])

    const datePipe = ((str : string | undefined) => {
        if(str){
            return format(str, 'HH:mm | dd.MM.yy')
        }
    })

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
        <View style={styles.darkTheme}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{note?.title}</Text> 
                <Text style={styles.text}>{datePipe(note?.updatedAt)}</Text> 
            </View>
            <TextInput
                editable
                multiline
                maxLength={1024}
                textAlignVertical='top'
                onChangeText={text => onChangeText(text)}
                value={value}
                style={styles.textInput}
            />

        </View>

    )

}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    paddingHorizontal: 8,
    paddingBottom: 80,
  },
  createNoteContainer: {
    display: "flex",
    zIndex: 1,
    position: "absolute",
    bottom: "5%",
    right: "5%",
    alignItems: "flex-end",
  },
  createNoteBtn: {
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "orange",
    width: 80,
    height: 80

  },
  darkTheme: {
    flex: 1,
    backgroundColor: '#151718',
    position: "relative"
  },
  header: {
      display: "flex",
      alignItems: "center",
      paddingTop: "15%",
      paddingLeft: "5%",
      paddingRight: "5%",
      paddingBottom: "5%",
      justifyContent: "space-between",
      backgroundColor: "#101010",
      flexDirection: "row",
  },
  row: {
    justifyContent: 'space-between',
  },
  headerText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 24
  },
  placeholder: {
    color: "#fff",
  },
  textInput: {
    padding: 10,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.25,
    color: 'white',
    flex: 1,
    fontSize: 16,
    alignItems: 'stretch',
    textAlignVertical: 'top',
    backgroundColor: "#333",
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
    minWidth: "30%",
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'orange',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '300',
    letterSpacing: 0.25,
    color: 'white',
  },
  
});
