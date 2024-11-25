package Frontend;

import com.dunapart.ParkoloApp.Backend.Felhasznalo;

public interface Manager {

    public void startBackend();
    public void stopBackend();
    public String getUserEmail();

    public void saveUser(String email, String pass);

    public void saveCar(String rendszam, int meret);
}
