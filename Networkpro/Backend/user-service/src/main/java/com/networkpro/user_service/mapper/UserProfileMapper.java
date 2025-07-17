package com.networkpro.user_service.mapper;

import com.networkpro.user_service.dto.user.UserProfileDto;
import com.networkpro.user_service.dto.user.UserProfileUpdateDto;
import com.networkpro.user_service.dto.privacy.PrivacySettingsDto;
import com.networkpro.user_service.model.UserProfile;
import org.springframework.stereotype.Component;

@Component
public class UserProfileMapper {

    public UserProfileDto toDto(UserProfile userProfile) {
        if (userProfile == null) return null;
        String firstName = null;
        String lastName = null;
        if (userProfile.getFullName() != null) {
            String[] parts = userProfile.getFullName().trim().split(" ", 2);
            firstName = parts[0];
            lastName = parts.length > 1 ? parts[1] : null;
        }
        return UserProfileDto.builder()
                .id(userProfile.getId())
                .firstName(firstName)
                .lastName(lastName)
                .headline(userProfile.getHeadline())
                .summary(userProfile.getBio())
                .location(userProfile.getLocation())
                .industry(userProfile.getIndustry())
                .profilePictureUrl(userProfile.getProfilePictureUrl())
                .website(userProfile.getWebsite())
                .phoneNumber(userProfile.getPhoneNumber())
                .skills(userProfile.getSkills() != null ? userProfile.getSkills().stream().toList() : null)
                .isProfileComplete(userProfile.getProfileCompletionPercentage() >= 100)
                .profileCompletionPercentage(userProfile.getProfileCompletionPercentage())
                .createdAt(userProfile.getProfileCreatedAt())
                .updatedAt(userProfile.getProfileUpdatedAt())
                .build();
    }

    public UserProfile toEntity(UserProfileDto dto) {
        if (dto == null) return null;
        
        UserProfile userProfile = new UserProfile();
        userProfile.setFullName(dto.getFirstName() + " " + dto.getLastName());
        userProfile.setHeadline(dto.getHeadline());
        userProfile.setBio(dto.getSummary());
        userProfile.setLocation(dto.getLocation());
        userProfile.setIndustry(dto.getIndustry());
        userProfile.setProfilePictureUrl(dto.getProfilePictureUrl());
        userProfile.setWebsite(dto.getWebsite());
        userProfile.setPhoneNumber(dto.getPhoneNumber());
        userProfile.setProfilePublic(true); // Set public by default
        return userProfile;
    }

    public UserProfile toEntity(UserProfileUpdateDto dto) {
        if (dto == null) return null;
        
        UserProfile userProfile = new UserProfile();
        userProfile.setFullName(dto.getFirstName() + " " + dto.getLastName());
        userProfile.setHeadline(dto.getHeadline());
        userProfile.setBio(dto.getSummary());
        userProfile.setLocation(dto.getLocation());
        userProfile.setIndustry(dto.getIndustry());
        userProfile.setWebsite(dto.getWebsite());
        userProfile.setPhoneNumber(dto.getPhoneNumber());
        return userProfile;
    }

    public PrivacySettingsDto toPrivacySettingsDto(UserProfile userProfile) {
        if (userProfile == null) return null;
        
        return PrivacySettingsDto.builder()
                .id(userProfile.getId())
                .profileVisible(userProfile.isProfilePublic())
                .showEmail(userProfile.isContactInfoPublic())
                .showPhone(userProfile.isContactInfoPublic())
                .showWorkExperience(userProfile.isWorkExperiencePublic())
                .showEducation(userProfile.isEducationPublic())
                .build();
    }
} 