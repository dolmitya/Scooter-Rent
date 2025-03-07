package dolmitya.mappers;


import com.github.dolmitya.dto.UserDTO;
import com.github.dolmitya.entities.UserEntity;

public class UserMapper {
    public static UserDTO UserEntityToUserDTO(UserEntity userEntity) {
        return new UserDTO(userEntity.getUsername(), userEntity.getPassword());
    }

    public static UserEntity UserDTOToUserEntity(UserDTO userDTO) {
        return new UserEntity(userDTO.username(), userDTO.password());
    }
}
