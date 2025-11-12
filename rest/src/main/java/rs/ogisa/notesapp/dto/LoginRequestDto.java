package rs.ogisa.notesapp.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class LoginRequestDto implements Serializable {


    private String usernameOrEmail;

    private String password;
}
