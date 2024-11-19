package com.dunapart.ParkoloApp;

import Frontend.Manager;
import com.dunapart.ParkoloApp.Backend.FelhasznaloRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ConfigurableApplicationContext;

public class SpringManager implements Manager {

    private ConfigurableApplicationContext ctx;
    @Override
    public void startBackend() { ctx = SpringApplication.run(ParkoloAppApplication.class);

    }

    @Override
    public void stopBackend() { ctx.stop();

    }

    @Override
    public String getUserEmail() {
        FelhasznaloRepository felhasznaloRepository = ctx.getBean(FelhasznaloRepository.class);
        return felhasznaloRepository.findByEmail("proba@email.com").get(0).getEmail();
    }

    public void saveUser(String email, String password) {
        Felhasznalo u = Felhasznalo.builder()
                .email(""+ email)
                .password(""+ password)
                .build();

        felhasznaloRepository.save(u);
    }
}
