import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type OptionsProps = {
  isShown: boolean;
  noteId: number;
  userId: number;
  onClose: () => void;
};


export default function Options({isShown, noteId, userId, onClose} : OptionsProps) {
    const copyContent = () => {
        onClose()
    }
    const deleteNote = () => {
        onClose()
    }
    const editNote = () => {
        onClose()
    }
    return (
        <View style={styles.container}>
            <View style={styles.icons}>
                <Pressable
                    onPress={() => copyContent()} 
                >
                    <MaterialIcons style={styles.icon} name="content-copy" size={24} color="white" />
                </Pressable>
                <Pressable
                    onPress={() => editNote()} 
                >
                <MaterialIcons style={styles.icon} name="edit-document" size={24} color="white" />
                </Pressable>
                <Pressable
                    onPress={() => deleteNote()} 
                >
                <MaterialIcons style={styles.icon} name="delete" size={28} color="red" />
                </Pressable>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        position: "absolute",
        display: "flex",
        left: "50%",
        borderRadius: 16,
        bottom: -5,
        transform: [
            {
                translateX: "-50%",
            },
            {
                translateY: "-50%",
            }
        ],
        backgroundColor: "#111",
        padding: 8,

        zIndex: 1
    },
    container2: {
        position: "relative"
    },
    icons: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row"
    },
    text: {
        color: "#fff"
    },
    icon: {
        margin: 4
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
})