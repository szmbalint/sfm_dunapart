package com.dunapart.ParkoloApp.Backend;

import com.dunapart.ParkoloApp.APISpringManager;
import com.dunapart.ParkoloApp.Backend.Model.LoginRequest;
import com.dunapart.ParkoloApp.Backend.Model.RegiRequest;
import com.dunapart.ParkoloApp.JwtUtil;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
@SpringBootApplication
public class DataController {

    private final APISpringManager springmanager;
    private final JwtUtil jwtUtil; // JWT segédosztály


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

        try
        {
            String email = userHeader.substring(7); // email kinyerése
            Felhasznalo user = springmanager.findUserByEmail(email);
            long userID = user.getFelhasznalo_id();

            List<Autok> userCars = springmanager.findCars(userID);
//            userCars.forEach(car -> Hibernate.initialize(car.getParkolo()));
            return ResponseEntity.ok(userCars);
        }
        catch(Exception ex)
        {
            System.out.println("A hiba:::::::" + ex.toString() + "\n" + ex.getMessage());
            return null;
        }

    }


    @PostMapping("/addCar")
    public ResponseEntity<?> addUserCar(@RequestHeader("email") String email, @RequestHeader("meret") int meret, @RequestHeader("rendszam") String rendszam,
                                        @RequestHeader("color") String color, @RequestHeader("name") String name,@RequestHeader("type") String type)
    {
        Felhasznalo felhasznalo = springmanager.findUserByEmail(email);

        if(springmanager.isRendszamExist(rendszam))
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Ilyen rendszámmal már létezik autó!");
        }

        String itWasASuccess = springmanager.addUserCar(felhasznalo, meret, rendszam, color,name,type);
        if(itWasASuccess.equals("OK"))
        {
            return ResponseEntity.status(HttpStatus.CREATED).body("Az autó hozzáadásra került");
        }
        else
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Az autó nem került hozzáadásra");
        }
    }
    @PostMapping("/editCar")
    public ResponseEntity<?> editUserCar(@RequestHeader("email") String userHeader, @RequestHeader("rendszam") String rendszam,
                                         @RequestHeader("color") String color, @RequestHeader("name") String name,@RequestHeader("type") String type, @RequestHeader("auto_id") int ID) {


        if (rendszam == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing or invalid rendszam");
        }

        String email = userHeader;
        Felhasznalo user = springmanager.findUserByEmail(email);
        long userID = user.getFelhasznalo_id();
        List<Autok> userCars = springmanager.findCars(userID);
        Autok userCar = springmanager.findCarByID(userCars, ID);

        System.out.println(userCar);

        String succes = springmanager.updateCarByID(userCar, rendszam,color,name,type);
        if(succes.equals("OK"))
        {
            return ResponseEntity.status(HttpStatus.OK).body(userCar.getAuto_id() + " Frissitesre sikeres");
        }
        else
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Az auto adatainak frissitese sikertelen!");
        }
    }

    @PostMapping("/deleteCar")
    public ResponseEntity<?> deleteUserCar(@RequestHeader("email") String userHeader,@RequestHeader("auto_id") long ID) {

        if(ID == 0)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing or invalid ID");
        }
        else
        {
            String email = userHeader;
            Felhasznalo user = springmanager.findUserByEmail(email);
            long userID = user.getFelhasznalo_id();
            List<Autok> userCars = springmanager.findCars(userID);
            Autok userCar = springmanager.findCarByID(userCars, ID);

            String succes = springmanager.deleteCarByID(userCar);
            if(succes.equals("OK"))
            {
                return ResponseEntity.status(HttpStatus.OK).body("Autó törlés sikeres");
            }
            else if(succes.equals("nOK"))
            {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Sikertelen autó törlés");
            }
            else
            {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Sikertelen autó törlés");
            }
        }
    }

    @PostMapping("/forgotPassword")
    public ResponseEntity<?> resetPassword( @RequestHeader("email") String email,@RequestHeader("newpasswd") String newpasswd)
    {
        try
        {
            Felhasznalo user = springmanager.findUserByEmail(email);
            springmanager.saveUser(user.getFirstName(),user.getLastName(),newpasswd,user.getEmail());
            return ResponseEntity.status(HttpStatus.OK).body("Sikeres jelszó módosítás");
        }
        catch(Exception ex)
        {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Sikertelen jelszó módosítás");
        }
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

        List<Long> userParkolo = new ArrayList<>();

        for (Autok car : userCars) {
            userParkolo.add(car.getParkolo().getParkolo_id());
        }

        return ResponseEntity.ok(userParkolo);
    }

    @GetMapping("/loadPlots")
    public ResponseEntity<?> getFreePlots() {
        List<Parkolo> parkolohelyek = springmanager.getParkingPlots(); //itt lekérem az összeset
        return ResponseEntity.ok(parkolohelyek);
    }

    //frontendről meg kell kapni azt is hogy melyik autót akarja parkoltatni a felhasználó
    //az auto_id + parkolo_id-t megkapja a frontendről
    @PostMapping("/saveBookingDate")
    public ResponseEntity<?> saveBookingDate(@RequestHeader("to_date") String to_date_string, @RequestHeader("from_date") String from_date_string, @RequestHeader("auto_id") long auto_id, @RequestHeader("parkolo_id") long selected_plot)
    {
        //time stuffs
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime to_date = LocalDateTime.parse(to_date_string,formatter);
        LocalDateTime from_date = LocalDateTime.parse(from_date_string,formatter);

        //repo stuffs
        Autok wanna_save_auto = springmanager.getUserCarById(auto_id);
        Parkolo wanna_park_here = springmanager.getParkingPlotById(selected_plot);

        //vizsgálat ha a parkoló mérete kisebb mint az autó mérete akkor hibát neki had rágja
        if(wanna_save_auto.getMeret() < wanna_park_here.getMeret())
        {
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).body("Hiba! Nem megfelelő parkolóméret");
        }

        String parkoloFrissitese = springmanager.updateParkoloById(wanna_park_here, to_date, from_date);
        String autoFrissitese = springmanager.updateAuto(wanna_save_auto,wanna_park_here);

        if(parkoloFrissitese.equals("OK") && autoFrissitese.equals("OK"))//frissítésre került
        {
            return ResponseEntity.status(HttpStatus.CREATED).body("Foglalás hozzáadva");
        }
        else
        {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Hiba a foglalás mentése során");
        }

    }

    @PostMapping("/deleteBookedPlot")
    public ResponseEntity<?> deleteBookedPlot(@RequestHeader("parkolo_id") long parkolo_id, @RequestHeader("auto_id") long auto_id)
    {
        String result = springmanager.deleteBooking(parkolo_id, auto_id);
        if(result.equals("OK"))
        {
            return ResponseEntity.status(HttpStatus.OK).body("Foglalás törölve");
        }
        else
        {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Foglalás nem lett törölve");
        }

    }

    @PostMapping("/saveBookingDate")
    public ResponseEntity<?> saveBookingDate(@RequestHeader("to_date") String to_date_string, @RequestHeader("parkolo_id") long selected_plot)
    {
        //time stuffs
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime to_date = LocalDateTime.parse(to_date_string,formatter);

        String result = springmanager.modifyBookingDate(to_date, selected_plot);
        if(result.equals("OK"))
        {
            return ResponseEntity.status(HttpStatus.OK).body("A foglalás meghosszabbítva");
        }
        else
        {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("Foglalás nem lett meghosszabbítva");
        }
    }

}
