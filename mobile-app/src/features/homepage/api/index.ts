import { UserModelDto } from "@/src/features/types/user-model";
import { API_URL } from "@/paths";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Note, NoteModel } from "../../note/types";

export class FetchUsersError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "FetchUsersError";
  }
}

export async function fetchUserNotes(usr: UserModelDto): Promise<NoteModel[]> {
  try {
    const response = await fetch(
      `${API_URL}/api/v1/note/getAllNoteByUserId/${usr.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.log(
        "Error in fetching notes: " + errorText + " " + response.status
      );
    }

    const responseData = await response.json();
    return responseData as NoteModel[];
  } catch (error) {
    router.replace("/login/login");
    if (error instanceof FetchUsersError) {
      throw error;
    }
    throw new FetchUsersError(
      error instanceof Error ? error.message : "An unknown error occured"
    );
  }
}
