package com.dunapart.ParkoloApp;

import Frontend.APIManager;
import com.dunapart.ParkoloApp.Backend.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

//@SpringBootApplication
@Service
public class APISpringManager implements APIManager {

    private final FelhasznaloRepository felhasznaloRepository;
    private final AutokRepository autokRepository;
    private final ParkoloRepository parkoloRepository;
    @Autowired
    public APISpringManager(FelhasznaloRepository felhasznaloRepository,AutokRepository autokRepository, ParkoloRepository parkoloRepository)
    {
        this.felhasznaloRepository = felhasznaloRepository;
        this.parkoloRepository = parkoloRepository;
        this.autokRepository = autokRepository;
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
                //System.out.println(autoi);
        }

        return autok;
    }

    @Override
    public Autok findCarByID(List<Autok> Autok, long ID){

    try {
        for (Autok auto : Autok) {


            if (auto.getAuto_id() == ID) {

                return auto;

            }
        }
    }
    catch (Exception e) {
        System.out.println(e);
    }
        return null;
    }

    @Override
    public String updateCarByID(Autok Auto, String rendszam, String color, String name, String type)
    {
        try{
            Auto.setRendszam(rendszam);
            Auto.setColor(color);
            Auto.setName(name);
            Auto.setType(type);

            autokRepository.save(Auto);
            return "OK";
        }
        catch (Exception e) {
            System.out.println("error while updateing the car datas" + e);
            return "error";
        }
    }

    @Transactional
    @Override
    public String deleteCarByID(Autok Auto)
    {
        try
        {
//            autokRepository.delete(Auto);
//            autokRepository.flush();
            autokRepository.deleteByIdCustom(Auto.getAuto_id());
            if(autokRepository.existsById(Auto.getAuto_id()))
            {
                System.out.println("Hiba! Az autó még törlés után is létezik!!");
                return "nOK";
            }
            autokRepository.flush();
            

            System.out.println("Is transaction active: " + TransactionSynchronizationManager.isActualTransactionActive());
            System.out.println("Törlendő autó: " + Auto);
            System.out.println("Autó ID: " + Auto.getAuto_id());
            return "OK";
        }
        catch (Exception e){
            System.out.println("error while deleteing the car" + e);
            return "error";
        }
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

    public List<Parkolo> getParkingPlots() {
        List<Parkolo> result = new ArrayList<>();
        result = parkoloRepository.findAll();
        return result;
    }

    public Autok getUserCarById(long autoId) {
        return autokRepository.findById(autoId)
                .orElseThrow(() -> new EntityNotFoundException("Autó nem található az ID alapján: " + autoId));

    }

    public String updateParkoloById(Parkolo parkolo, LocalDateTime to_date, LocalDateTime from_date) {
        try
        {
//            System.out.println(parkolo.getFrom_date());
//            System.out.println(parkolo.getTo_date());
            parkolo.setFrom_date(from_date);
            parkolo.setTo_date(to_date);
            parkolo.setStatus(!parkolo.isStatus());

            parkoloRepository.save(parkolo);
            return "OK";
        }
        catch(Exception ex)
        {
            System.out.println("Exception has thrown in method: updateParkoloById");
            return "nOK";
        }
    }

    public Parkolo getParkingPlotById(long selectedPlot)
    {
        Parkolo parkolo = parkoloRepository.getReferenceById(selectedPlot);
        return parkolo;
    }

    public String updateAuto(Autok wannaSaveAuto, Parkolo wanna_park_here)
    {
        try
        {
            wannaSaveAuto.setParkolo(wanna_park_here);
            autokRepository.save(wannaSaveAuto);
            return "OK";
        }
        catch(Exception ex)
        {
            System.out.println("Exception has thrown in method: updateAuto");
            return "nOK";
        }
    }

    public String addUserCar(Felhasznalo felhasznalo, int meret, String rendszam, String color, String name, String type)
    {
        try
        {
            Autok auto = Autok.builder()
                    .felhasznalo(felhasznalo)
                    .meret(meret)
                    .rendszam(rendszam)
                    .color(color)
                    .name(name)
                    .type(type)
                    .build();
            autokRepository.save(auto);
            return "OK";
        }
        catch(Exception ex)
        {

            return "nOK";
        }


    }

    public boolean isRendszamExist(String rendszam) {
        if(autokRepository.existsByRendszam(rendszam))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    public Felhasznalo findUserById(long userId) {
        return felhasznaloRepository.findById(userId).get();

    }
}
