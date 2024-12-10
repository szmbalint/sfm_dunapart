package com.dunapart.ParkoloApp.Backend;

import com.dunapart.ParkoloApp.APISpringManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
class ParkoloRepositoryTest {

    @Autowired
    private ParkoloRepository parkoloRepository;

    @MockBean
    private APISpringManager apispringManager;

    @BeforeEach
    @Transactional
    void setUp() {
        Parkolo parkolo1 = new Parkolo();
        parkolo1.setMeret(2);
        parkolo1.setStatus(false);
        parkolo1.setFrom_date(null);
        parkolo1.setTo_date(null);

        Parkolo parkolo2 = new Parkolo();
        parkolo2.setMeret(3);
        parkolo2.setStatus(false);
        parkolo2.setFrom_date(null);
        parkolo2.setTo_date(null);
        parkoloRepository.save(parkolo1);
        parkoloRepository.save(parkolo2);


    }

    @Test
    void testFindFreeParkolo() {
        List<Parkolo> parkolohelyek = apispringManager.getParkingPlots();

        List<Parkolo> freeParkolohelyek = new ArrayList<>();

        Boolean fullFree = true;

        for (Parkolo parkolo : parkolohelyek) {
            if (parkolo.isStatus() == false) {
                freeParkolohelyek.add(parkolo);
            }
        }

        for (Parkolo freeparkolo : freeParkolohelyek) {
            if (freeparkolo.isStatus() == true) {
                fullFree = false;
            }
        }

        assertThat(fullFree).isTrue();
    }

    @Test
    void ModifyBookingDate(){

        String from_date_string = "2024-12-03 11:00";
        String to_date_string = "2024-12-03 14:00";
        String to_date_string_modified = "2024-12-03 16:00";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime to_date = LocalDateTime.parse(to_date_string,formatter);
        LocalDateTime from_date = LocalDateTime.parse(from_date_string,formatter);
        LocalDateTime to_date_modified = LocalDateTime.parse(to_date_string_modified,formatter);

        Parkolo parkolo = parkoloRepository.getReferenceById((long) 1);
        parkolo.setFrom_date(from_date);
        parkolo.setTo_date(to_date);

        parkoloRepository.save(parkolo);

        parkolo.setTo_date(to_date_modified);
        parkoloRepository.save(parkolo);

        assertThat(parkolo.getTo_date()).isEqualTo(to_date_modified);
    }

}
