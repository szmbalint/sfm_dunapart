package Frontend;

import com.dunapart.ParkoloApp.Backend.Autok;
import com.dunapart.ParkoloApp.Backend.Felhasznalo;

import java.util.List;

public interface APIManager {

    public String isUserValid(String email, String passwd);

    Autok findCarByID(List<Autok> Autok, long ID);

    public String updateCarByID(Autok Auto, String rendszam, String color, String name, String type);

    public String deleteCarByID(Autok Auto);

    public void saveUser(String firstName, String lastName, String passwd, String email);
    public Felhasznalo findUserByEmail(String email);
    public List<Autok> findCars(long userID);

}
