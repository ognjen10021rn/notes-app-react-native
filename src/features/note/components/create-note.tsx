import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { API_URL } from "@/paths";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserModelDto } from "@/src/features/types/user-model";
import { createNote, fetchUsersWithoutUserId } from "../api/intex";

type CreateNoteProps = {
  isShown: boolean;
  userId: number;
  onClose: () => void;
};
export default function CreateNote({
  isShown,
  userId,
  onClose,
}: CreateNoteProps) {
  const [title, setTitle] = useState("");
  const [users, setUsers] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [usersList, setUsersList] = useState<UserModelDto[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserModelDto[]>([]);
  const slideAnim = useRef(new Animated.Value(200)).current; // Start below screen

  useEffect(() => {
    if (isShown) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(200);
    }
  }, [isShown]);

  /**
   * Fetching all users without the note creator
   */
  const fetchUsers = async () => {
    setShowMenu(true);
    let usersWithoutId = await fetchUsersWithoutUserId(userId);
    setUsersList(usersWithoutId);
  };

  /**
   *
   * @param user User to add to the note
   */
  const addUserToNote = (user: UserModelDto) => {
    setFilteredUsers([...filteredUsers, user]);
  };

  /**
   *
   * @param user Removing the user from the list
   */
  const removeAddedUser = (user: UserModelDto) => {
    let filter = filteredUsers.filter((val) => val.username !== user.username);
    setFilteredUsers(filter);
  };

  /**
   * Create note with the current user being the amdin and user ids that need to be added
   * @param title Title for note
   */
  const submit = async (title: string) => {
    console.log("ovde1?");
    let userIds = filteredUsers.map((user) => user.userId);
    let createNoteResponse = await createNote(userId, title, userIds);
    console.log("ovde?");
    setFilteredUsers([]);
    setUsersList([]);
    setTitle("");
    setShowMenu(false);
    onClose();

    // await fetch(`${API_URL}/api/v1/note/createNote/${userId}`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     title: titl,
    //     userIds: filteredUsers.map((user) => user.userId),
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((responseData) => {
    //     console.log(responseData, "Create note data");
    //     setFilteredUsers([]);
    //     setUsersList([]);
    //     setTitle("");
    //     setShowMenu(false);
    //     onClose();
    //   })
    //   .catch((err) => {
    //     console.log(err, "Create note error!");
    //     setFilteredUsers([]);
    //     setUsersList([]);
    //     setTitle("");
    //     setShowMenu(false);
    //     // stavlja funkciju da pokazuje na void pa se zatvori
    //     onClose();
    //   });
  };

  function stringTooLongPipe(str: string) {
    if (str.length > 8) {
      return str.slice(8) + "...";
    } else {
      return str + "  x";
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        animationType='none'
        transparent={true}
        visible={isShown}
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.darkTheme}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.container,
                  { transform: [{ translateY: slideAnim }] },
                ]}
              >
                <ScrollView
                  style={styles.modalContainer}
                  keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  <View style={styles.header}>
                    <Text style={styles.headerText}>Create Note</Text>
                    <Ionicons
                      name='close'
                      size={32}
                      color='#fff'
                      onPress={onClose}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={styles.input}
                      placeholder='Title'
                      placeholderTextColor={styles.input.color}
                      scrollEnabled={false}
                      value={title}
                      onChangeText={setTitle}
                      onFocus={() => setShowMenu(false)}
                      onBlur={() => setShowMenu(true)}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder='Users'
                      id='searchUsers'
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
                        keyboardShouldPersistTaps='handled'
                      >
                        {usersList
                          .filter((item) => {
                            console.log(filteredUsers);
                            console.log(item);
                            return (
                              !filteredUsers.some(
                                (usr) => usr.userId === item.userId
                              ) &&
                              (users === "" ||
                                item.username
                                  .toLowerCase()
                                  .includes(users.toLowerCase()))
                            );
                          })
                          .map((item, index) => {
                            return (
                              <Pressable
                                onPress={() => addUserToNote(item)}
                                style={styles.usersContainter}
                                key={index}
                              >
                                <Text style={styles.text}>{item.username}</Text>
                              </Pressable>
                            );
                          })}
                      </ScrollView>
                    )}
                  </View>
                  <View style={styles.addedUsers}>
                    {filteredUsers.map((item, index) => {
                      return (
                        <Pressable
                          onPress={() => removeAddedUser(item)}
                          style={styles.addedUserItem}
                          key={index}
                        >
                          <Text style={styles.text}>
                            {stringTooLongPipe(item.username)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Pressable
                      onPress={() => submit(title)}
                      style={({ pressed }) => [
                        styles.buttonPrimary,
                        {
                          backgroundColor: pressed
                            ? "#fff"
                            : styles.buttonPrimary.backgroundColor,
                        },
                      ]}
                    >
                      {({ pressed }) => (
                        <Text
                          style={[
                            styles.text,
                            { color: pressed ? "#151718" : styles.text.color },
                          ]}
                        >
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
  );
}

const styles = StyleSheet.create({
  darkTheme: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  modalContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    height: 48,
    backgroundColor: "#2b2b2b",
    color: "#fff",
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchUsers: {
    maxHeight: 150,
    backgroundColor: "#2c2c2c",
    borderRadius: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  usersContainter: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomColor: "#444",
    borderBottomWidth: 1,
  },
  addedUsers: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    gap: 8,
  },
  addedUserItem: {
    backgroundColor: "#ff9800",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  buttonPrimary: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
