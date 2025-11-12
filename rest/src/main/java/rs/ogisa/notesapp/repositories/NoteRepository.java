package rs.ogisa.notesapp.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rs.ogisa.notesapp.models.Note;

import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    public Note findByTitle(String title);
    public List<Note> findAllByAdminId(Long adminId);
    public Optional<Note> findByNoteId(Long noteId);
    public Note findByTitleAndAdminId(String title, Long adminId);
}
