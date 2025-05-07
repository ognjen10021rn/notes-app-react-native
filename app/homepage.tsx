import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, FlatList, KeyboardAvoidingView, KeyboardAvoidingViewComponent } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Menu from './menu';
import { Note } from './note'
import { NoteModel, UserModel, UserModelDto } from './model';
import { API_URL } from '@/paths';
import CreateNote from './createNote';
import { NavigationContainer } from '@react-navigation/native';


export default function HomePage() {

    const [user, setUser] = useState<UserModelDto>({} as UserModelDto)
    const [showMenu, setShowMenu] = useState(false)
    const [showCreateNote, setShowCreateNote] = useState(false)
    const navigation = useNavigation()
    const [notes, setNotes] = useState<NoteModel[]>([])

    const [refreshing, setRefreshing] = React.useState(false);

      const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            fetchUserNotes(user)
            initialize()
          setRefreshing(false);
        }, 500);
      }, []);

    useEffect(() => {
        navigation.setOptions({headerShown: false})
        initialize()
    },[])

    const fetchUserNotes = async (usr: UserModelDto) => {
        console.log("Fetching notes for user!", usr)
        await fetch(`${API_URL}/api/v1/note/getAllNoteByUserId/${usr.userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await AsyncStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(responseData => {
            setNotes(responseData)
            console.log("Done fetching", responseData)
        }).catch(err => {
            router.replace('/login')
            console.log("Fetch userNotes err: ", err)

        })
     }

    const initialize = async () => {
        let userCredentials : string | null = await AsyncStorage.getItem('user');
        if(userCredentials != null){
            let userModel : UserModelDto = JSON.parse(userCredentials);
            setUser(userModel)
            await fetchUserNotes({username: userModel.username, userId: userModel.userId})
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
                <NavigationContainer independent={true}>
                    <Note 
                        note={item}
                    />
                </NavigationContainer>
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
              <Pressable 
                  style={styles.createNoteBtn}

                  onPress={() => setShowCreateNote(true)}
              >
                    <AntDesign name="plus" size={48} color="#fff" />                 
              </Pressable>
          </View>
          <CreateNote isShown={showCreateNote} userId={user.userId} onClose={() => setShowCreateNote(false)} />

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
      // alignItems: "flex-start",
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


