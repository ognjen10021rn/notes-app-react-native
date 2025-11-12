package rs.ogisa.notesapp.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rs.ogisa.notesapp.models.UserNote;

import java.util.List;

@Repository
public interface UserNoteRepository extends JpaRepository<UserNote, Long> {
    public List<UserNote> findAllByUserId(Long userId);
    public List<UserNote> findAllByNoteId(Long noteId);
    public UserNote findByUserIdAndNoteId(Long userId, Long noteId);
}
