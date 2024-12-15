package com.coderscampus.lawander.repository;

import com.coderscampus.lawander.domain.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MyNotesRepo extends JpaRepository<Note, Long> {
}
