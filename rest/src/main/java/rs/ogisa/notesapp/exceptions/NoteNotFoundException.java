package rs.ogisa.notesapp.exceptions;

import rs.ogisa.notesapp.models.Note;

public class NoteNotFoundException extends RuntimeException {

    public NoteNotFoundException(Long id) {
        super("{ "+ id + " }: noteId" + " not found!");
    }
}
