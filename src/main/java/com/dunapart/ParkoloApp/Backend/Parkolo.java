package com.dunapart.ParkoloApp.Backend;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "parkolo")
public class Parkolo {
    @Id
    @GeneratedValue
    private int parkolo_id;
    private int meret;
    private boolean status;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinTable(name = "Felhasznalo", joinColumns = @JoinColumn (name = "felhasznalo_id"), inverseJoinColumns = @JoinColumn(name = "parkolo_id"))
//    private Felhasznalo felhasznalo;


    private Date from_date;
    private Date to_date;

}
