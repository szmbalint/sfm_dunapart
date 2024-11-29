package com.dunapart.ParkoloApp.Backend;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
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
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinTable(name = "Parkolo", joinColumns = @JoinColumn (name = "parkolo_id"), inverseJoinColumns = @JoinColumn(name = "auto_id"))
//    private Parkolo parkolo;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinTable(name = "Felhasznalo", joinColumns = @JoinColumn (name = "felhasznalo_id"), inverseJoinColumns = @JoinColumn(name = "auto_id"))
//    private Felhasznalo felhasznalo;

    // One-to-One kapcsolat, egy autó csak egy parkolóhelyen parkolhat
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parkolo_id", nullable = true)  // nullable = true, mert nem minden autó parkol
    private Parkolo parkolo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "felhasznalo_id", nullable = false)
    private Felhasznalo felhasznalo;

}