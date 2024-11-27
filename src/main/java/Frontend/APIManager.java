package Frontend;

import com.dunapart.ParkoloApp.Backend.Felhasznalo;

public interface APIManager {

    public String isUserValid(String email, String passwd);
    public void saveUser(String firstName, String lastName, String passwd, String email);
    public Felhasznalo findUserByEmail(String email);

}
