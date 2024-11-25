package com.dunapart.ParkoloApp.Backend;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Felhasznalo {
    @Id
    @GeneratedValue
    private int id;
    private String email;
    private String password;

    private int auto_id;



}