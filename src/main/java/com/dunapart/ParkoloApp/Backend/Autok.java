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
public class Autok {

    @Id
    @GeneratedValue
    private int auto_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinTable(name = "Parkolo", joinColumns = @JoinColumn (name = "parkolo_id"), inverseJoinColumns = @JoinColumn(name = "auto_id"))
    private Parkolo parkolo;

    private String rendszam;
    private int meret;
}