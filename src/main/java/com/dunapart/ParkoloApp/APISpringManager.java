package com.dunapart.ParkoloApp;

import Frontend.APIManager;
import com.dunapart.ParkoloApp.Backend.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

//@SpringBootApplication
@Service
public class APISpringManager implements APIManager {

    private final FelhasznaloRepository felhasznaloRepository;
    private final AutokRepository autokRepository;
    private final ParkoloRepository parkoloRepository;

    @Autowired
    public APISpringManager(FelhasznaloRepository felhasznaloRepository,AutokRepository autokRepository,ParkoloRepository parkoloRepository)
    {
        this.felhasznaloRepository = felhasznaloRepository;
        this.autokRepository = autokRepository;
        this.parkoloRepository = parkoloRepository;
    }

    @Override
    public String isUserValid(String email, String passwd) {
        Felhasznalo user = felhasznaloRepository.findByEmail(email);
        if (user == null) {
            return "notvalid"; // ha nincs ilyen felhasználó
        }
        if (user.getPassword().equals(passwd)) {
            return "valid"; // ha helyes a jelszó
        }
        return "notvalid_unknown_expression";
    }

    @Override
    public Felhasznalo findUserByEmail(String email) {
        Felhasznalo user = felhasznaloRepository.findByEmail(email);
        return user;
    }

    @Override
    public List<Autok> findCars(long userID) {
        List<Autok> autok = new ArrayList<Autok>();

        autok = autokRepository.findByFelhasznaloId((long) userID);
        for (Autok autoi : autok)
        {
            System.out.println(autoi);
        }

        return autok;
    }

    @Override
    public void saveUser(String firstName, String lastName, String passwd, String email) {
        Felhasznalo user = Felhasznalo.builder()
                .firstName(firstName)
                .lastName(lastName)
                .password(passwd)
                .email(email)
                .build();
        System.out.println("this user builded by builder thing or what: "+ user);
        felhasznaloRepository.save(user);
    }

    @Override
    public List<Parkolo> getParkingPlots() {
        List<Parkolo> result = new ArrayList<>();
        result = parkoloRepository.findAll();
        return result;
    }
}
