package rs.ogisa.notesapp;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import rs.ogisa.notesapp.models.User;
import rs.ogisa.notesapp.repositories.NoteRepository;
import rs.ogisa.notesapp.repositories.UserRepository;
import rs.ogisa.notesapp.services.UserService;

@Component
@AllArgsConstructor
public class BootstrapData implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        User user = new User();
        user.setUserId(1L);
        user.setUsername("ogisa");
        user.setEmail("ogisa@ogisa.com");
        user.setPassword(passwordEncoder.encode("1234"));

        userRepository.save(user);
    }
}
