import { FontAwesome5 } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type EditActionProps = {
  type: string;
  icon: string;
  name: string;
};

export default function EditNoteAction({ type, icon, name }: EditActionProps) {
  const doAction = (type: string) => {
    console.log(type);
  };

  return (
    <Pressable
      onPress={() => doAction(type)}
      style={({ pressed }) => [
        styles.pillContainer,
        pressed && styles.pillContainerPressed,
      ]}
    >
      {({ pressed }) => (
        <FontAwesome5
          name={icon}
          size={20}
          color={pressed ? "#6e6e6e" : "#fff"}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pillContainer: {
    backgroundColor: "#3d3d3d",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    width: 80,
    borderRadius: 15,
    borderColor: "#6e6e6e",
    borderStyle: "solid",
    borderWidth: 0.5,
  },
  pillContainerPressed: {
    backgroundColor: "#2d2d2d",
  },
  iconColor: {
    color: "#fff",
  },
  iconColorPressed: {
    color: "#6e6e6e",
  },
});
