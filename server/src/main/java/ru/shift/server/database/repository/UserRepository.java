package ru.shift.server.database.repository;

import org.springframework.data.repository.CrudRepository;
import ru.shift.server.database.entity.User;

public interface UserRepository extends CrudRepository<User, Long> {
    User getUserByMail(String mail);

    User getUserByLogin(String login);
}
