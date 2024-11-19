package Frontend;

import javafx.fxml.FXML;
import javafx.scene.control.PasswordField;

import java.awt.*;


public class MainRegisterController {

    @FXML
    public static TextField Reg_Email_box;

    @FXML
    public static PasswordField Reg_Pass_box;

    @FXML
    public static PasswordField Reg_Pass_box_rep;

    @FXML
    public Button reg_button;

    @FXML
    public Button to_login_button;


    public static String getReg_email() {
        return Reg_Email_box.getText();
    }

    public static String getReg_password() {
        return Reg_Pass_box.getText();
    }

    public static String getReg_password_again() {
        return Reg_Pass_box_rep.getText();
    }

    @FXML
    public void SetLoginCred(ActionEvent actionEvent)
    {
        String email = getReg_email();
        String pass = getReg_password();
//        SpringManager.manager.saveUser(email,pass);
//        SpringManager.manager.
    }


}
