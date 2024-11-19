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

    public void setReg_password_again(PasswordField reg_password_again) {
        this.reg_password_again = reg_password_again;
    }

    public Button getTo_login_button() {
        return to_login_button;
    }

    public void setTo_login_button(Button to_login_button) {
        this.to_login_button = to_login_button;
    }
}
