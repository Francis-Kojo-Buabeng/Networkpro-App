package com.networkpro.user_service.service.user;

import com.networkpro.user_service.model.UserProfile;
import com.networkpro.user_service.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    // Create new user profile
    public UserProfile createUserProfile(UserProfile userProfile) {
        log.info("Creating new user profile");
        return userProfileRepository.save(userProfile);
    }

    // Get user profile by ID
    public Optional<UserProfile> getUserProfileById(Long id) {
        log.info("Fetching user profile with ID: {}", id);
        return userProfileRepository.findById(id);
    }

    // Update user profile
    public UserProfile updateUserProfile(Long id, UserProfile updatedProfile) {
        log.info("Updating user profile with ID: {}", id);
        return userProfileRepository.findById(id)
                .map(existingProfile -> {
                    // Update fields while preserving ID and email
                    existingProfile.setFullName(updatedProfile.getFullName());
                    existingProfile.setBio(updatedProfile.getBio());
                    existingProfile.setLocation(updatedProfile.getLocation());
                    existingProfile.setProfilePictureUrl(updatedProfile.getProfilePictureUrl());
                    existingProfile.setCurrentPosition(updatedProfile.getCurrentPosition());
                    existingProfile.setCurrentCompany(updatedProfile.getCurrentCompany());
                    existingProfile.setIndustry(updatedProfile.getIndustry());
                    existingProfile.setHeadline(updatedProfile.getHeadline());
                    existingProfile.setPhoneNumber(updatedProfile.getPhoneNumber());
                    existingProfile.setWebsite(updatedProfile.getWebsite());
                    existingProfile.setLinkedinUrl(updatedProfile.getLinkedinUrl());
                    existingProfile.setGithubUrl(updatedProfile.getGithubUrl());
                    
                    // Update privacy settings
                    existingProfile.setProfilePublic(updatedProfile.isProfilePublic());
                    existingProfile.setContactInfoPublic(updatedProfile.isContactInfoPublic());
                    existingProfile.setWorkExperiencePublic(updatedProfile.isWorkExperiencePublic());
                    existingProfile.setEducationPublic(updatedProfile.isEducationPublic());
                    existingProfile.setSkillsPublic(updatedProfile.isSkillsPublic());
                    
                    return userProfileRepository.save(existingProfile);
                })
                .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + id));
    }

    // Delete user profile
    public void deleteUserProfile(Long id) {
        log.info("Deleting user profile with ID: {}", id);
        userProfileRepository.deleteById(id);
    }

    // Search public profiles
    public List<UserProfile> searchPublicProfiles(String fullName, String location, String company, String industry) {
        log.info("Searching public profiles with criteria - name: {}, location: {}, company: {}, industry: {}", 
                fullName, location, company, industry);
        return userProfileRepository.searchPublicProfiles(fullName, location, company, industry);
    }

    // Find users by skill
    public List<UserProfile> findUsersBySkill(String skill) {
        log.info("Finding users with skill: {}", skill);
        return userProfileRepository.findBySkill(skill);
    }

    // Find users by skills
    public List<UserProfile> findUsersBySkills(List<String> skills) {
        log.info("Finding users with skills: {}", skills);
        return userProfileRepository.findBySkillsIn(skills);
    }

    // Find users by location
    public List<UserProfile> findUsersByLocation(String location) {
        log.info("Finding users in location: {}", location);
        return userProfileRepository.findByLocationContainingIgnoreCase(location);
    }

    // Find users by company
    public List<UserProfile> findUsersByCompany(String company) {
        log.info("Finding users at company: {}", company);
        return userProfileRepository.findByCurrentCompanyContainingIgnoreCase(company);
    }

    // Get all public profiles
    public List<UserProfile> getAllPublicProfiles() {
        log.info("Fetching all public profiles");
        return userProfileRepository.findByProfilePublicTrue();
    }

    // Get profiles with completion percentage above threshold
    public List<UserProfile> getProfilesWithCompletionAbove(int threshold) {
        log.info("Fetching profiles with completion percentage above: {}", threshold);
        return userProfileRepository.findByProfileCompletionPercentageGreaterThan(threshold);
    }

    // Add skill to user profile
    public UserProfile addSkillToProfile(Long userId, String skill) {
        log.info("Adding skill '{}' to user profile with ID: {}", skill, userId);
        return userProfileRepository.findById(userId)
                .map(profile -> {
                    profile.getSkills().add(skill);
                    return userProfileRepository.save(profile);
                })
                .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + userId));
    }

    // Remove skill from user profile
    public UserProfile removeSkillFromProfile(Long userId, String skill) {
        log.info("Removing skill '{}' from user profile with ID: {}", skill, userId);
        return userProfileRepository.findById(userId)
                .map(profile -> {
                    profile.getSkills().remove(skill);
                    return userProfileRepository.save(profile);
                })
                .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + userId));
    }

    // Update user skills
    public UserProfile updateUserSkills(Long userId, Set<String> skills) {
        log.info("Updating skills for user profile with ID: {}", userId);
        return userProfileRepository.findById(userId)
                .map(profile -> {
                    profile.setSkills(skills);
                    return userProfileRepository.save(profile);
                })
                .orElseThrow(() -> new RuntimeException("User profile not found with ID: " + userId));
    }

    // Get profile completion percentage
    public int getProfileCompletionPercentage(Long userId) {
        return userProfileRepository.findById(userId)
                .map(UserProfile::getProfileCompletionPercentage)
                .orElse(0);
    }
} 