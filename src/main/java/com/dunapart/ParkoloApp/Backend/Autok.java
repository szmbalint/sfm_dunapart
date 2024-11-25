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
    private int id;

    private int felhasznalo_id;

    private String rendszam;
    private int meret;
}