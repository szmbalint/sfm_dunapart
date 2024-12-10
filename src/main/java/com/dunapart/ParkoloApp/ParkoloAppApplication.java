package com.dunapart.ParkoloApp;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.dunapart.ParkoloApp.Backend")
public class ParkoloAppApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(ParkoloAppApplication.class, args);
		System.out.println("main in");
	}

	@Override
	public void run(String... args) throws Exception {


	}
}
