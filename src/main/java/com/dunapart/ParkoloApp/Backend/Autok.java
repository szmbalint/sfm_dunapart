package com.dunapart.ParkoloApp.Backend;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Autok {

    @Id
    @GeneratedValue
    private int auto_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(name = "Felhasznalo", joinColumns = @JoinColumn (name = "felhasznalo_id"), inverseJoinColumns = @JoinColumn(name = "auto_id"))
    private Felhasznalo felhasznalo;

    private String rendszam;
    private int meret;
}