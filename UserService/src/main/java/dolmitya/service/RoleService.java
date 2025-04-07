package dolmitya.service;

import com.github.dolmitya.entities.RoleEntity;
import dolmitya.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleEntity getUserRole() {
        return roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new IllegalStateException("User role not found"));
    }
}
