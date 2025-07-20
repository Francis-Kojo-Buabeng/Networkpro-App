package com.networkpro.user_service;

import com.networkpro.user_service.model.UserProfile;
import com.networkpro.user_service.repository.UserProfileRepository;
import java.util.Set;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

	@Bean
	public org.springframework.boot.CommandLineRunner addDefaultUser(UserProfileRepository userProfileRepository) {
		return args -> {
			String defaultFullName = "Test User";
			boolean userExists = !userProfileRepository.findByFullNameContainingIgnoreCase(defaultFullName).isEmpty();
			if (!userExists) {
				UserProfile user = UserProfile.builder()
						.fullName(defaultFullName)
						.bio("This is a default test user.")
						.location("Test City")
						.profilePictureUrl("")
						.phoneNumber("123-456-7890")
						.website("https://example.com")
						.linkedinUrl("https://linkedin.com/in/testuser")
						.githubUrl("https://github.com/testuser")
						.profilePublic(true)
						.contactInfoPublic(true)
						.workExperiencePublic(true)
						.educationPublic(true)
						.skillsPublic(true)
						.currentPosition("Developer")
						.currentCompany("Test Company")
						.industry("Software")
						.headline("Testing is my passion!")
						.skills(Set.of("Java", "Spring Boot", "PostgreSQL"))
						.build();
				userProfileRepository.save(user);
				System.out.println("Default test user created: " + defaultFullName);
			} else {
				System.out.println("Default test user already exists: " + defaultFullName);
			}
		};
	}
}
