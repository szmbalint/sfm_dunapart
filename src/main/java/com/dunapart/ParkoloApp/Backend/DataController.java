package com.dunapart.ParkoloApp.Backend;

import com.dunapart.ParkoloApp.APISpringManager;
import com.dunapart.ParkoloApp.Backend.Model.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@SpringBootApplication
public class DataController {

    private final APISpringManager springmanager;

    @Autowired
    public DataController(APISpringManager springmanager) {
        this.springmanager = springmanager;
    }


    @PostMapping("/login")
    public String getFelhasznalo(@RequestBody LoginRequest loginRequest)
    {
        System.out.println("email: " + loginRequest.getEmail());
        System.out.println("passwd: " + loginRequest.getPassword());
        String validity = springmanager.isUserValid(loginRequest.getEmail(), loginRequest.getPassword());  //valid = gud, invalid = not gud
        return validity;
    }
}
