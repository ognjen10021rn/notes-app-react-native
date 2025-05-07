
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, FlatList, KeyboardAvoidingView, KeyboardAvoidingViewComponent } from 'react-native';
import Menu from './menu';
import { Note } from './note'
import { NoteModel, UserModel, UserModelDto } from './model';
import { API_URL } from '@/paths';
import CreateNote from './createNote';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function EditNote() {
    const { noteId } = useLocalSearchParams();
    const [note, setNote] = useState<NoteModel | null>(null);

    useEffect(() => {
        if(noteId){
            fetchNoteById(Number(noteId));
        }
    },[noteId])


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
        <>
            <Text>{note?.noteId}</Text>
        </>
    )

}
