
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, FlatList, KeyboardAvoidingView, KeyboardAvoidingViewComponent } from 'react-native';
import Menu from './menu';
import { Note } from './note'
import { NoteModel, UserModel, UserModelDto } from './model';
import { API_URL } from '@/paths';
import CreateNote from './createNote';



type EditNoteModel =  {
    noteModel: NoteModel
}
export default function EditNote({navigation, route} : any) {


    return (
        <>
            <Text>{route.params.noteModel}</Text>
        </>
    )

}
