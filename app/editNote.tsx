
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, FlatList, KeyboardAvoidingView, KeyboardAvoidingViewComponent, TextInput, Platform, ScrollView } from 'react-native';
import Menu from './menu';
import { EditNoteDto, Note, NoteModel, UserModel, UserModelDto } from '../assets/model';
import { API_URL, WEB_SOCKET_URL } from '@/paths';
import CreateNote from './createNote';
import { format } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import websocketService from './webSockets';
import { FontAwesome6 } from '@expo/vector-icons';
import UserHeader from './userHeader';
import UserAvatars from './userAvatars';
import AddRemoveUsersFromNote from './addRemoveUsersFromNote';


export default function EditNote() {
    const { noteId } = useLocalSearchParams();
    const { userId } = useLocalSearchParams();
    const [note, setNote] = useState<NoteModel | null>(null);
    const navigation = useNavigation();
    const [showMenu, setShowMenu] = useState(false)
    const [usersList, setUsersList] = useState<UserModelDto[]>([])
    const [usersInNote, setUsersInNote] = useState<UserModelDto[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserModelDto[]>([])    
    const [users, setUsers] = useState('')

    useEffect(() => {
      websocketService.connect(noteId, (newNote : NoteModel) => {
          // console.log(newNote, "stigao je novi note")
          setNote(newNote)
      });
  
      return () => {
        websocketService.disconnect();
        console.log("return")
      };
    }, []);

    useEffect(() => {
        if(noteId){
            fetchNoteById(Number(noteId));
        }

        navigation.setOptions({title: "Notes"})
        
        fetchUsersInNote()
    },[noteId])

    const datePipe = ((str : string | undefined) => {
        if(str){
            return format(str, 'do MMM yyyy HH:mm')
        }
    })

    const submit = async () => {
        if(!note){
          return;
        }
        console.log(note)
        const payload: EditNoteDto = {
          noteId: Number(noteId),
          content: note?.content,
          title: note?.title,
          userId: Number(userId)

        };
    
        websocketService.sendMessage(payload);


    }
    const fetchUsersInNote = async () => {
        // setShowMenu(true)
        console.log("Fetching users not in note!")
        await fetch(`${API_URL}/api/v1/user/getAllUsersFromNoteUsingNoteId/${noteId}/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await AsyncStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(responseData => {
            setUsersInNote(responseData)
            console.log("Done fetching", responseData)
        }).catch(err => {
            console.log("Fetch userNotes err: ", err)

        })
    }

    const back = (() => {
        // TODO: add back
        console.log("back")
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

    const fetchUsers = async () => {
        setShowMenu(true)
        console.log("Fetching users")
        await fetch(`${API_URL}/api/v1/user/getAllUsersWithoutId/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await AsyncStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(responseData => {
            setUsersList(responseData)
            console.log("Done fetching", responseData)
        }).catch(err => {
            console.log("Fetch userNotes err: ", err)

        })
    }

    const refreshMenu = async () => {
      setShowMenu(false)
      fetchUsersInNote()

    }
    return (

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
      >

      <View style={styles.darkTheme}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>{note?.title || "Untitled"}</Text>
            <Text style={styles.dateText}>{datePipe(note?.updatedAt)}</Text>
          </View>
          <View>
            <UserAvatars 
              users={usersInNote}
              onAddUser={() => {
                fetchUsers()
                setShowMenu(!showMenu)
              }}
              onRemoveUser={() => console.log("removed")}
            />
            {/* <FontAwesome6 name="user-plus" size={16} color="#fff" /> */}



          </View>
        </View>
        <View style={styles.contentContainer}>
          <TextInput
            editable
            multiline
            maxLength={1024}
            textAlignVertical="top"
            onChangeText={(newContent) =>
              setNote((prev) => (prev ? { ...prev, content: newContent } : null))
            }
            value={note?.content || ""}
            style={styles.textInput}
            placeholder="Tell me a note"
            placeholderTextColor="#888"
          />
        </View>
          <View style={styles.buttonGroup}>
            <Pressable onPress={submit} style={({ pressed }) => [
              styles.buttonPrimary,
              pressed && styles.buttonPressed
            ]}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
      
            <Pressable onPress={back} style={({ pressed }) => [
              styles.buttonSecondary,
              pressed && styles.buttonPressedSecondary
            ]}>
              <Text style={styles.buttonText}>Back</Text>
            </Pressable>
          </View>
          </View>
            <AddRemoveUsersFromNote 
              onClose={() => refreshMenu()}
              isShown={showMenu}
              userId={Number(userId)}
              noteId={Number(noteId)}
            />
      </KeyboardAvoidingView>  
    );
    

}

const styles = StyleSheet.create({
  darkTheme: {
    flex: 1,
    backgroundColor: '#151718',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 24,
  },
  dateText: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#262626",
    padding: 16,
    borderRadius: 4,
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: "orange",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: "#ffcc80",
  },
  buttonPressedSecondary: {
    backgroundColor: "#555",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  addedUsers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    gap: 8,
  },
  addedUserItem: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  searchUsers: {
    maxHeight: 150,
    backgroundColor: '#2c2c2c',
    borderRadius: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  usersContainter: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
});

