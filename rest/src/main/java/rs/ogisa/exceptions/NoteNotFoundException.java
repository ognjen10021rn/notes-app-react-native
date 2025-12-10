package rs.ogisa.exceptions;

public class NoteNotFoundException extends RuntimeException {

    public NoteNotFoundException(Long id) {
        super("{ "+ id + " }: noteId" + " not found!");
    }
}
