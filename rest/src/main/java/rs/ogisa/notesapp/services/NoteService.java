package rs.ogisa.notesapp.services;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rs.ogisa.notesapp.dto.*;
import rs.ogisa.notesapp.exceptions.NoteNotFoundException;
import rs.ogisa.notesapp.models.Note;
import rs.ogisa.notesapp.models.User;
import rs.ogisa.notesapp.models.UserNote;
import rs.ogisa.notesapp.repositories.NoteRepository;
import rs.ogisa.notesapp.repositories.UserNoteRepository;
import rs.ogisa.notesapp.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final UserRepository userRepository;
    private final NoteRepository noteRepository;
    private final UserNoteRepository userNoteRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean createNote(Long userId, CreateNoteDto createNoteDto) {

        Note note = new Note();
        note.setAdminId(userId);
        note.setCreatedAt(LocalDateTime.now());
        note.setUpdatedAt(LocalDateTime.now());
        note.setIsLocked(false);
        note.setIsDeleted(false);
        note.setTitle(createNoteDto.getTitle());

        noteRepository.save(note);


        UserNote userNote = new UserNote();
        userNote.setNoteId(note.getNoteId());
        userNote.setUserId(userId);
        userNote.setIsUserAdmin(true);
        userNote.setIsDeleted(false);
        userNoteRepository.save(userNote);

        //TODO dodaj proveru da li je user vec dodao te korisnike u note
        //TODO zasto?

        List<UserNote> userNoteList = new ArrayList<>();
        for(Long usrId : createNoteDto.getUserIds()){
            UserNote usr = new UserNote();
            usr.setNoteId(note.getNoteId());
            usr.setUserId(usrId);
            usr.setIsUserAdmin(false);
            usr.setIsDeleted(false);
            userNoteList.add(usr);
        }
        userNoteRepository.saveAll(userNoteList);


        return true;

    }

    public ResponseEntity<?> deleteNoteById(Long noteId) {

        if(!noteRepository.existsById(noteId)){
            return ResponseEntity.notFound().build();
        }
        Note note = noteRepository.findById(noteId).orElseThrow(() -> new NoteNotFoundException(noteId));

        note.setIsDeleted(true);
        noteRepository.save(note);

        return ResponseEntity.ok().build();
    }

    public List<UserNote> getAllUserNote(){
        return userNoteRepository.findAll();
    }
    public List<Note> getAllNotes(){
        return noteRepository.findAll();
    }

    public List<Note> getAllNotesByUserId(Long userId){
        List<UserNote> userNoteList = userNoteRepository.findAllByUserId(userId);
        List<Note> noteList = new ArrayList<>();
        for(UserNote note : userNoteList){
            if(note.getIsDeleted()){
               continue;
            }
            Note nt = noteRepository.findByNoteId(note.getNoteId()).orElseThrow(()
                    -> new NoteNotFoundException(note.getNoteId()));

            noteList.add(nt);
        }

        return noteList;
    }

    public Note getNoteById(Long noteId){

        return noteRepository.findByNoteId(noteId).orElseThrow(() -> new NoteNotFoundException(noteId));
    }

    public Note sendContentToUserNote(EditNoteDto editNoteDto){

        UserNote userNote = userNoteRepository.findByUserIdAndNoteId(editNoteDto.getUserId(), editNoteDto.getNoteId());
        if(userNote == null){
            throw new NoteNotFoundException(editNoteDto.getNoteId());
        }

        Note note = noteRepository.findByNoteId(editNoteDto.getNoteId()).orElseThrow(() -> new NoteNotFoundException(editNoteDto.getNoteId()));

        note.setIsLocked(true);

        note.setTitle(editNoteDto.getTitle());
        note.setContent(editNoteDto.getContent());
        note.setUpdatedAt(LocalDateTime.now());

        note.setIsLocked(false);

        noteRepository.save(note);
        return note;

    }

}
