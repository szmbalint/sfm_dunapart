package Frontend;

import javafx.fxml.FXML;
import javafx.scene.control.PasswordField;

import java.awt.*;


public class MainRegisterController {

    @FXML
    public TextField reg_email;

    @FXML
    public PasswordField reg_password;

    @FXML
    public PasswordField reg_password_again;

    @FXML
    public Button reg_button;

    @FXML
    public Button to_login_button;


    public TextField getReg_email() {
        return reg_email;
    }

    public PasswordField getReg_password() {
        return reg_password;
    }

    public PasswordField getReg_password_again() {
        return reg_password_again;
    }

}
