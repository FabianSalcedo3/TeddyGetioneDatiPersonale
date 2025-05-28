package com.teddy.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.teddy.server.model.Person;

public interface PersonRepository extends JpaRepository<Person, Long> {
    
}
