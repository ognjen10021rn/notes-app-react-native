package rs.ogisa.notesapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EditNoteDto implements Serializable {

    private Long userId;
    private Long noteId;
    private String title;
    private String content;

}
