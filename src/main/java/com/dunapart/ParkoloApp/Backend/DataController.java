package com.dunapart.ParkoloApp.Backend;

import com.dunapart.ParkoloApp.APISpringManager;
import com.dunapart.ParkoloApp.Backend.Model.LoginRequest;
import com.dunapart.ParkoloApp.Backend.Model.RegiRequest;
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

    @PostMapping("/reg")
    public void regFelhasznalo(@RequestBody RegiRequest regiRequest)
    {
        System.out.println("regelt felhasznalo adatai: ");
        System.out.println("firstname: "+regiRequest.getFirstName());
        System.out.println("lastname: "+regiRequest.getLastName());
        System.out.println("passwd: "+regiRequest.getPassword());
        System.out.println("email: "+regiRequest.getEmail());
        springmanager.saveUser(regiRequest.getFirstName(),regiRequest.getLastName(),regiRequest.getPassword(),regiRequest.getEmail());
        System.out.println("user reg method finished");
    }
}
