package Frontend;

public interface APIManager {

    public String isUserValid(String email, String passwd);
    public void saveUser(String firstName, String lastName, String passwd, String email);

}
