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
<<<<<<< HEAD
        return UserProfileDto.builder()
                .id(userProfile.getId())
                .fullName(userProfile.getFullName())
=======
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
>>>>>>> c725ed53c12d29997f15d402a39501f72ae3b4bb
                .headline(userProfile.getHeadline())
                .summary(userProfile.getBio())
                .location(userProfile.getLocation())
                .industry(userProfile.getIndustry())
                .profilePictureUrl(userProfile.getProfilePictureUrl())
                .website(userProfile.getWebsite())
                .phoneNumber(userProfile.getPhoneNumber())
                .emailVerified(userProfile.isEmailVerified())
                .profileCompletionPercentage(userProfile.getProfileCompletionPercentage())
                .profilePublic(userProfile.isProfilePublic())
                .contactInfoPublic(userProfile.isContactInfoPublic())
                .workExperiencePublic(userProfile.isWorkExperiencePublic())
                .educationPublic(userProfile.isEducationPublic())
                .skillsPublic(userProfile.isSkillsPublic())
                .currentPosition(userProfile.getCurrentPosition())
                .currentCompany(userProfile.getCurrentCompany())
                .skills(userProfile.getSkills() != null ? userProfile.getSkills().stream().toList() : null)
                .isProfileComplete(userProfile.getProfileCompletionPercentage() >= 100)
                .createdAt(userProfile.getProfileCreatedAt())
                .updatedAt(userProfile.getProfileUpdatedAt())
                .build();
    }

    public UserProfile toEntity(UserProfileDto dto) {
        if (dto == null) return null;
        UserProfile userProfile = new UserProfile();
<<<<<<< HEAD
        userProfile.setFullName(dto.getFullName());
=======
        userProfile.setFullName(dto.getFirstName() + " " + dto.getLastName());
>>>>>>> c725ed53c12d29997f15d402a39501f72ae3b4bb
        userProfile.setHeadline(dto.getHeadline());
        userProfile.setBio(dto.getSummary());
        userProfile.setLocation(dto.getLocation());
        userProfile.setIndustry(dto.getIndustry());
        userProfile.setProfilePictureUrl(dto.getProfilePictureUrl());
        userProfile.setWebsite(dto.getWebsite());
        userProfile.setPhoneNumber(dto.getPhoneNumber());
<<<<<<< HEAD
        userProfile.setEmailVerified(dto.isEmailVerified());
        userProfile.setProfilePublic(dto.isProfilePublic());
        userProfile.setContactInfoPublic(dto.isContactInfoPublic());
        userProfile.setWorkExperiencePublic(dto.isWorkExperiencePublic());
        userProfile.setEducationPublic(dto.isEducationPublic());
        userProfile.setSkillsPublic(dto.isSkillsPublic());
        userProfile.setCurrentPosition(dto.getCurrentPosition());
        userProfile.setCurrentCompany(dto.getCurrentCompany());
        if (dto.getSkills() != null) userProfile.setSkills(new java.util.HashSet<>(dto.getSkills()));
=======
        userProfile.setProfilePublic(true); // Set public by default
>>>>>>> c725ed53c12d29997f15d402a39501f72ae3b4bb
        return userProfile;
    }

        public UserProfile toEntity(UserProfileUpdateDto dto) {
                if (dto == null)
                        return null;
                UserProfile userProfile = new UserProfile();
                userProfile.setFullName(dto.getFullName());
                userProfile.setEmail(dto.getEmail());
                userProfile.setHeadline(dto.getHeadline());
                userProfile.setBio(dto.getSummary());
                userProfile.setLocation(dto.getLocation());
                userProfile.setIndustry(dto.getIndustry());
                userProfile.setWebsite(dto.getWebsite());
                userProfile.setPhoneNumber(dto.getPhoneNumber());
                userProfile.setProfilePublic(dto.isProfilePublic());
                userProfile.setContactInfoPublic(dto.isContactInfoPublic());
                userProfile.setWorkExperiencePublic(dto.isWorkExperiencePublic());
                userProfile.setEducationPublic(dto.isEducationPublic());
                userProfile.setSkillsPublic(dto.isSkillsPublic());
                userProfile.setCurrentPosition(dto.getCurrentPosition());
                userProfile.setCurrentCompany(dto.getCurrentCompany());
                if (dto.getSkills() != null)
                        userProfile.setSkills(new java.util.HashSet<>(dto.getSkills()));
                return userProfile;
        }

        public PrivacySettingsDto toPrivacySettingsDto(UserProfile userProfile) {
                if (userProfile == null)
                        return null;

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