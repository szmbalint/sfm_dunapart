package com.dunapart.ParkoloApp;

import Frontend.MainRegisterController;
import Frontend.Manager;
import com.dunapart.ParkoloApp.Backend.Felhasznalo;
import com.dunapart.ParkoloApp.Backend.FelhasznaloRepository;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.stage.Stage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
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

		//Ez akkor fut le ha rányomok a Register gombra
		//Felhasznalo u = Felhasznalo.builder()
		//		.email("proba@email.com")
		//		.password("probajelszo")
		//		.build();

		//felhasznaloRepository.save(u);


		System.out.println("db -> " + felhasznaloRepository.findAll());

	}

}




