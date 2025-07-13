import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import ProfileModal from '../../../components/ProfileModal';

const { width } = Dimensions.get('window');

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  postedDate: string;
  logo: any;
  description: string;
  requirements: string[];
  isSaved: boolean;
}

interface CompanyProfile {
  id: string;
  name: string;
  logo: any;
  industry: string;
  size: string;
  location: string;
  founded: string;
  description: string;
  website: string;
  activeJobs: number;
  employeeCount: string;
  revenue: string;
  specialties: string[];
  benefits: string[];
  recentJobs: Job[];
}

// Company logo mapping
const getCompanyLogo = (companyName: string) => {
  const logoMap: { [key: string]: any } = {
    'Google': require('@/assets/images/company-logos/Google-logo.webp'),
    'Apple': require('@/assets/images/company-logos/Apple-logo.png'),
    'Microsoft': require('@/assets/images/company-logos/Microsoft-logo.png'),
    'Amazon': require('@/assets/images/company-logos/amazon-logo.webp'),
    'Netflix': require('@/assets/images/company-logos/Netflix-logo.png'),
    'Meta': require('@/assets/images/company-logos/Meta-logo.png'),
  };
  
  return logoMap[companyName] || require('@/assets/images/default-avator.jpg');
};

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'Google',
    location: 'San Francisco, CA',
    salary: '$150k - $200k',
    type: 'Full-time',
    postedDate: '2 days ago',
    logo: getCompanyLogo('Google'),
    description: 'Join Google\'s mobile team to build innovative apps used by billions of users worldwide...',
    requirements: ['React Native', 'TypeScript', '5+ years experience', 'Mobile development', 'Google Cloud', 'Performance optimization'],
    isSaved: false,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Apple',
    location: 'Cupertino, CA',
    salary: '$140k - $180k',
    type: 'Full-time',
    postedDate: '1 week ago',
    logo: getCompanyLogo('Apple'),
    description: 'Lead product strategy for Apple\'s next-generation mobile applications...',
    requirements: ['Product management', 'iOS development', '5+ years experience', 'User experience', 'Analytics'],
    isSaved: true,
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    salary: '$120k - $160k',
    type: 'Full-time',
    postedDate: '3 days ago',
    logo: getCompanyLogo('Microsoft'),
    description: 'Design beautiful interfaces for Microsoft\'s suite of productivity applications...',
    requirements: ['Figma', 'Adobe Creative Suite', 'Design systems', 'User research', 'Accessibility'],
    isSaved: false,
  },
  {
    id: '4',
    title: 'Backend Developer',
    company: 'Amazon',
    location: 'Seattle, WA',
    salary: '$130k - $170k',
    type: 'Full-time',
    postedDate: '5 days ago',
    logo: getCompanyLogo('Amazon'),
    description: 'Build scalable AWS services that power Amazon\'s global infrastructure...',
    requirements: ['Java', 'Python', 'AWS', 'Microservices', 'Database design', 'Cloud architecture'],
    isSaved: false,
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$140k - $190k',
    type: 'Full-time',
    postedDate: '1 day ago',
    logo: getCompanyLogo('Netflix'),
    description: 'Develop machine learning algorithms to personalize Netflix recommendations...',
    requirements: ['Python', 'Machine Learning', 'TensorFlow', 'Big Data', 'Statistics', 'A/B Testing'],
    isSaved: false,
  },
  {
    id: '6',
    title: 'Frontend Engineer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salary: '$130k - $180k',
    type: 'Full-time',
    postedDate: '4 days ago',
    logo: getCompanyLogo('Meta'),
    description: 'Build the next generation of social media experiences for billions of users...',
    requirements: ['React', 'JavaScript', 'TypeScript', 'Performance optimization', 'Web technologies'],
    isSaved: true,
  },
];

const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const locations = ['All', 'Remote', 'San Francisco', 'New York', 'Austin', 'Los Angeles'];

interface JobsScreenProps {
  userAvatar?: string | null;
}

