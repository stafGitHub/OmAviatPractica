package ru.shift.server.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.shift.server.database.entity.user.User;
import ru.shift.server.database.entity.user.UserRole;
import ru.shift.server.database.repository.UserRepository;
import ru.shift.server.database.validation.Validation;
import ru.shift.server.dto.request.RegisterRequest;
import ru.shift.server.security.jwt.JwtTokenUtil;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServices {
    private final UserRepository userRepository;
    private final List<Validation> validations;
    private final JwtTokenUtil jwtTokenUtil;

    public boolean saveUserToDatabase(RegisterRequest registerRequest) {
        var validated = validateUser(registerRequest);

        if (validated) {
            userRepository.save(mapUserFromRequestRegister(registerRequest));
            return true;
        } else {
            return false;
        }
    }

    private User mapUserFromRequestRegister(RegisterRequest registerRequest) {
        return User.builder()
                .fullName(registerRequest.fullName())
                .phone(registerRequest.phone())
                .mail(registerRequest.email())
                .login(registerRequest.login())
                .password(registerRequest.password())
                .role(UserRole.USER)
                .build();
    }

    private boolean validateUser(RegisterRequest registerRequest) {
        boolean valid = false;
        for (Validation validation : validations) {
            valid = validation.validate(registerRequest);
        }
        return valid;
    }

    public String getUserJwtInfo(RegisterRequest registerRequest , UserRole userRole) {
        return jwtTokenUtil.generateToken(registerRequest , userRole);
    }
}
