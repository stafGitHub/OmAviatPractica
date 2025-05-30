package ru.shift.server.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.shift.server.database.entity.user.User;
import ru.shift.server.database.entity.user.UserRole;
import ru.shift.server.database.repository.UserRepository;
import ru.shift.server.database.validation.Validation;
import ru.shift.server.dto.request.LoginRequest;
import ru.shift.server.dto.request.RegisterRequest;
import ru.shift.server.exception.UserNotFound;
import ru.shift.server.security.jwt.JwtTokenUtil;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServices {
    private final UserRepository userRepository;
    private final List<Validation> validations;
    private final JwtTokenUtil jwtTokenUtil;

    public boolean saveUserToDatabase(RegisterRequest registerRequest , String token) {
        var validated = validateUser(registerRequest);

        if (validated) {
            userRepository.save(mapUserFromRequestRegister(registerRequest , token));
            return true;
        } else {
            return false;
        }
    }

    private User mapUserFromRequestRegister(RegisterRequest registerRequest , String token) {
        return User.builder()
                .fullName(registerRequest.fullName())
                .phone(registerRequest.phone())
                .mail(registerRequest.email())
                .login(registerRequest.login())
                .password(registerRequest.password())
                .token(token)
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

    public String getUserJwtInfo(RegisterRequest registerRequest, UserRole userRole) {
        return jwtTokenUtil.generateToken(registerRequest, userRole);
    }

    public User getUser(LoginRequest loginRequest) throws UserNotFound {
        User user = userRepository.getUserByLoginAndPassword(loginRequest.username(), loginRequest.password());
        if (user == null) {
            throw new UserNotFound("User with this name and password not found");
        }
        return user;
    }
}
