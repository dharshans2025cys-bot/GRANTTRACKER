package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.Model.Expenditure;

@Repository
public interface ExpenditureRepository extends JpaRepository<Expenditure, Long> {
}