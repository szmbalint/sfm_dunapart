package com.dunapart.ParkoloApp.Backend;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "autok")
public class Autok {

    @Id
    @GeneratedValue
    private int auto_id;
    private String rendszam;
    private int meret;

    // One-to-One kapcsolat, egy autó csak egy parkolóhelyen parkolhat
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parkolo_id", nullable = true)  // nullable = true, mert nem minden autó parkol
    private Parkolo parkolo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "felhasznalo_id", nullable = false)
    @ToString.Exclude           //rekurzió elkerülése
    private Felhasznalo felhasznalo;

}