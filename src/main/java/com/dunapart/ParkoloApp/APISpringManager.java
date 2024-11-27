package com.dunapart.ParkoloApp;

import Frontend.APIManager;
import com.dunapart.ParkoloApp.Backend.Felhasznalo;
import com.dunapart.ParkoloApp.Backend.FelhasznaloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Service;

//@SpringBootApplication
@Service
public class APISpringManager implements APIManager {

    private final FelhasznaloRepository felhasznaloRepository;

    @Autowired
    public APISpringManager(FelhasznaloRepository felhasznaloRepository)
    {
        this.felhasznaloRepository = felhasznaloRepository;
    }

    @Override
    public String isUserValid(String email, String passwd) {
        Felhasznalo user = felhasznaloRepository.findByEmail(email);
        if (user == null) {
            return "not gud"; // ha nincs ilyen felhasználó
        }
        if (user.getPassword().equals(passwd)) {
            return "gud"; // ha helyes a jelszó
        }
        return "not gud"; // ha helytelen a jelszó
    }

}
