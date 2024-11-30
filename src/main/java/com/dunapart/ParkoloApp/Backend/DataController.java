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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
            String token = jwtUtil.generateToken(loginRequest.getEmail()); // Token generálás
            return ResponseEntity.ok(Map.of("token", token)); // Token visszaküldése
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login credentials!");
        }
    }

    @PostMapping("/reg")
    public ResponseEntity<?> regFelhasznalo(@RequestBody RegiRequest regiRequest)
    {
        System.out.println("regelt felhasznalo adatai: ");
        System.out.println("firstname: "+regiRequest.getFirstName());
        System.out.println("lastname: "+regiRequest.getLastName());
        System.out.println("passwd: "+regiRequest.getPassword());
        System.out.println("email: "+regiRequest.getEmail());
        springmanager.saveUser(regiRequest.getFirstName(),regiRequest.getLastName(),regiRequest.getPassword(),regiRequest.getEmail());
        System.out.println("user reg method finished");

        Map<String, String> response = new HashMap<>();
        response.put("message", "User successfully registered");
        response.put("status", "success");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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

    @GetMapping("/loadCars")
    public ResponseEntity<?> getUserCars(@RequestHeader("email") String userHeader) {
        if (userHeader == null || !userHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Missing or invalid email");
        }

        String email = userHeader.substring(7); // email kinyerése
        Felhasznalo user = springmanager.findUserByEmail(email);
        long userID = user.getFelhasznalo_id();
        List<Autok> userCars = new ArrayList<Autok>();
        userCars = springmanager.findCars(userID);
        return ResponseEntity.ok(userCars);
    }

    @GetMapping("/loadUserPlot")
    public ResponseEntity<?> getUserPlots(@RequestHeader("email") String userHeader) {
        if (userHeader == null || !userHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Missing or invalid email");
        }

        String email = userHeader.substring(7);
        Felhasznalo user = springmanager.findUserByEmail(email);
        long userID = user.getFelhasznalo_id();
        List<Autok> userCars = new ArrayList<>();
        userCars = springmanager.findCars(userID);

        List<Integer> userParkolo = new ArrayList<>();

        for (Autok car : userCars) {
            userParkolo.add(car.getParkolo().getParkolo_id());
        }

        return ResponseEntity.ok(userParkolo);
    }

    @GetMapping("/loadPlots")
    public ResponseEntity<?> getFreePlots() {
        List<Parkolo> parkolohelyek = springmanager.getParkingPlots(); //itt lekérem az összeset

        //Map of struktúra visszaküldése amiben: Map.of(parkolo_id, id-hoz tartozó lejárati idő)
//        Map<Integer, Long> result = new HashMap<>();
//        LocalDateTime now = LocalDateTime.now();
//        for (Parkolo item : parkolohelyek)
//        {
//            if(item.getTo_date() != null)
//            {
//                LocalDateTime toDate = item.getTo_date();
//                Duration duration = Duration.between(now, toDate);
//                result.put(item.getParkolo_id(),duration.toMinutes());
//            }
//            else
//            {
//                result.put(item.getParkolo_id(),Long.valueOf(0));
//            }
//
//        }
//        return ResponseEntity.ok(result);
        return ResponseEntity.ok(parkolohelyek);
    }

}
