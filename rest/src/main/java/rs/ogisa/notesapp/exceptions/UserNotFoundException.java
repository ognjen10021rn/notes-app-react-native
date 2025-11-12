package rs.ogisa.notesapp.exceptions;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long id) {
        super("{ "+ id + " }: userId" + " not found!");
    }
}
