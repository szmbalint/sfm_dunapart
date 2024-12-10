package com.dunapart.ParkoloApp.Backend;

import com.dunapart.ParkoloApp.APISpringManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class AutokRepositoryTest {

    @Autowired
    private AutokRepository autokRepository;
    @Autowired
    private FelhasznaloRepository felhasznaloRepository;

    @MockBean
    private APISpringManager apiSpringManager;
    @BeforeEach
    @Transactional
    void setUp()
    {
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
        Autok auto1 = new Autok();
        auto1.setRendszam("ABC-123");
        auto1.setName("Toyota");
        auto1.setType("Corolla");
        auto1.setMeret(2);
        auto1.setColor("Green");
        auto1.setParkolo(null);
        auto1.setFelhasznalo(felhasznalo1);
        autokRepository.save(auto1);

        Autok auto2 = new Autok();
        auto2.setRendszam("DEF-345");
        auto2.setName("Datsun");
        auto2.setType("240Z");
        auto2.setMeret(1);
        auto2.setColor("Blue");
        auto2.setParkolo(null);
        auto2.setFelhasznalo(felhasznalo2);
        autokRepository.save(auto2);

    }

    @Test
    void testFindByFelhasznaloId() {
        List<Autok> autoLista = autokRepository.findByFelhasznaloId((long)1);
        assertThat(autoLista).isNotNull();
    }

    @Test
    void testFindByRendszam() {
        Autok auto = autokRepository.findByRendszam("ABC-123");
        assertThat(auto).isNotNull();
        assertThat(auto.getRendszam()).isEqualTo("ABC-123");
    }

    @Test
    void testExistsByRendszam() {
        boolean exists = autokRepository.existsByRendszam("ABC-123");
        assertThat(exists).isTrue();

        exists = autokRepository.existsByRendszam("NON-EXISTENT");
        assertThat(exists).isFalse();
    }

    @Test
    void testDeleteByIdCustom() {
        Autok auto = autokRepository.findByRendszam("ABC-123");
        assertThat(auto).isNotNull();

        autokRepository.deleteByIdCustom(auto.getAuto_id());
        auto = autokRepository.findByRendszam("ABC-123");
        assertThat(auto).isNull();
    }

    @AfterEach
    void tearDown() {
        autokRepository.deleteAll();
        felhasznaloRepository.deleteAll();
    }

}