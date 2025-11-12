package rs.ogisa.notesapp.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rs.ogisa.notesapp.models.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsernameOrEmail(String username, String email);
    Optional<User> findByUsername(String username);
    User findByUsernameAndPassword(String username, String password);
    Optional<User> findByUserId(Long userId);

    List<User> findAllUserByUserIdNot(Long userId);


    List<User> findAllUserByUserId(Long userId);

    Optional<User> findByEmail(String email);
}
