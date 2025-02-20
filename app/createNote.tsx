import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { UserModel, UserModelDto } from "./model";
import { API_URL } from '@/paths';
import AsyncStorage from "@react-native-async-storage/async-storage";


type CreateNoteProps = {
  isShown: boolean;
  userId: number;
  onClose: () => void;
};
export default function CreateNote({isShown, userId, onClose}: CreateNoteProps){
        
    const [title, setTitle] = useState('')
    const [users, setUsers] = useState('')
    const [showMenu, setShowMenu] = useState(false)
    const [usersList, setUsersList] = useState<UserModelDto[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserModelDto[]>([])    

    useEffect(() => {
        // fetchUsers()

    },[userId, isShown])


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

    const addUserToNote = (user: UserModelDto) => {
        setFilteredUsers([...filteredUsers, user])
    }
    const removeAddedUser = (user: UserModelDto) => {
        setFilteredUsers([...filteredUsers, user])
    }


    const submit = async (titl : string) => {
        console.log(userId, await AsyncStorage.getItem('token'))
        console.log(titl, filteredUsers.map(user => user.userId))
        await fetch(`${API_URL}/api/v1/note/createNote/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization' : `Bearer ${await AsyncStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: titl,
                userIds: filteredUsers.map(user => user.userId)
                
            })
        })
        .then(res => res.json())
        .then(responseData => {
            console.log(responseData, "Create note data")
            setFilteredUsers([])
            setUsersList([])
            setTitle('')
        })
        .catch(err => {
            console.log(err, "Create note error!")
        })
    }

    function stringTooLongPipe(str: string){
        if(str.length > 8){
           return (str.slice(8) + "...")
        }else{
            return str;
        }
    }

    return(
        <SafeAreaView style={{flex: 1}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isShown}
          onRequestClose={onClose}
        >
        <TouchableWithoutFeedback onPress={onClose} >
          <View style={styles.darkTheme}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
            <ScrollView style={styles.modalContainer}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1}}

                >
              <View style={styles.header}>
                <Text style={styles.headerText}>Create Note</Text>
                <Ionicons name="close" size={32} color="#fff" onPress={onClose} />
              </View>

              <View style={{flex: 1}}>
                <TextInput
                        style={styles.input}
                        placeholder="Title"
                        placeholderTextColor={styles.input.color}
                        scrollEnabled={false}
                        value={title}
                        onChangeText={setTitle}
                        onFocus={() => setShowMenu(false)}
                        onBlur={() => setShowMenu(true)}
                      />
                <TextInput
                        style={styles.input}
                        placeholder="Users"
                        id="searchUsers"    
                        scrollEnabled={false}
                        placeholderTextColor={styles.input.color}
                        value={users}
                        onChangeText={setUsers}
                        onFocus={() => fetchUsers()}
                        onBlur={() => setShowMenu(true)}       
                      />
                {showMenu && (
                    <ScrollView 
                        style={styles.searchUsers}
                        keyboardShouldPersistTaps="handled"
                    >
                        { usersList.filter((item) => {
                            console.log(filteredUsers)
                            console.log(item)
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
                { filteredUsers.map((item, index) => {
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
                    onPress={() => submit(title)} 
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
            </View>
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5%"
  },

  modalContainer: {
      flex: 1,
  },
  container: {
    backgroundColor: "#282828",
    flex: 1,
    borderRadius: 8,
    width:"80%",
    minHeight: "60%",
    maxHeight: "70%",
    padding: 12,
    
  },
  searchUsers: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 4,
    height: 30,
    // minHeight: "20%",
    maxHeight: "60%",
    backgroundColor: "#181818",
    padding: 4,
    borderRadius: 8

  },
  usersContainter: {
    padding: 4,
    borderColor: "red",
  },
  addedUserItem: {
    padding: 4,
    maxWidth: "35%",
  },

  addedUsers: {
    padding: 4,
    display: "flex",
    maxHeight: "20%",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "black",
    
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
  header: {
    borderWidth: 1,
    borderColor: "#282828",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8
  },
  icon: {
    color: "white",
  },
  headerText: {
      fontSize: 24,
      color: "#fff",
      fontWeight: "500"
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
  text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.25,
    color: 'white',
    marginVertical: 8
  }
})



