package rs.ogisa.notesapp.dto;

import lombok.Getter;
import lombok.Setter;
import rs.ogisa.notesapp.models.AuthenticationDetails;

import java.io.Serializable;

@Getter
@Setter
public class UserDto implements Serializable, AuthenticationDetails {

    private Long userId;

    private String username;

    private String email;

    private String password;

}
