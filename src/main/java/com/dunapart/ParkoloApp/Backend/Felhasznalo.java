package com.dunapart.ParkoloApp.Backend;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
