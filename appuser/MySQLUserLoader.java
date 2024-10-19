package appuser;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MySQLUserLoader {

    private static final String URL = "jdbc:mysql://localhost:5432/your_database";
    private static final String USER = "your_username";
    private static final String PASSWORD = "your_password";

    public List<appuser.AppUser> loadUsers(){
        List<AppUser> users = new ArrayList<>();

        try(Connection connection = DriverManager.getConnection(URL, USER,PASSWORD)){
            String query = "SELECT id, username, password FROM users";
            PreparedStatement statement = connection.prepareStatement(query);
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()){
                int id = resultSet.getInt("id");
                String username = resultSet.getString("username");
                String password = resultSet.getString("password");

                AppUser user = new AppUser(id, username, password);
                users.add(user);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return users;
    }
}
