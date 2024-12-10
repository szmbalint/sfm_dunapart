package com.dunapart.ParkoloApp.Backend;

import com.dunapart.ParkoloApp.APISpringManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@DataJpaTest
class FelhasznaloRepositoryTest {
    @Autowired
    private FelhasznaloRepository felhasznaloRepository;
    @Autowired
    private AutokRepository autokRepository;

    @MockBean
    private APISpringManager apispringManager;

    @BeforeEach
    @Transactional
    void setUp() {
        Felhasznalo felhasznalo1 = new Felhasznalo(
                1,
                "felhasznalo1@gmail.com",
                "securepwd123",
                "First1",
                "Last1",
                null
        );

        Felhasznalo felhasznalo2 = new Felhasznalo(
                2,
                "felhasznalo2@gmail.com",
                "securepwd123",
                "First2",
                "Last2",
                null
        );
        felhasznaloRepository.save(felhasznalo1);
        felhasznaloRepository.save(felhasznalo2);


    }

    @Test
    void testFindByEmail(){
        Felhasznalo felhasznalo = felhasznaloRepository.findByEmail("felhasznalo1@gmail.com");
        assertThat(felhasznalo.getFirstName()).isEqualTo("First1");
    }

    @Test
    void testChangePassword(){
        Felhasznalo felhasznalo = felhasznaloRepository.findByEmail("felhasznalo1@gmail.com");
        felhasznalo.setPassword("Notsecurepwd123");
        felhasznaloRepository.save(felhasznalo);
        assertThat(felhasznalo.getPassword()).isEqualTo("Notsecurepwd123");
    }


    @AfterEach
    void tearDown(){
        felhasznaloRepository.deleteAll();
    }
}
