package ru.shift.server.database.validation.imlp;

import org.springframework.stereotype.Component;
import ru.shift.server.database.repository.UserRepository;
import ru.shift.server.database.validation.Validation;
import ru.shift.server.dto.request.RegisterRequest;

@Component
public class LoginValidation extends Validation {
    public LoginValidation(UserRepository userRepository) {
        super(userRepository);
    }

    @Override
    public boolean validate(RegisterRequest request) {
        var userByLogin = userRepository.getUserByLogin(request.login());
        return userByLogin == null;
    }
}