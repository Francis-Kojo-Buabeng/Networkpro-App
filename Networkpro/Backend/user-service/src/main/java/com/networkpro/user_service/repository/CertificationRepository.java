package com.networkpro.user_service.repository;

import com.networkpro.user_service.model.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CertificationRepository extends JpaRepository<Certification, Long> {
    
    // Find certifications by user profile
    List<Certification> findByUserProfileId(Long userProfileId);
    
    // Find certifications by name
    List<Certification> findByNameContainingIgnoreCase(String name);
    
    // Find certifications by issuing organization
    List<Certification> findByIssuingOrganizationContainingIgnoreCase(String organization);
    
    // Find certifications by credential ID
    List<Certification> findByCredentialId(String credentialId);
    
    // Find active certifications (not expired)
    @Query("SELECT c FROM Certification c WHERE c.expirationDate IS NULL OR c.expirationDate > :currentDate")
    List<Certification> findActiveCertifications(@Param("currentDate") LocalDate currentDate);
    
    // Find expired certifications
    @Query("SELECT c FROM Certification c WHERE c.expirationDate IS NOT NULL AND c.expirationDate <= :currentDate")
    List<Certification> findExpiredCertifications(@Param("currentDate") LocalDate currentDate);
    
    // Find certifications expiring soon
    @Query("SELECT c FROM Certification c WHERE c.expirationDate BETWEEN :startDate AND :endDate")
    List<Certification> findCertificationsExpiringBetween(@Param("startDate") LocalDate startDate, 
                                                        @Param("endDate") LocalDate endDate);
    
    // Find certifications by skills
    @Query("SELECT c FROM Certification c WHERE c.skills LIKE %:skill%")
    List<Certification> findBySkillsContaining(@Param("skill") String skill);
    
    // Find certifications by user and organization
    List<Certification> findByUserProfileIdAndIssuingOrganizationContainingIgnoreCase(Long userProfileId, String organization);
    
    // Find certifications that don't expire
    List<Certification> findByDoesNotExpireTrue();
    
    // Find certifications by issue date range
    @Query("SELECT c FROM Certification c WHERE c.issueDate BETWEEN :startDate AND :endDate")
    List<Certification> findByIssueDateBetween(@Param("startDate") LocalDate startDate, 
                                             @Param("endDate") LocalDate endDate);
} 