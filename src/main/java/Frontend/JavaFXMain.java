package Frontend;

import com.dunapart.ParkoloApp.SpringManager;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class JavaFXMain extends Application {

    static Manager manager = new SpringManager();

    @Override
    public void start(Stage stage) throws Exception {
        Parent root = FXMLLoader.load(getClass().getResource("/fxml/MainRegister.fxml"));
        stage.setScene(new Scene(root));
        stage.show();

        manager.startBackend();
        System.out.println("Spring -> "+ manager.getUserEmail());

    }

    @Override
    public void stop() throws Exception {
        manager.stopBackend();
        super.stop();
    }
}
