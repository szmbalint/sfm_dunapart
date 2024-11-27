package com.dunapart.ParkoloApp.Backend;

import com.dunapart.ParkoloApp.APISpringManager;
import com.dunapart.ParkoloApp.Backend.Model.LoginRequest;
import com.dunapart.ParkoloApp.Backend.Model.RegiRequest;
import com.dunapart.ParkoloApp.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@SpringBootApplication
public class DataController {

    private final APISpringManager springmanager;
    private final JwtUtil jwtUtil; // JWT segédosztály

//    @Autowired
//    public DataController(APISpringManager springmanager) {
//        this.springmanager = springmanager;
//    }


//    @PostMapping("/login")
//    public String getFelhasznalo(@RequestBody LoginRequest loginRequest)
//    {
//        System.out.println("email: " + loginRequest.getEmail());
//        System.out.println("passwd: " + loginRequest.getPassword());
//        String validity = springmanager.isUserValid(loginRequest.getEmail(), loginRequest.getPassword());  //valid = gud, invalid = not gud
//        return validity;
//    }

    @Autowired
    public DataController(APISpringManager springmanager) {
        this.springmanager = springmanager;
        this.jwtUtil = new JwtUtil();
    }

    @PostMapping("/login")
    public ResponseEntity<?> getFelhasznalo(@RequestBody LoginRequest loginRequest) {
        System.out.println("email: " + loginRequest.getEmail());
        System.out.println("passwd: " + loginRequest.getPassword());

        String validity = springmanager.isUserValid(loginRequest.getEmail(), loginRequest.getPassword());

        if ("valid".equals(validity)) {
            String token = jwtUtil.generateToken(loginRequest.getEmail()); // Token generálása
            return ResponseEntity.ok(Map.of("token", token)); // Token visszaküldése
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login credentials!");
        }
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

    @GetMapping("/me")
    public ResponseEntity<?> getUserData(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid token");
        }

        String token = authHeader.substring(7); // "Bearer " eltávolítása
        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = jwtUtil.extractEmail(token); // Tokenből e-mail kinyerése
        // Példa: lekérdezzük a felhasználót a SpringManager-ből
        Felhasznalo user = springmanager.findUserByEmail(email);
        return ResponseEntity.ok(user);
    }
}
