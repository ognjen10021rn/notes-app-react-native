package rs.ogisa.dto;

import lombok.Getter;
import lombok.Setter;

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
