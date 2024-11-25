package com.dunapart.ParkoloApp.Backend;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Target;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Autok {

    @Id
    @GeneratedValue
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(name = "Felhasznalo", joinColumns = @JoinColumn (name = "id"), inverseJoinColumns = @JoinColumn(name = "id"))
    private Felhasznalo felhasznalo;
    //asdasd
    private String rendszam;
    private int meret;
}