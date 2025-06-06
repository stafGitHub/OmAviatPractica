package ru.shift.server.database.validation;

import lombok.RequiredArgsConstructor;
import ru.shift.server.database.repository.UserRepository;
import ru.shift.server.dto.request.RegisterRequest;

@RequiredArgsConstructor
public abstract class Validation {
    protected final UserRepository userRepository;

    public boolean validate(RegisterRequest request) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
