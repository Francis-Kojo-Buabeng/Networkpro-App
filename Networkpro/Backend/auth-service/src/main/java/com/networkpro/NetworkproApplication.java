package com.networkpro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class NetworkproApplication {

	public static void main(String[] args) {
		SpringApplication.run(NetworkproApplication.class, args);
	}

<<<<<<< HEAD:Networkpro/Backend/auth-service/src/main/java/com/networkpro/LinkedInApplication.java
	@Configuration
	public class WebConfig {
		@Bean
		public WebMvcConfigurer corsConfigurer() {
			return new WebMvcConfigurer() {
				@Override
				public void addCorsMappings(CorsRegistry registry) {
					registry.addMapping("/**")
							.allowedOrigins("*") // Or specify your frontend URL
							.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
							.allowedHeaders("*");
				}
			};
		}
	}
=======
>>>>>>> d0f9877a67400cd0cf364fb90e78c660c8eb5486:Networkpro/Backend/auth-service/src/main/java/com/networkpro/NetworkproApplication.java
}
