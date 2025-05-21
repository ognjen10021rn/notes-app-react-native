import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useNavigation } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image, FlatList, KeyboardAvoidingView, KeyboardAvoidingViewComponent } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Menu from './menu';
import { NoteModel, UserModel, UserModelDto } from '../assets/model';
import { API_URL } from '@/paths';
import CreateNote from './createNote';
import { NavigationContainer } from '@react-navigation/native';
import MasonryList from '@react-native-seoul/masonry-list';
import Note from './note';


export default function HomePage() {

    const [user, setUser] = useState<UserModelDto>({} as UserModelDto);
    const [showMenu, setShowMenu] = useState(false);
    const [showCreateNote, setShowCreateNote] = useState(false);
    const navigation = useNavigation();
    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [ops, setOpts] = useState<any[]>([])

      const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            // fetchUserNotes(user)
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
        if(!usr.userId){
          return
        }
        await fetch(`${API_URL}/api/v1/note/getAllNoteByUserId/${usr.userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await AsyncStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(responseData => {
            //set notes i sortiraj da bude najnovije
            // crashuje ako pokusa da sortira a prazan je 
            console.log(responseData)
            if(responseData.length > 0){
              setNotes(responseData.sort((a : NoteModel, b: NoteModel) => {
                const date1 = new Date(a.updatedAt);
                const date2 = new Date(b.updatedAt);
                return date2.getTime()-date1.getTime()
              }
            ).filter((item: NoteModel) => !item.isDeleted))
            let optss = []
            for(let note of responseData){
              optss.push({
                id: note.noteId,
                isShown: false
              })
            }
            setOpts(optss)
            }
            else{
              setNotes(responseData)
              let optss = []
              for(let note of responseData){
                optss.push({
                  id: note.noteId,
                  isShown: false
                })
              }
              setOpts(optss)
            }
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


    const refreshOnSubmit = async(showCrtNote : boolean) => {
        setShowCreateNote(showCrtNote);
        onRefresh();
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
        <View
          // ne znam zasto radi ali radi
          // kada se koristi flex 1 popuni se samo malo
          style={{flex: 10}}
        >
            <MasonryList
                data={Array.isArray(notes) ? notes : []}
                renderItem={({ item, i}) => {
                  const typedItem = item as NoteModel;

                  // setOptions([...options, option])
                  // setOpts([...ops, option])
                  // console.log(option, 2)
                  return (
                    <Note 
                      note={typedItem}
                      key={typedItem.noteId}
                      userId={user.userId}
                      onLongPress={(id) => {
                          console.log(id)
                          setOpts((prev) =>
                            prev.map((ob) => {
                              if (id < 0) {
                                return { ...ob, isShown: false };
                              }
                              return {
                                ...ob,
                                isShown: ob.id === id,
                                
                              };
                            })
                          );
                          console.log(ops)

                      }
                      }
                      showModalNote={ops.find((ele) => ele.id === typedItem.noteId)}
                    />
                  );
                }}
                keyExtractor={(item) => item.noteId.toString()}
                numColumns={2} 
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
          <CreateNote isShown={showCreateNote} userId={user.userId} onClose={() => refreshOnSubmit(false)} />

    </View>
  );
}


const styles = StyleSheet.create({
  darkTheme: {
    flex: 1,
    backgroundColor: '#151718',
    position: 'relative',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: '#101010',
  },
  headerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 24,
  },
  input: {
    height: 48,
    color: '#fff',
    backgroundColor: '#2b2b2b',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    flex: 1,
  },
  placeholder: {
    color: '#aaa',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  buttonPrimary: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  createNoteContainer: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    alignItems: 'flex-end',
    zIndex: 1,
  },
  createNoteBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFA500',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});



