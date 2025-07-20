import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface ProfileScreenProps {
  profile: {
    id: string;
    name: string;
    title: string;
    company: string;
    location: string;
    avatar: any;
    headerImage?: any;
    about: string;
    experience: Array<{
      id: string;
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      id: string;
      degree: string;
      school: string;
      year: string;
    }>;
    skills: string[];
    mutualConnections: number;
    isConnected: boolean;
    profileViews?: number;
    followers?: number;
  };
  onBack: () => void;
  onConnect: () => void;
  onMessage: () => void;
}

export default function ProfileScreen({ profile, onBack, onConnect, onMessage }: ProfileScreenProps) {
  const theme = useCurrentTheme();
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'education' | 'skills'>('about');

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
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Experience</Text>
            {profile.experience.map((exp, index) => (
              <View key={exp.id} style={[styles.experienceItem, { borderBottomColor: theme.borderColor }]}>
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
            ))}
          </View>
        );
      case 'education':
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Education</Text>
            {profile.education.map((edu, index) => (
              <View key={edu.id} style={[styles.educationItem, { borderBottomColor: theme.borderColor }]}>
                <View style={styles.educationHeader}>
                  <View style={[styles.schoolLogo, { backgroundColor: theme.surfaceColor }]}>
                    <MaterialCommunityIcons name="school" size={24} color={theme.primaryColor} />
                  </View>
                  <View style={styles.educationInfo}>
                    <Text style={[styles.educationDegree, { color: theme.textColor }]}>{edu.degree}</Text>
                    <Text style={[styles.educationSchool, { color: theme.primaryColor }]}>{edu.school}</Text>
                    <Text style={[styles.educationYear, { color: theme.textSecondaryColor }]}>{edu.year}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      case 'skills':
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Skills</Text>
            <View style={styles.skillsContainer}>
              {profile.skills.map((skill, index) => (
                <View key={index} style={[styles.skillChip, { backgroundColor: theme.primaryColor, shadowColor: theme.shadowColor }]}>
                  <Text style={[styles.skillText, { color: theme.textColor }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.cardColor }]} onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.moreButton, { backgroundColor: theme.cardColor }]}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerImageContainer}>
          <View style={[styles.headerImage, { backgroundColor: theme.surfaceColor }]}>
            <MaterialCommunityIcons name="image" size={48} color={theme.textTertiaryColor} style={styles.headerPlaceholder} />
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <Image source={profile.avatar} style={[styles.avatar, { borderColor: theme.cardColor, shadowColor: theme.shadowColor }]} />
          </View>
          
          <View style={styles.profileDetails}>
            <Text style={[styles.profileName, { color: theme.textColor }]}>{profile.name}</Text>
            <Text style={[styles.profileTitle, { color: theme.textColor }]}>{profile.title}</Text>
            <Text style={[styles.profileCompany, { color: theme.primaryColor }]}>{profile.company}</Text>
            <Text style={[styles.profileLocation, { color: theme.textSecondaryColor }]}>{profile.location}</Text>
          </View>
        </View>

        {/* Metrics */}
        <View style={[styles.metricsContainer, { backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}>
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="account-multiple" size={20} color={theme.primaryColor} />
            <Text style={[styles.metricValue, { color: theme.textColor }]}>{profile.mutualConnections}</Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondaryColor }]}>connections</Text>
          </View>
          <View style={[styles.metricDivider, { backgroundColor: theme.borderColor }]} />
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="eye" size={20} color={theme.primaryColor} />
            <Text style={[styles.metricValue, { color: theme.textColor }]}>{profile.profileViews || 0}</Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondaryColor }]}>profile views</Text>
          </View>
          <View style={[styles.metricDivider, { backgroundColor: theme.borderColor }]} />
          <View style={styles.metricItem}>
            <MaterialCommunityIcons name="account-group" size={20} color={theme.primaryColor} />
            <Text style={[styles.metricValue, { color: theme.textColor }]}>{profile.followers || 0}</Text>
            <Text style={[styles.metricLabel, { color: theme.textSecondaryColor }]}>followers</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.connectButton, { backgroundColor: theme.primaryColor, shadowColor: theme.shadowColor }]}
            onPress={onConnect}
          >
            <Text style={[styles.connectButtonText, { color: theme.textColor }]}>
              {profile.isConnected ? 'Message' : 'Connect'}
            </Text>
          </TouchableOpacity>
          
          {!profile.isConnected && (
            <TouchableOpacity 
              style={[styles.messageButton, { borderColor: theme.primaryColor, backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}
              onPress={onMessage}
            >
              <MaterialCommunityIcons name="message-text-outline" size={20} color={theme.primaryColor} />
              <Text style={[styles.messageButtonText, { color: theme.primaryColor }]}>Message</Text>
            </TouchableOpacity>
          )}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    zIndex: 1,
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
  headerImageContainer: {
    height: 200,
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
  educationYear: {
    fontSize: 14,
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
}); 