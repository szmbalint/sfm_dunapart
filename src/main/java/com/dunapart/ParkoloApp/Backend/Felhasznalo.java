package com.dunapart.ParkoloApp.Backend;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "felhasznalo")
public class Felhasznalo {
    @Id
    @GeneratedValue
    private int felhasznalo_id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;


//    @OneToMany(fetch = FetchType.LAZY)
//    @JoinTable(name = "Autok", joinColumns = @JoinColumn (name = "auto_id"), inverseJoinColumns = @JoinColumn(name = "felhasznalo_id"))
//    private List<Autok> auto;

    @OneToMany(mappedBy = "felhasznalo", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Autok> auto;

    @OneToMany(mappedBy = "felhasznalo", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Parkolo> parkolo;


//    @OneToMany(fetch = FetchType.LAZY)
//    @JoinTable(name = "Parkolo", joinColumns = @JoinColumn (name = "parkolo_id"), inverseJoinColumns = @JoinColumn(name = "felhasznalo_id"))
//    private List<Parkolo> parkolo;



}
