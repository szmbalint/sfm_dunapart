package com.dunapart.ParkoloApp.Backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FelhasznaloRepository extends JpaRepository<Felhasznalo, Long> {

    List<Felhasznalo> findByEmail(String email);

}
