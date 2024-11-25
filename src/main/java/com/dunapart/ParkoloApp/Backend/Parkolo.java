package com.dunapart.ParkoloApp.Backend;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Parkolo {
    @Id
    @GeneratedValue
    private int id;
    private int meret;
    private boolean status;
    private int rented_by_felhasznalo_id;

    private Date from_date;
    private Date to_date;

}