export default function JobsScreen({ userAvatar }: JobsScreenProps) {
  const theme = useCurrentTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);

  // Company profile data
  const companyProfiles: { [key: string]: CompanyProfile } = {
    'Google': {
      id: '1',
      name: 'Google',
      logo: require('@/assets/images/company-logos/Google-logo.webp'),
      industry: 'Technology',
      size: '100,000+ employees',
      location: 'Mountain View, CA',
      founded: '1998',
      description: 'Google is a multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, search engine, cloud computing, software, and hardware.',
      website: 'google.com',
      activeJobs: 15,
      employeeCount: '156,500+',
      revenue: '$307.4B',
      specialties: ['Search Engine', 'Cloud Computing', 'AI/ML', 'Mobile Technology'],
      benefits: ['Health Insurance', '401k Matching', 'Free Meals', 'Flexible Work'],
      recentJobs: mockJobs.filter(job => job.company === 'Google')
    },
    'Apple': {
      id: '2',
      name: 'Apple',
      logo: require('@/assets/images/company-logos/Apple-logo.png'),
      industry: 'Technology',
      size: '164,000+ employees',
      location: 'Cupertino, CA',
      founded: '1976',
      description: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services.',
      website: 'apple.com',
      activeJobs: 8,
      employeeCount: '164,000+',
      revenue: '$394.3B',
      specialties: ['Consumer Electronics', 'Software Development', 'Design', 'Retail'],
      benefits: ['Health Benefits', 'Stock Options', 'Product Discounts', 'Professional Development'],
      recentJobs: mockJobs.filter(job => job.company === 'Apple')
    },
    'Microsoft': {
      id: '3',
      name: 'Microsoft',
      logo: require('@/assets/images/company-logos/Microsoft-logo.png'),
      industry: 'Technology',
      size: '221,000+ employees',
      location: 'Redmond, WA',
      founded: '1975',
      description: 'Microsoft Corporation is an American multinational technology company which produces computer software, consumer electronics, personal computers, and related services.',
      website: 'microsoft.com',
      activeJobs: 12,
      employeeCount: '221,000+',
      revenue: '$198.3B',
      specialties: ['Software Development', 'Cloud Services', 'Gaming', 'AI'],
      benefits: ['Health Insurance', '401k', 'Remote Work', 'Learning Budget'],
      recentJobs: mockJobs.filter(job => job.company === 'Microsoft')
    },
    'Amazon': {
      id: '4',
      name: 'Amazon',
      logo: require('@/assets/images/company-logos/amazon-logo.webp'),
      industry: 'E-commerce & Technology',
      size: '1,608,000+ employees',
      location: 'Seattle, WA',
      founded: '1994',
      description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
      website: 'amazon.com',
      activeJobs: 20,
      employeeCount: '1.6M+',
      revenue: '$514.0B',
      specialties: ['E-commerce', 'Cloud Computing', 'Logistics', 'AI/ML'],
      benefits: ['Health Benefits', 'Stock Options', 'Career Growth', 'Innovation'],
      recentJobs: mockJobs.filter(job => job.company === 'Amazon')
    },
    'Netflix': {
      id: '5',
      name: 'Netflix',
      logo: require('@/assets/images/company-logos/Netflix-logo.png'),
      industry: 'Entertainment',
      size: '12,000+ employees',
      location: 'Los Gatos, CA',
      founded: '1997',
      description: 'Netflix, Inc. is an American subscription streaming service and production company. It offers a library of films and television series.',
      website: 'netflix.com',
      activeJobs: 6,
      employeeCount: '12,000+',
      revenue: '$31.6B',
      specialties: ['Streaming', 'Content Production', 'Data Science', 'Entertainment'],
      benefits: ['Flexible PTO', 'Health Benefits', 'Stock Options', 'Creative Freedom'],
      recentJobs: mockJobs.filter(job => job.company === 'Netflix')
    },
    'Meta': {
      id: '6',
      name: 'Meta',
      logo: require('@/assets/images/company-logos/Meta-logo.png'),
      industry: 'Technology',
      size: '86,000+ employees',
      location: 'Menlo Park, CA',
      founded: '2004',
      description: 'Meta Platforms, Inc. is an American multinational technology conglomerate. It is the parent organization of Facebook, Instagram, and WhatsApp.',
      website: 'meta.com',
      activeJobs: 10,
      employeeCount: '86,000+',
      revenue: '$116.6B',
      specialties: ['Social Media', 'VR/AR', 'AI/ML', 'Mobile Apps'],
      benefits: ['Health Benefits', 'Stock Options', 'Remote Work', 'Innovation'],
      recentJobs: mockJobs.filter(job => job.company === 'Meta')
    }
  };

  const handleCompanyPress = (companyName: string) => {
    const company = companyProfiles[companyName];
    if (company) {
      setSelectedCompany(company);
      setCompanyModalVisible(true);
    }
  };

  const handleProfilePress = (user: any) => {
    // TODO: Implement buildProfile function or replace with direct user object
    setSelectedProfile(user);
    setProfileModalVisible(true);
  };

  const toggleSaveJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
    ));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedJobType === 'All' || job.type === selectedJobType;
    const matchesLocation = selectedLocation === 'All' || 
                           (selectedLocation === 'Remote' && job.location.includes('Remote')) ||
                           job.location.includes(selectedLocation);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const renderJobCard = ({ item }: { item: Job }) => (
    <TouchableOpacity 
      style={[styles.jobCard, { backgroundColor: theme.cardColor }]}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <TouchableOpacity onPress={() => handleCompanyPress(item.company)}>
          <Image source={item.logo} style={styles.companyLogo} />
        </TouchableOpacity>
        <View style={styles.jobInfo}>
          <Text style={[styles.jobTitle, { color: theme.textColor }]}>{item.title}</Text>
          <Text style={[styles.companyName, { color: theme.textSecondaryColor }]}>{item.company}</Text>
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker" size={14} color={theme.textTertiaryColor} />
              <Text style={[styles.metaText, { color: theme.textTertiaryColor }]}>{item.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="cash" size={14} color={theme.textTertiaryColor} />
              <Text style={[styles.metaText, { color: theme.textTertiaryColor }]}>{item.salary}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => toggleSaveJob(item.id)}
          style={styles.saveButton}
        >
          <MaterialCommunityIcons 
            name={item.isSaved ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={item.isSaved ? theme.primaryColor : theme.textSecondaryColor} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.jobTypeContainer}>
        <View style={[styles.jobTypeBadge, { backgroundColor: theme.primaryColor + '20' }]}>
          <Text style={[styles.jobTypeText, { color: theme.primaryColor }]}>{item.type}</Text>
        </View>
        <Text style={[styles.postedDate, { color: theme.textTertiaryColor }]}>{item.postedDate}</Text>
      </View>
      
      <Text style={[styles.jobDescription, { color: theme.textSecondaryColor }]} numberOfLines={3}>
        {item.description}
      </Text>
      
      <View style={styles.requirementsContainer}>
        {item.requirements.slice(0, 4).map((req, index) => (
          <View key={index} style={[styles.requirementBadge, { backgroundColor: theme.surfaceColor }]}>
            <Text style={[styles.requirementText, { color: theme.textSecondaryColor }]}>{req}</Text>
          </View>
        ))}
        {item.requirements.length > 4 && (
          <Text style={[styles.moreRequirements, { color: theme.primaryColor }]}>
            +{item.requirements.length - 4} more
          </Text>
        )}
      </View>
      
      <View style={styles.applyContainer}>
        <TouchableOpacity 
          style={[styles.applyButton, { backgroundColor: theme.primaryColor }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.applyButtonText, { color: theme.textColor }]}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.saveJobButton, { borderColor: theme.primaryColor }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.saveJobText, { color: theme.primaryColor }]}>Save</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilterChip = ({ item, type }: { item: string; type: 'jobType' | 'location' }) => {
    const isSelected = type === 'jobType' ? selectedJobType === item : selectedLocation === item;
    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          { backgroundColor: isSelected ? theme.primaryColor : theme.surfaceColor }
        ]}
        onPress={() => {
          if (type === 'jobType') {
            setSelectedJobType(item);
          } else {
            setSelectedLocation(item);
          }
        }}
      >
        <Text style={[
          styles.filterChipText,
          { color: isSelected ? theme.textColor : theme.textSecondaryColor }
        ]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surfaceColor }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => handleProfilePress({ name: 'Current User', avatar: userAvatar ? { uri: userAvatar } : require('@/assets/images/default-avator.jpg') })}>
            <Image 
              source={userAvatar ? { uri: userAvatar } : require('@/assets/images/default-avator.jpg')} 
              style={[styles.profilePicture, { borderColor: theme.primaryColor }]} 
            />
          </TouchableOpacity>
          
          <View style={[styles.searchContainer, { backgroundColor: theme.inputBackgroundColor }]}>
            <MaterialCommunityIcons name="briefcase" size={20} color={theme.textSecondaryColor} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.textColor }]}
              placeholder="Search jobs"
              placeholderTextColor={theme.placeholderColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <MaterialCommunityIcons 
              name="tune" 
              size={24} 
              color={theme.textColor} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={[styles.filtersContainer, { backgroundColor: theme.surfaceColor }]}>
          <Text style={[styles.filterSectionTitle, { color: theme.textColor }]}>Job Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {jobTypes.map((type, index) => (
              <View key={index} style={styles.filterChipContainer}>
                {renderFilterChip({ item: type, type: 'jobType' })}
              </View>
            ))}
          </ScrollView>
          
          <Text style={[styles.filterSectionTitle, { color: theme.textColor }]}>Location</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {locations.map((location, index) => (
              <View key={index} style={styles.filterChipContainer}>
                {renderFilterChip({ item: location, type: 'location' })}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Job Listings */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.jobsList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={[styles.resultsCount, { color: theme.textSecondaryColor }]}>
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="briefcase-outline" size={64} color={theme.textTertiaryColor} />
            <Text style={[styles.emptyStateTitle, { color: theme.textColor }]}>No jobs found</Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.textSecondaryColor }]}>
              Try adjusting your search criteria or filters
            </Text>
          </View>
        }
      />

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          profile={selectedProfile}
        />
      )}
      {/* Company Profile Modal */}
      {selectedCompany && (
        <Modal
          visible={companyModalVisible}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
              <TouchableOpacity onPress={() => setCompanyModalVisible(false)} style={styles.headerButton}>
                <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: theme.textColor }]}>
                Company Profile
              </Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Company Header */}
              <View style={[styles.companyHeader, { backgroundColor: theme.cardColor }]}>
                <View style={styles.companyInfo}>
                  <Image source={selectedCompany.logo} style={styles.companyLogoLarge} />
                  
                  <View style={styles.companyDetails}>
                    <Text style={[styles.companyNameLarge, { color: theme.textColor }]}>
                      {selectedCompany.name}
                    </Text>
                    <Text style={[styles.companyIndustry, { color: theme.textSecondaryColor }]}>
                      {selectedCompany.industry}
                    </Text>
                    <Text style={[styles.companyLocation, { color: theme.textTertiaryColor }]}>
                      {selectedCompany.location} • {selectedCompany.size}
                    </Text>
                    <Text style={[styles.companyFounded, { color: theme.textTertiaryColor }]}>
                      Founded {selectedCompany.founded}
                    </Text>
                  </View>
                </View>

                {/* Company Stats */}
                <View style={styles.companyStats}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.textColor }]}>{selectedCompany.activeJobs}</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondaryColor }]}>Active Jobs</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.textColor }]}>{selectedCompany.employeeCount}</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondaryColor }]}>Employees</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.textColor }]}>{selectedCompany.revenue}</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondaryColor }]}>Revenue</Text>
                  </View>
                </View>
              </View>

              {/* Company Description */}
              <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>About {selectedCompany.name}</Text>
                <Text style={[styles.companyDescription, { color: theme.textColor }]}>
                  {selectedCompany.description}
                </Text>
              </View>

              {/* Specialties */}
              <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Specialties</Text>
                <View style={styles.specialtiesContainer}>
                  {selectedCompany.specialties.map((specialty, index) => (
                    <View key={index} style={[styles.specialtyTag, { backgroundColor: theme.primaryColor + '20' }]}>
                      <Text style={[styles.specialtyText, { color: theme.primaryColor }]}>{specialty}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Benefits */}
              <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Benefits</Text>
                <View style={styles.benefitsContainer}>
                  {selectedCompany.benefits.map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <MaterialCommunityIcons name="check-circle" size={16} color={theme.primaryColor} />
                      <Text style={[styles.benefitText, { color: theme.textColor }]}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Recent Jobs */}
              <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Recent Jobs</Text>
                {selectedCompany.recentJobs.map((job, index) => (
                  <View key={index} style={[styles.recentJobItem, { borderBottomColor: theme.borderColor }]}>
                    <Text style={[styles.recentJobTitle, { color: theme.textColor }]}>{job.title}</Text>
                    <Text style={[styles.recentJobLocation, { color: theme.textSecondaryColor }]}>{job.location}</Text>
                    <Text style={[styles.recentJobSalary, { color: theme.textTertiaryColor }]}>{job.salary}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileButton: {
    padding: 4,
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
  },
  filterButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    width: 220,
    height: 40,
    marginHorizontal: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 4,
    fontSize: 14,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChipContainer: {
    marginRight: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  jobsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsCount: {
    fontSize: 14,
    marginBottom: 16,
  },
  jobCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 16,
    marginBottom: 8,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
  },
  saveButton: {
    padding: 4,
  },
  jobTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postedDate: {
    fontSize: 12,
  },
  jobDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  requirementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  requirementBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
  },
  moreRequirements: {
    fontSize: 12,
    fontWeight: '500',
  },
  applyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  applyButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveJobButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    flex: 1,
    marginLeft: 8,
  },
  saveJobText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  companyHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyDetails: {
    marginLeft: 20,
  },
  companyNameLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyIndustry: {
    fontSize: 16,
    marginBottom: 8,
  },
  companyLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  companyFounded: {
    fontSize: 12,
  },
  companyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  companyDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
  },
  benefitsContainer: {
    marginTop: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    marginLeft: 8,
  },
  recentJobItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  recentJobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recentJobLocation: {
    fontSize: 14,
  },
  recentJobSalary: {
    fontSize: 12,
  },
  companyLogoLarge: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
}); 