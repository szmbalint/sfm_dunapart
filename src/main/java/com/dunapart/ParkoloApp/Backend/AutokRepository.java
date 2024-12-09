package com.dunapart.ParkoloApp.Backend;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutokRepository extends JpaRepository<Autok, Long> {
    @Query("SELECT a FROM Autok a JOIN a.felhasznalo f WHERE f.felhasznalo_id = :felhasznaloId")
    List<Autok> findByFelhasznaloId(@Param("felhasznaloId") Long felhasznaloId);

    Autok findByRendszam(@Param("rendszam") String rendszam);

    boolean existsByRendszam(String rendszam);

    @Modifying
    @Transactional
    @Query("DELETE FROM Autok a WHERE a.auto_id = :id")
    void deleteByIdCustom(@Param("id") long id);

}
