package com.dunapart.ParkoloApp.Backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AutokRepository extends JpaRepository<Autok, Long> {
    @Query("SELECT a FROM Autok a JOIN a.felhasznalo f WHERE f.felhasznalo_id = :felhasznaloId")
    List<Autok> findByFelhasznaloId(@Param("felhasznaloId") Long felhasznaloId);

    Autok findByRendszam(@Param("rendszam") String rendszam);

    boolean existsByRendszam(String rendszam);
}
