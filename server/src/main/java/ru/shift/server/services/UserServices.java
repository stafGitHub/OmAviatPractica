package ru.shift.server.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.shift.server.database.entity.User;
import ru.shift.server.database.entity.UserRole;
import ru.shift.server.database.repository.UserRepository;
import ru.shift.server.database.validation.Validation;
import ru.shift.server.dto.request.RequestRegister;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServices {
    private final UserRepository userRepository;
    private final List<Validation> validations;

    public boolean saveUserToDatabase(RequestRegister requestRegister) {
        var validated = validateUser(requestRegister);

        if (validated) {
            userRepository.save(mapUserFromRequestRegister(requestRegister));
            return true;
        }else {
            return false;
        }
    }

    private User mapUserFromRequestRegister(RequestRegister requestRegister) {
        var build = User.builder()
                .fullName(requestRegister.fullName())
                .phone(requestRegister.phone())
                .mail(requestRegister.email())
                .login(requestRegister.login())
                .password(requestRegister.password())
                .role(UserRole.USER)
                .build();

        return build;
    }

    private boolean validateUser(RequestRegister requestRegister) {
        boolean valid = false;
        for (Validation validation : validations) {
            valid = validation.validate(requestRegister);
        }
        return valid;
    }
}
