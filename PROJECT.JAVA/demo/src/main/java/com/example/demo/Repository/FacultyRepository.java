package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Faculty;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
}