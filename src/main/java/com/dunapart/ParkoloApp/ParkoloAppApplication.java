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

		System.out.println("db -> " + felhasznaloRepository.findAll());

	}
}
