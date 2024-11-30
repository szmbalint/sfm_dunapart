package com.dunapart.ParkoloApp.Backend;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
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


    @OneToMany(mappedBy = "felhasznalo", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @ToString.Exclude   //rekurzió elkerülése
    @JsonIgnore         // -"-
    private List<Autok> auto;




}
