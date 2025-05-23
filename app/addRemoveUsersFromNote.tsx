import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { UserModel, UserModelDto } from "../assets/model";
import { API_URL } from '@/paths';
import AsyncStorage from "@react-native-async-storage/async-storage";


type CreateNoteProps = {
  noteId: number;
  isShown: boolean;
  userId: number;
  onClose: () => void;
};
export default function AddRemoveUsersFromNote({noteId ,isShown, userId, onClose}: CreateNoteProps){
        
    const [users, setUsers] = useState('')
    const [usersInNote, setUsersInNote] = useState<UserModelDto[]>([])
    const [usersNotInNote, setUsersNotInNote] = useState<UserModelDto[]>([])
    const [showMenu, setShowMenu] = useState(false)
    const [usersList, setUsersList] = useState<UserModelDto[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserModelDto[]>([])    
    const [addedIds, setAddedIds] = useState<number[]>([])
    const [removedIds, setRemovedIds] = useState<number[]>([])
    const slideAnim = useRef(new Animated.Value(200)).current; // Start below screen

    useEffect(() => {
      closeModal()
      if (isShown) {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        slideAnim.setValue(200); // Reset when closed
      }
      fetchUsersInNote();
      fetchUsersNotInNote();
    }, [isShown]); 


    const fetchUsersNotInNote = async () => {
        setShowMenu(true)
        console.log("Fetching users in note!")
        await fetch(`${API_URL}/api/v1/user/getAllUsersThatAreNotInNoteId/${noteId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${await AsyncStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(responseData => {
            setUsersNotInNote(responseData)
            console.log("Done fetching", responseData)
        }).catch(err => {
            console.log("Fetch userNotes err: ", err)

        })
    }
    const fetchUsersInNote = async () => {
        setShowMenu(true)
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

    const addUserToNote = (user: UserModelDto) => {
        setUsersInNote([...usersInNote, user])
        let filter = usersNotInNote.filter(val => val.username !== user.username)
        setAddedIds([...addedIds, user.userId])
        setUsersNotInNote(filter)
        let removeFltr = removedIds.filter(id => id !== user.userId)
        setRemovedIds(removeFltr)
    }
    const removeAddedUser = (user: UserModelDto) => {
        let filter = usersInNote.filter(val => val.username !== user.username)
        setUsersInNote(filter)
        setUsersNotInNote([...usersNotInNote, user])
        setRemovedIds([...removedIds, user.userId])
        let addFltr = addedIds.filter(id => id !== user.userId)
        setAddedIds(addFltr)
    }


    const submit = async () => {
        console.log(addedIds, " Added")
        console.log(removedIds, " Removed")
        if(addedIds.length > 0){
            const response = await fetch(`${API_URL}/api/v1/user/addUserToNote/${noteId}`, {
              method: "POST",
              headers: {
                "Authorization" : `Bearer ${await AsyncStorage.getItem("token")}`,
                "Content-Type" : "application/json"
              },
              body : JSON.stringify({
                userId : userId,
                userIds: addedIds
              })
            })
            console.log(response.body)
            closeModal()
            onClose()
        }
        if(removedIds.length > 0){
            const response = await fetch(`${API_URL}/api/v1/user/removeUserFromNote/${noteId}`, {
              method: "POST",
              headers: {
                "Authorization" : `Bearer ${await AsyncStorage.getItem("token")}`,
                "Content-Type" : "application/json"
              },
              body : JSON.stringify({
                userId : userId,
                userIds: removedIds
              })
            })
            console.log(response.body)
            closeModal()
            onClose()
        }
    }

    // kada se zatvara modal samo resetujemo state kada se otvori da bude fresh
    function closeModal(){
      setAddedIds([])
      setRemovedIds([])
      setShowMenu(false)
      setUsersInNote([])
      setUsersNotInNote([])
    }

    function stringTooLongPipe(str: string){
        if(str.length > 8){
           return (str.slice(8) + "...")
        }else{
            return str + "  x";
        }
    }

    return(
        <SafeAreaView>
        <Modal
          animationType="none"
          transparent={true}
          visible={isShown}
          onRequestClose={() => closeModal()}
        >
        <TouchableWithoutFeedback onPress={onClose} >
          <View style={styles.darkTheme}>
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
            <ScrollView style={styles.modalContainer}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1}}

                >
              <View style={styles.header}>
                <Text style={styles.headerText}>Manage Users</Text>
                <Ionicons name="close" size={32} color="#fff" onPress={onClose} />
              </View>

              <View style={{flex: 1}}>
                <TextInput
                        style={styles.input}
                        placeholder="Users"
                        id="searchUsers"    
                        scrollEnabled={false}
                        placeholderTextColor={styles.input.color}
                        value={users}
                        onChangeText={setUsers}
                        onFocus={() => fetchUsersNotInNote()}
                        onBlur={() => setShowMenu(true)}       
                      />
                {showMenu && (
                    <ScrollView 
                        style={styles.searchUsers}
                        keyboardShouldPersistTaps="handled"
                    >
                        { usersNotInNote.filter((item) => {
                            // console.log(filteredUsers)
                            // console.log(item)
                            return (!filteredUsers.some((usr) => usr.userId === item.userId) && 
                            (users === '' || item.username.toLowerCase().includes(users.toLowerCase())))
                        }).map( (item, index) => {
                            return(
                                <Pressable 
                                    onPress={() => addUserToNote(item)} 
                                    style={styles.usersContainter} key={index}>
                                    <Text style={styles.text}>{item.username}</Text>
                                </Pressable>
                            )
                        })}
                    </ScrollView>
                )}
                </View>
                <View style={styles.addedUsers}>
                { usersInNote.map((item, index) => {
                    return(
                        <Pressable 
                            onPress={() => removeAddedUser(item)} 
                            style={styles.addedUserItem} key={index}>
                            <Text style={styles.text}>{ stringTooLongPipe(item.username) }</Text>
                        </Pressable>
                    )
                })}
                    

                </View>
                <View style={{flex: 1}}>
                <Pressable
                    onPress={() => submit()} 
                    style={({pressed}) => [styles.buttonPrimary, {backgroundColor: pressed ? '#fff' : styles.buttonPrimary.backgroundColor}]}
                    >
                    {({ pressed }) => (
                        <Text style={[styles.text, { color: pressed ? '#151718' : styles.text.color }]}>
                          Submit
                        </Text>
                      )}
                </Pressable>
                </View>
            </ScrollView>
            </Animated.View>
            </TouchableWithoutFeedback>
          </View>
          </TouchableWithoutFeedback>
        </Modal>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
  darkTheme: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  modalContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    height: 48,
    backgroundColor: '#2b2b2b',
    color: '#fff',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
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
  buttonPrimary: {
    backgroundColor: '#FFA500',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});




