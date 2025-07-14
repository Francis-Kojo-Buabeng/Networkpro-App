package com.networkpro.user_service.controller;

import com.networkpro.user_service.dto.user.UserProfileDto;
import com.networkpro.user_service.dto.user.UserProfileSearchDto;
import com.networkpro.user_service.dto.user.UserProfileUpdateDto;
import com.networkpro.user_service.dto.profile.ProfileCompletionDto;
import com.networkpro.user_service.dto.privacy.PrivacySettingsDto;
import com.networkpro.user_service.mapper.UserProfileMapper;
import com.networkpro.user_service.model.UserProfile;
import com.networkpro.user_service.service.user.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final UserProfileMapper mapper;

    @PostMapping
    public ResponseEntity<UserProfileDto> createUserProfile(@Valid @RequestBody UserProfileDto userProfileDto) {
        UserProfile userProfile = mapper.toEntity(userProfileDto);
        UserProfile created = userProfileService.createUserProfile(userProfile);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(created));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDto> getUserProfile(@PathVariable Long userId) {
        Optional<UserProfile> profile = userProfileService.getUserProfileById(userId);
        return profile.map(mapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{userId}/public")
    public ResponseEntity<UserProfileDto> getPublicUserProfile(@PathVariable Long userId) {
        Optional<UserProfile> profile = userProfileService.getUserProfileById(userId);
        if (profile.isPresent() && profile.get().isProfilePublic()) {
            return ResponseEntity.ok(mapper.toDto(profile.get()));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserProfileDto> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UserProfileUpdateDto updateDto) {
        UserProfile updatedProfile = mapper.toEntity(updateDto);
        UserProfile updated = userProfileService.updateUserProfile(userId, updatedProfile);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUserProfile(@PathVariable Long userId) {
        userProfileService.deleteUserProfile(userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/search")
    public ResponseEntity<List<UserProfileDto>> searchUsers(@RequestBody UserProfileSearchDto searchDto) {
        List<UserProfile> results = userProfileService.searchPublicProfiles(
            searchDto.getKeyword(), 
            searchDto.getLocation(), 
            searchDto.getCompany(), 
            searchDto.getIndustry()
        );
        List<UserProfileDto> dtos = results.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search/skills")
    public ResponseEntity<List<UserProfileDto>> getUsersBySkills(@RequestParam List<String> skills) {
        List<UserProfile> results = userProfileService.findUsersBySkills(skills);
        List<UserProfileDto> dtos = results.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search/location")
    public ResponseEntity<List<UserProfileDto>> getUsersByLocation(@RequestParam String location) {
        List<UserProfile> results = userProfileService.findUsersByLocation(location);
        List<UserProfileDto> dtos = results.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{userId}/completion")
    public ResponseEntity<ProfileCompletionDto> getProfileCompletion(@PathVariable Long userId) {
        int completionPercentage = userProfileService.getProfileCompletionPercentage(userId);
        ProfileCompletionDto completion = ProfileCompletionDto.builder()
                .userId(userId)
                .completionPercentage(completionPercentage)
                .isComplete(completionPercentage >= 100)
                .build();
        return ResponseEntity.ok(completion);
    }

    @PutMapping("/{userId}/privacy")
    public ResponseEntity<PrivacySettingsDto> updatePrivacySettings(
            @PathVariable Long userId,
            @RequestBody PrivacySettingsDto privacySettings) {
        Optional<UserProfile> profile = userProfileService.getUserProfileById(userId);
        if (profile.isPresent()) {
            UserProfile userProfile = profile.get();
            userProfile.setProfilePublic(privacySettings.isProfileVisible());
            userProfile.setContactInfoPublic(privacySettings.isShowEmail() || privacySettings.isShowPhone());
            userProfile.setWorkExperiencePublic(privacySettings.isShowWorkExperience());
            userProfile.setEducationPublic(privacySettings.isShowEducation());
            
            UserProfile updated = userProfileService.updateUserProfile(userId, userProfile);
            return ResponseEntity.ok(mapper.toPrivacySettingsDto(updated));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{userId}/privacy")
    public ResponseEntity<PrivacySettingsDto> getPrivacySettings(@PathVariable Long userId) {
        Optional<UserProfile> profile = userProfileService.getUserProfileById(userId);
        return profile.map(mapper::toPrivacySettingsDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        // TODO: Implement file upload logic
        String imageUrl = "https://example.com/profile-pictures/" + file.getOriginalFilename();
        return ResponseEntity.ok(imageUrl);
    }

    @DeleteMapping("/{userId}/profile-picture")
    public ResponseEntity<Void> deleteProfilePicture(@PathVariable Long userId) {
        // TODO: Implement file deletion logic
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<UserProfileDto>> getAllPublicUsers() {
        List<UserProfile> users = userProfileService.getAllPublicProfiles();
        List<UserProfileDto> dtos = users.stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{userId}/exists")
    public ResponseEntity<Boolean> userProfileExists(@PathVariable Long userId) {
        Optional<UserProfile> profile = userProfileService.getUserProfileById(userId);
        return ResponseEntity.ok(profile.isPresent());
    }
} 