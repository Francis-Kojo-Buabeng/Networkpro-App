FROM eclipse-temurin:21-jdk
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8091
ENV SPRING_PROFILES_ACTIVE=docker
ENTRYPOINT ["java","-jar","app.jar"]


