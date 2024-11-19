package Frontend;


import javafx.fxml.FXML;
import javafx.scene.control.PasswordField;

import java.awt.*;

public class MainLoginController {

    @FXML
    public TextField username;

    @FXML
    public PasswordField password;


    @FXML
    public Button log_button;

    @FXML
    public Button to_reg_button;

    public TextField getUsername() {
        return username;
    }

    public PasswordField getPassword() {
        return password;
    }
}
