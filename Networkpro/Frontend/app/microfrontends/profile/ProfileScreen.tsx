import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export interface ProfileScreenProps {
  profile: any;
  onBack: () => void;
  onConnect?: () => void;
  onMessage?: () => void;
  children?: ReactNode;
  bannerImage?: string | null;
  onBannerChange?: (uri: string) => void;
  avatarImage?: string | null;
  onAvatarChange?: (uri: string) => void;
}

// Extract ProfileLayout
export function ProfileLayout({ profile, children, onBack, theme, bannerImage, onBannerChange, avatarImage, onAvatarChange }: { profile: any; children?: ReactNode; onBack: () => void; theme: any; bannerImage?: string | null; onBannerChange?: (uri: string) => void; avatarImage?: string | null; onAvatarChange?: (uri: string) => void; }) {
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'education' | 'skills'>('about');
  const [searchQuery, setSearchQuery] = useState('');

  // Search functionality
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Filter content based on search query
  const filterContent = (content: any[], searchText: string) => {
    if (!searchText.trim()) return content;
    return content.filter(item => 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  const renderTabButton = (tab: 'about' | 'experience' | 'education' | 'skills', label: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && { borderBottomColor: theme.primaryColor, borderBottomWidth: 2 }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        { color: activeTab === tab ? theme.primaryColor : theme.textSecondaryColor }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderMetrics = () => (
    <View style={styles.metricsContainer}>
      <View style={styles.metricItem}>
        <MaterialCommunityIcons name="account-multiple" size={20} color={theme.primaryColor} />
        <Text style={[styles.metricValue, { color: theme.textColor }]}>{profile.mutualConnections}</Text>
        <Text style={[styles.metricLabel, { color: theme.textSecondaryColor }]}>connections</Text>
      </View>
      <View style={styles.metricDivider} />
      <View style={styles.metricItem}>
        <MaterialCommunityIcons name="eye" size={20} color={theme.primaryColor} />
        <Text style={[styles.metricValue, { color: theme.textColor }]}>{profile.profileViews || 0}</Text>
        <Text style={[styles.metricLabel, { color: theme.textSecondaryColor }]}>profile views</Text>
      </View>
      <View style={styles.metricDivider} />
      <View style={styles.metricItem}>
        <MaterialCommunityIcons name="account-group" size={20} color={theme.primaryColor} />
        <Text style={[styles.metricValue, { color: theme.textColor }]}>{profile.followers || 0}</Text>
        <Text style={[styles.metricLabel, { color: theme.textSecondaryColor }]}>followers</Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>About</Text>
            <Text style={[styles.aboutText, { color: theme.textColor }]}>{profile.about}</Text>
          </View>
        );
      case 'experience':
        const filteredExperience = filterContent(profile.experience || [], searchQuery);
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Experience</Text>
            {filteredExperience.length > 0 ? (
              filteredExperience.map((exp: any, index: number) => (
                <View key={exp.id || index} style={[styles.experienceItem, { borderBottomColor: theme.borderColor }]}>
                  <View style={styles.experienceHeader}>
                    <View style={[styles.companyLogo, { backgroundColor: theme.surfaceColor }]}>
                      <MaterialCommunityIcons name="domain" size={24} color={theme.primaryColor} />
                    </View>
                    <View style={styles.experienceInfo}>
                      <Text style={[styles.experienceTitle, { color: theme.textColor }]}>{exp.title}</Text>
                      <Text style={[styles.experienceCompany, { color: theme.primaryColor }]}>{exp.company}</Text>
                      <Text style={[styles.experienceDuration, { color: theme.textSecondaryColor }]}>{exp.duration}</Text>
                    </View>
                  </View>
                  <Text style={[styles.experienceDescription, { color: theme.textColor }]}>{exp.description}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.noResultsText, { color: theme.textSecondaryColor }]}>
                {searchQuery ? 'No experience found matching your search.' : 'No experience added yet.'}
              </Text>
            )}
          </View>
        );
      case 'education':
        const filteredEducation = filterContent(profile.education || [], searchQuery);
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Education</Text>
            {filteredEducation.length > 0 ? (
              filteredEducation.map((edu: any, index: number) => (
                <View key={edu.id || index} style={[styles.educationItem, { borderBottomColor: theme.borderColor }]}>
                  <View style={styles.educationHeader}>
                    <View style={[styles.schoolLogo, { backgroundColor: theme.surfaceColor }]}>
                      <MaterialCommunityIcons name="school" size={24} color={theme.primaryColor} />
                    </View>
                    <View style={styles.educationInfo}>
                      <Text style={[styles.educationDegree, { color: theme.textColor }]}>{edu.degree}</Text>
                      <Text style={[styles.educationSchool, { color: theme.primaryColor }]}>{edu.school}</Text>
                      <Text style={[styles.educationDuration, { color: theme.textSecondaryColor }]}>{edu.duration}</Text>
                    </View>
                  </View>
                  <Text style={[styles.educationDescription, { color: theme.textColor }]}>{edu.description}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.noResultsText, { color: theme.textSecondaryColor }]}>
                {searchQuery ? 'No education found matching your search.' : 'No education added yet.'}
              </Text>
            )}
          </View>
        );
      case 'skills':
        const filteredSkills = profile.skills ? profile.skills.filter((skill: string) => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ) : [];
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Skills</Text>
            {filteredSkills.length > 0 ? (
              <View style={styles.skillsContainer}>
                {filteredSkills.map((skill: string, index: number) => (
                  <View key={index} style={[styles.skillChip, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}>
                    <Text style={[styles.skillText, { color: theme.textColor }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.noResultsText, { color: theme.textSecondaryColor }]}>
                {searchQuery ? 'No skills found matching your search.' : 'No skills added yet.'}
              </Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  // Banner image logic
  const handleBannerPress = async () => {
    if (!onBannerChange) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onBannerChange(result.assets[0].uri);
    }
  };

  // Avatar edit logic
  const handleEditAvatar = async () => {
    if (!onAvatarChange) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onAvatarChange(result.assets[0].uri);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.cardColor }]} onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        {/* Search Field between icons */}
        <View style={[styles.searchContainer, {
          backgroundColor: theme.inputBackgroundColor,
          borderColor: theme.borderColor,
        }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondaryColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.headerSearchInput, {
              color: theme.textColor,
            }]}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder={profile.name || "Search profile..."}
            placeholderTextColor={theme.placeholderColor}
            editable={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <MaterialCommunityIcons name="close-circle" size={20} color={theme.textSecondaryColor} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={[styles.moreButton, { backgroundColor: theme.cardColor }]}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <TouchableOpacity disabled={!onBannerChange} onPress={handleBannerPress} activeOpacity={onBannerChange ? 0.7 : 1}>
          <View style={styles.headerImageContainer}>
            {bannerImage || profile.headerImage ? (
              <Image
                source={bannerImage ? { uri: bannerImage } : { uri: profile.headerImage }}
                style={styles.headerImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.headerImage, { backgroundColor: theme.surfaceColor }]}>
                <MaterialCommunityIcons name="image" size={48} color={theme.textTertiaryColor} style={styles.headerPlaceholder} />
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={avatarImage ? { uri: avatarImage } : (profile.avatar ? profile.avatar : require('@/assets/images/Avator-Image.jpg'))}
              style={[styles.avatar, { borderColor: theme.cardColor, shadowColor: theme.shadowColor }]}
            />
            {onAvatarChange && (
              <TouchableOpacity onPress={handleEditAvatar} style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: theme.cardColor, borderRadius: 16, padding: 6, borderWidth: 1, borderColor: theme.primaryColor, zIndex: 10 }}>
                <MaterialCommunityIcons name="pencil" size={18} color={theme.primaryColor} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.profileDetails}>
            <Text style={[styles.profileName, { color: theme.textColor }]}>{profile.name}</Text>
            <Text style={[styles.profileTitle, { color: theme.textColor }]}>{profile.title}</Text>
            <Text style={[styles.profileCompany, { color: theme.primaryColor }]}>{profile.company}</Text>
            <Text style={[styles.profileLocation, { color: theme.textSecondaryColor }]}>{profile.location}</Text>
          </View>

          {/* Action Buttons before tabs */}
          {children}
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}>
          {renderTabButton('about', 'About')}
          {renderTabButton('experience', 'Experience')}
          {renderTabButton('education', 'Education')}
          {renderTabButton('skills', 'Skills')}
        </View>

        {/* Content */}
        {renderContent()}

        {/* Restore Action Buttons, but only render if !isOwnProfile */}
        {/* This block is now redundant as buttons are moved */}
      </ScrollView>
    </View>
  );
}

// ProfileScreen is now just a shell
export default function ProfileScreen(props: ProfileScreenProps) {
  const theme = useCurrentTheme();
  return (
    <ProfileLayout profile={props.profile} onBack={props.onBack} theme={theme} bannerImage={props.bannerImage} onBannerChange={props.onBannerChange} avatarImage={props.avatarImage} onAvatarChange={props.onAvatarChange}>
      {props.children}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  moreButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
  },
  headerImageContainer: {
    height: 130, // Reduced from 200
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPlaceholder: {
    opacity: 0.5,
  },
  profileInfo: {
    paddingHorizontal: 20,
    marginTop: -60,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  profileDetails: {
    marginBottom: 20,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileCompany: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileLocation: {
    fontSize: 16,
    marginBottom: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    height: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  connectButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
  },
  experienceItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  experienceHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  experienceInfo: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  experienceDuration: {
    fontSize: 14,
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  educationItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  educationHeader: {
    flexDirection: 'row',
  },
  schoolLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  educationInfo: {
    flex: 1,
  },
  educationDegree: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  educationSchool: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  educationDuration: {
    fontSize: 14,
  },
  educationDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 180,
    maxWidth: 250,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearButton: {
    padding: 4,
  },
}); 