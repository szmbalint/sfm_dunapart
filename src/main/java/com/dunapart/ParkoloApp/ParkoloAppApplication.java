package com.dunapart.ParkoloApp;

import com.dunapart.ParkoloApp.Backend.User;
import com.dunapart.ParkoloApp.Backend.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ParkoloAppApplication implements CommandLineRunner {

	@Autowired
	UserRepository userRepository;
	public static void main(String[] args) {
		SpringApplication.run(ParkoloAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		User u = User.builder().email("proba@mail.com") //ide majd implementálni kell azt, ha a textboxba beír valamit a user akkor az legyen a proba helyett
				.password("probajelszo")
				.build();

		userRepository.save(u);
		System.out.println("db -> " + userRepository.findByEmail("proba@mail.com"));

	}
}
