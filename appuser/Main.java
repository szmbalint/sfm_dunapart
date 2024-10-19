import appuser.AppUser;

public static void main(String[] args) {
    appuser.MySQLUserLoader loader = new appuser.MySQLUserLoader();
    List<appuser.AppUser> users = loader.loadUsers();

    for (AppUser user : users) {
        System.out.println(user);
    }
}