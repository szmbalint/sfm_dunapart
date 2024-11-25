package com.dunapart.ParkoloApp;

import Frontend.Manager;
import com.dunapart.ParkoloApp.Backend.Autok;
import com.dunapart.ParkoloApp.Backend.Felhasznalo;
import com.dunapart.ParkoloApp.Backend.FelhasznaloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringManager implements Manager {

    @Autowired
    FelhasznaloRepository felhasznaloRepository;
    public static Manager manager = new SpringManager();

    @Override
    public void startBackend() {
        manager.startBackend();
    }

    @Override
    public void stopBackend() {
        manager.stopBackend();

    }

    @Override
    public String getUserEmail() {
        return felhasznaloRepository.findByEmail("proba@email.com").get(0).getEmail();
    }

    public void saveUser(String email, String password) {
        Felhasznalo u = Felhasznalo.builder()
                .email(""+ email)
                .password(""+ password)
                .build();

        felhasznaloRepository.save(u);
    }

    @Override
    public void saveCar(String rendszam, int meret, Felhasznalo u) {
        Autok auto = new Autok();
        auto.setRendszam(rendszam);
        auto.setMeret(meret);
        auto.setOwner(u);
        felhasznaloRepository.save(u);

    }
}
