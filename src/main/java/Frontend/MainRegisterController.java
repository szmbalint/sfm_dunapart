package Frontend;


import com.dunapart.ParkoloApp.Backend.Felhasznalo;
import com.dunapart.ParkoloApp.Backend.FelhasznaloRepository;
import com.dunapart.ParkoloApp.ParkoloAppApplication;
import com.dunapart.ParkoloApp.SpringContextProvider;
import com.dunapart.ParkoloApp.SpringManager;
import javafx.fxml.FXML;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import org.springframework.beans.factory.annotation.Autowired;

import javafx.scene.control.Button;
import java.awt.event.ActionEvent;


public class MainRegisterController {

    @FXML
    public TextField Reg_Email_box;

    @FXML
    public PasswordField Reg_Pass_box;

    @FXML
    public PasswordField Reg_Pass_box_rep;

    @FXML
    public Button reg_button;

    @FXML
    public Button to_login_button;

    @FXML
    public void SetLoginCred(javafx.event.ActionEvent actionEvent)
    {
        String email = Reg_Email_box.getText();
        String pass = Reg_Pass_box.getText();

        Felhasznalo f = Felhasznalo.builder()
                .email(email)
                .password(pass)
                .build();
        System.out.println(f);

        FelhasznaloRepository felhasznaloRepository = SpringContextProvider.getBean(FelhasznaloRepository.class);
        felhasznaloRepository.save(f);
        System.out.println("Mentve -> " + felhasznaloRepository.findByEmail(email));

    }


}
