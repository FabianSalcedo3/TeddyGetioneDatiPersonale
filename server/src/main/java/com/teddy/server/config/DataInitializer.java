package com.teddy.server.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.teddy.server.model.Person;
import com.teddy.server.repository.PersonRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(PersonRepository repository) {
        return args -> {
            // Add some sample data if the database is empty
            if (repository.count() == 0) {
                Person person1 = new Person();
                person1.setFirstName("Mario");
                person1.setLastName("Rossi");
                person1.setEmail("mario.rossi@email.com");
                person1.setCity("Milano");
                person1.setProvince("MI");
                repository.save(person1);

                Person person2 = new Person();
                person2.setFirstName("Anna");
                person2.setLastName("Bianchi");
                person2.setEmail("anna.bianchi@email.com");
                person2.setCity("Roma");
                person2.setProvince("RM");
                repository.save(person2);
            }
        };
    }
}
