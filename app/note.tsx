import { Pressable, StyleSheet, Text, View } from "react-native";
import { NoteModel } from "../assets/model";
import { router, useRouter } from "expo-router";
import { useState } from "react";
import Options from "./options";

 // TODO: Fix note compopnent so it's a default export function
 type NoteProps = {
  note: NoteModel;
  userId: number;
  onLongPress: (numberOfModals: number) => void;
  showModalNote: any;
 }
 export default function Note( {note, userId, onLongPress, showModalNote} : NoteProps) {

    // const [showModal, setShowModal] = useState(false);
    
    return (
        <View>
        {showModalNote?.isShown && (
          <Options
            isShown={showModalNote.isShown}
            userId={userId}
            noteId={note.noteId}
            onClose={() => {
              onLongPress(-1);
            }}
          />
        )}
        <Pressable
          style={({ pressed }) => [
            styles.note,
            { backgroundColor: pressed ? '#2a2a2a' : '#333' },
          ]}
          onPress={() => {
            // onLongPress(-1)
            router.push({
              pathname: '/editNote',
              params: { noteId: note.noteId, userId: userId },
            });
          }}
          onLongPress={() => {
            // setShowModal(true)
            onLongPress(note.noteId)
          }}
        >
          <Text style={styles.title}>{note.title || "Untitled"}</Text>
          <Text style={styles.content} numberOfLines={10} ellipsizeMode="tail">
            {note.content || "..."}
          </Text>
          <Text style={styles.date}>{formatDate(note.updatedAt)}</Text>
        </Pressable>
        </View>
      );
}
const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


const styles = StyleSheet.create({
    note: {
      flex: 1,
      margin: 8,
      padding: 16,
      backgroundColor: '#333',
      borderRadius: 16,
      borderColor: '#444',
      borderWidth: 1,
      shadowColor: '#000',
      shadowOffset: { width: 3, height: 4 },
      position: 'relative',
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 6,
      minHeight: 120,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: '#fff',
      marginBottom: 6,
    },
    content: {
      fontSize: 14,
      color: '#ccc',
      lineHeight: 20,
    },
    date: {
      fontSize: 12,
      color: '#888',
      marginTop: 10,
      textAlign: 'right',
    },
  });
