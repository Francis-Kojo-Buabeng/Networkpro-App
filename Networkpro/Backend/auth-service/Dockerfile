<<<<<<< HEAD
 FROM eclipse-temurin:21-jdk
ARG JAR_FILE=target/*.jar
COPY ./target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]


=======
FROM openjdk:21-slim
WORKDIR /app
COPY target/auth-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8090
ENTRYPOINT ["java", "-jar", "app.jar"]
>>>>>>> c725ed53c12d29997f15d402a39501f72ae3b4bb
