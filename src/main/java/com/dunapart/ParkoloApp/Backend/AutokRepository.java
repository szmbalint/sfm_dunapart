package com.dunapart.ParkoloApp.Backend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AutokRepository extends JpaRepository<Autok, Long> {
    List<Autok> findByRendszam(String rendszam);
}
