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
