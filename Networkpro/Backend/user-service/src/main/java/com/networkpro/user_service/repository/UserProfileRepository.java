package com.networkpro.user_service.repository;

import com.networkpro.user_service.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    
    // Find user by email
    Optional<UserProfile> findByEmail(String email);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Find users by full name (case-insensitive)
    List<UserProfile> findByFullNameContainingIgnoreCase(String fullName);
    
    // Find users by location
    List<UserProfile> findByLocationContainingIgnoreCase(String location);
    
    // Find users by skills
    @Query("SELECT u FROM UserProfile u JOIN u.skills s WHERE s IN :skills")
    List<UserProfile> findBySkillsIn(@Param("skills") List<String> skills);
    
    // Find users with specific skill
    @Query("SELECT u FROM UserProfile u JOIN u.skills s WHERE s = :skill")
    List<UserProfile> findBySkill(@Param("skill") String skill);
    
    // Find users by current company
    List<UserProfile> findByCurrentCompanyContainingIgnoreCase(String company);
    
    // Find users by industry
    List<UserProfile> findByIndustryContainingIgnoreCase(String industry);
    
    // Find public profiles only
    List<UserProfile> findByProfilePublicTrue();
    
    // Find users with profile completion percentage above threshold
    List<UserProfile> findByProfileCompletionPercentageGreaterThan(int threshold);
    
    // Search users by multiple criteria
    @Query("SELECT u FROM UserProfile u WHERE " +
           "(:fullName IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :fullName, '%'))) AND " +
           "(:location IS NULL OR LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:company IS NULL OR LOWER(u.currentCompany) LIKE LOWER(CONCAT('%', :company, '%'))) AND " +
           "(:industry IS NULL OR LOWER(u.industry) LIKE LOWER(CONCAT('%', :industry, '%'))) AND " +
           "u.profilePublic = true")
    List<UserProfile> searchPublicProfiles(
        @Param("fullName") String fullName,
        @Param("location") String location,
        @Param("company") String company,
        @Param("industry") String industry
    );
} 