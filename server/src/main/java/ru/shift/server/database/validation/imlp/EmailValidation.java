package ru.shift.server.database.validation.imlp;

import org.springframework.stereotype.Component;
import ru.shift.server.database.repository.UserRepository;
import ru.shift.server.database.validation.Validation;
import ru.shift.server.dto.request.RequestRegister;

@Component
public class EmailValidation extends Validation {
    public EmailValidation(UserRepository userRepository) {
        super(userRepository);
    }

    @Override
    public boolean validate(RequestRegister request) {
        var userByMail = userRepository.getUserByMail(request.email());
        return userByMail == null;
    }
}
