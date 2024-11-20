package Frontend;

import com.dunapart.ParkoloApp.SpringManager;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class JavaFXMain extends Application {

    static Manager manager = new SpringManager();

    public static void main(String[] args) {
        launch(args);
    }
    @Override
    public void start(Stage stage) throws Exception {
        try
        {
            Parent root = FXMLLoader.load(getClass().getResource("/fxml/MainRegister.fxml"));
            stage.setScene(new Scene(root));
            stage.show();

            manager.startBackend();
            System.out.println("Spring -> "+ manager.getUserEmail());
        }
        catch(Exception ex)
        {
            System.out.println("Javafx failed baszdmeg");
            ex.printStackTrace();
        }


    }

    @Override
    public void stop() throws Exception {
        manager.stopBackend();
        super.stop();
    }
}
