package com.dunapart.ParkoloApp.Backend;

import com.dunapart.ParkoloApp.APISpringManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@SpringBootApplication
public class DataController {

    private final APISpringManager springmanager;

    @Autowired
    public DataController(APISpringManager springmanager) {
        this.springmanager = springmanager;
    }


    @GetMapping("/login")
    public String getFelhasznalo(@RequestParam String email, @RequestParam String passwd)
    {
        String validity = springmanager.isUserValid(email,passwd);  //valid = gud, invalid = not gud
        return validity;
    }
}
