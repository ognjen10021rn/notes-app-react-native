package rs.ogisa.notesapp.dto;

import lombok.Getter;
import lombok.Setter;
import rs.ogisa.notesapp.models.AuthenticationDetails;

import javax.validation.constraints.Email;
import java.io.Serializable;

@Getter
@Setter
public class CreateUserDto implements Serializable{

    private String username;

    @Email
    private String email;

    private String password;

}
