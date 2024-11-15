import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Menu from './menu';
import { Note } from './note'
import { NoteModel, UserModel } from './model';
import { API_URL } from '@/paths';


export default function HomePage() {

    const [user, setUser] = useState<UserModel>({} as UserModel)
    const [showMenu, setShowMenu] = useState(false)
    const navigation = useNavigation()
    const [notes, setNotes] = useState<NoteModel[]>([])

    const [refreshing, setRefreshing] = React.useState(false);

      const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchUserNotes()
        setTimeout(() => {
          setRefreshing(false);
        }, 500);
      }, []);



    const fetchUserNotes = async () => {
        console.log("Fetching notes for user!")
        const response = await fetch(`${API_URL}/api/v1/note/getAllNoteByUserId/${user.id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await AsyncStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(responseData => {
            setNotes(responseData)
        }).catch(err => {
            console.log("Fetch userNotes err: ", err)

        })
        // if(response.ok){
        //     throw new Error(response.status.toString())
        // }
        //
        // response.json().then(res => {
        //     setNotes(res)
        //     console.log("Done fetching!")
        // })

     }

     // const notes2: NoteModel[] = [
     //  {
     //    noteId: 1,
     //    title: 'My First Note',
     //    adminId: 123,
     //    content: 'This is the content of the first noteeeeeeeeeeeeeeeeeeeeeeeeeeeee.\n aaaaaaaaaaa\naaa\na\na\na\na\na\na\na\na\na\na\na\na',
     //    isLocked: false,
     //    createdAt: '2024-11-14T12:34:56Z',
     //    updatedAt: '2024-11-14T14:56:00Z',
     //    version: 1,
     //  },
     //  {
     //    noteId: 2,
     //    title: 'Second Note',
     //    adminId: 124,
     //    content: 'This is the content of the second note.',
     //    isLocked: true,
     //    createdAt: '2024-11-13T10:20:30Z',
     //    updatedAt: '2024-11-14T15:00:00Z',
     //    version: 2,
     //  },
     //  {
     //    noteId: 3,
     //    title: 'Third Note',
     //    adminId: 124,
     //    content: 'This is the content of the first noteeeeeeeeeeeeeeeeeeeeeeeeeeeee.\n aaaaaaaaaaa\naaa\na\na\na\na\na\na\na\na\na\na\na\na',
     //    isLocked: true,
     //    createdAt: '2024-11-13T10:20:30Z',
     //    updatedAt: '2024-11-14T15:00:00Z',
     //    version: 2,4
     //  },
     //  {
     //    noteId: 4,
     //    title: 'Fourth Note',
     //    adminId: 124,
     //    content: 'This is the content of the second note.',
     //    isLocked: true,
     //    createdAt: '2024-11-13T10:20:30Z',
     //    updatedAt: '2024-11-14T15:00:00Z',
     //    version: 2,
     //  },
     //  {
     //    noteId: 5,
     //    title: 'Fifth Note',
     //    adminId: 124,
     //    content: 'This is the content of the first noteeeeeeeeeeeeeeeeeeeeeeeeeeeee.\n aaaaaaaaaaa\naaa\na\na\na\na\na\na\na\na\na\na\na\na',
     //    isLocked: true,
     //    createdAt: '2024-11-13T10:20:30Z',
     //    updatedAt: '2024-11-14T15:00:00Z',
     //    version: 2,
     //  },
     //  {
     //    noteId: 6,
     //    title: 'Sixth Note',
     //    adminId: 124,
     //    content: 'This is the content of the second note.',
     //    isLocked: true,
     //    createdAt: '2024-11-13T10:20:30Z',
     //    updatedAt: '2024-11-14T15:00:00Z',
     //    version: 2,
     //  },
     //  {
     //    noteId: 7,
     //    title: 'Seventh Note',
     //    adminId: 124,
     //    content: 'This is the content of the second note.',
     //    isLocked: true,
     //    createdAt: '2024-11-13T10:20:30Z',
     //    updatedAt: '2024-11-14T15:00:00Z',
     //    version: 2,
     //  },
      // {
      //   noteId: 8,
      //   title: 'Seventh Note',
      //   adminId: 124,
      //   content: 'This is the content of the first noteeeeeeeeeeeeeeeeeeeeeeeeeeeee.\n aaaaaaaaaaa\naaa\na\na\na\na\na\na\na\na\na\na\na\na',
      //   isLocked: true,
      //   createdAt: '2024-11-13T10:20:30Z',
      //   updatedAt: '2024-11-14T15:00:00Z',
      //   version: 2,
      // },
    // ];   
    useEffect(() => {
        navigation.setOptions({headerShown: false})
        usr()
        fetchUserNotes()
    },[])

    const usr = async () => {
        let tkn = await AsyncStorage.getItem('token')
        let usr : any | undefined
        if(tkn != undefined){
            usr = parseJwt(tkn) 
        }else{
            router.replace('/login')
        }
        try{
            setUser(usr)
        }catch(e){
            console.log(e, "Homepage err")
        }
    }

  // parsing token so it returns an object with user info
    function parseJwt (token: string): any | undefined{
        try{
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
        console.log("usao")

        return JSON.parse(atob(paddedBase64));
        }catch(e) {
            console.log(e, "Homepage err: ", token)
        }
    }

  return (
    <View style={styles.darkTheme}>
        <View style={styles.header}>
            <Text style={styles.headerText}>Welcome {user.username}!</Text> 
           <Ionicons
                onPress={() => setShowMenu(true)}
                name="menu" 
                size={32} color="white"
           />
           <Menu isShown={showMenu} onClose={() => setShowMenu(false)}/>
        </View>
        <View>
            <FlatList 
                data={notes}
                renderItem={({ item }) => 
                    <Pressable
                        style={({pressed}) => [{backgroundColor: pressed ? '#fff' : styles.buttonPrimary.backgroundColor}]}
                    >
                    <Note 
                        note={item}
                    />
                    </Pressable>

                }
                keyExtractor={(item) => item.noteId.toString()}
                numColumns={2} 
                columnWrapperStyle={styles.row}
                  contentContainerStyle={styles.container}
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                showsVerticalScrollIndicator={true}
              />
          </View>
          <View style={styles.createNoteContainer}>
              <Pressable style={styles.createNoteBtn}>
                 
              </Pressable>
          </View>
    </View>
  );
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
    position: "absolute",
    bottom: "5%",
    right: "5%",
    alignItems: "flex-end",
  },
  createNoteBtn: {
    borderRadius: "50%",
    backgroundColor: "#fff",
    width: 80,
    height: 80

  },
  darkTheme: {
    flex: 1,
    backgroundColor: '#151718'
  },
  header: {
      display: "flex",
      // alignItems: "flex-start",
      paddingTop: "5%",
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
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  
});


