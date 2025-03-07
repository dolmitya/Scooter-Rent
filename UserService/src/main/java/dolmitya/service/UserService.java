package dolmitya.service;


import com.github.dolmitya.dto.UserDTO;
import com.github.dolmitya.entities.UserEntity;
import dolmitya.mappers.UserMapper;
import dolmitya.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<UserEntity> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Double getBalanceByUsername(String username) {
        return userRepository.findByUsername(username).get().getBalance();
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));

        return new User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

    public void createNewUser(UserDTO userDTO) {
        UserDTO userWithPasswordDTO = new UserDTO(userDTO.username(), passwordEncoder.encode(userDTO.password()));
        UserEntity userEntity = UserMapper.UserDTOToUserEntity(userWithPasswordDTO);
        userRepository.save(userEntity);
    }

    @Transactional
    public void topUpBalance(String username, Double amount) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);
    }

    @Transactional
    public void updateUserInfo(String username, Map<String, String> updates) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (updates.containsKey("numberPhone")) {
            user.setNumberPhone(updates.get("numberPhone"));
        }
        if (updates.containsKey("username")) {
            user.setUsername(updates.get("username"));
        }
        if (updates.containsKey("password")) {
            user.setPassword(passwordEncoder.encode(updates.get("password")));
        }
        userRepository.save(user);
    }
}
