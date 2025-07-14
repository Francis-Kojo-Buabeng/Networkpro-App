package com.networkpro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class LinkedInApplication {

	public static void main(String[] args) {
		SpringApplication.run(LinkedInApplication.class, args);
	}

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
}
