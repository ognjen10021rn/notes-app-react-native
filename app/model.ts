export interface NoteModel {
  noteId: number;
  title: string;
  adminId: number;
  content: string;
  isLocked: boolean;
  createdAt: string; // Use `string` for ISO date format from API, can be `Date` if parsed
  updatedAt: string;
  version: number;
}
export interface UserModel {
  id: number;
  username: string;
}

export interface UserModelDto {
  userId: number;
  username: string;
}
export interface EditNoteDto {
  noteId?: number;
  userId?: number,
  title?: string,
  content?: string;
  username: string;
}

export interface Note {
  noteId: string;
  content: string;
}