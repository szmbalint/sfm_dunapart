package Frontend;

public interface Manager {

    public void startBackend();
    public void stopBackend();
    public String getUserEmail();

    public void saveUser(String email, String pass);
}
