package Frontend;

import com.dunapart.ParkoloApp.Backend.Autok;
import com.dunapart.ParkoloApp.Backend.Felhasznalo;
import com.dunapart.ParkoloApp.Backend.Parkolo;

import java.util.List;

public interface APIManager {

    public String isUserValid(String email, String passwd);
    public void saveUser(String firstName, String lastName, String passwd, String email);
    public Felhasznalo findUserByEmail(String email);
    public List<Autok> findCars(long userID);
    public List<Parkolo> getParkingPlots();

}
