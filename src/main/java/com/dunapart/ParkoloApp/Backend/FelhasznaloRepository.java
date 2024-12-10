package com.dunapart.ParkoloApp.Backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FelhasznaloRepository extends JpaRepository<Felhasznalo, Long> {

    Felhasznalo findByEmail(String email);


}
