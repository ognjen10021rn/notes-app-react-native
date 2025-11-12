package rs.ogisa.notesapp.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class CustomDetailsService implements UserDetailsService {
    private final UserService userService;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userService.loadUserByUsername(email)
                .or(() -> userService.loadUserByEmail(email))
                .map(this::mapToUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with: " + email));
    }

    private UserDetails mapToUserDetails(rs.ogisa.notesapp.models.User user) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername()) // keep username here
                .password(user.getPassword())
                .authorities(new ArrayList<>())
                .build();
    }
}
