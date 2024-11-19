package com.dunapart.ParkoloApp;

import com.dunapart.ParkoloApp.Backend.Felhasznalo;
import com.dunapart.ParkoloApp.Backend.FelhasznaloRepository;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ParkoloAppApplication implements CommandLineRunner {

	@Autowired
	FelhasznaloRepository felhasznaloRepository;


	public static void main(String[] args) {
		SpringApplication.run(ParkoloAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
//		Parent root = FXMLLoader.load(getClass().getResource("/fxml/"))


		Felhasznalo u = Felhasznalo.builder()
				.email("proba@mail.com") //ide majd implementálni kell azt, ha a textboxba beír valamit a user akkor az legyen a proba helyett
				.password("probajelszo")
				.build();
		Felhasznalo u2 = Felhasznalo.builder()
				.email("proba2@mail.com")
				.password("proba2jelszo")
				.build();

		felhasznaloRepository.save(u);
		felhasznaloRepository.save(u2);
		System.out.println("db -> " + felhasznaloRepository.findAll());

	}
}
