package com.dunapart.ParkoloApp.Backend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KutyakRepository extends JpaRepository<Kutyak, Long> {
}
