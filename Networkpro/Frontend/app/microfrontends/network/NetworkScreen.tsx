import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import ProfileModal from '../../../components/ProfileModal';

const { width } = Dimensions.get('window');

interface Connection {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: any;
  mutualConnections: number;
  isOnline: boolean;
  isPending: boolean;
  isSuggested: boolean;
  isConnected: boolean;
  location: string;
  about: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

interface NetworkStats {
  totalConnections: number;
  pendingRequests: number;
  newSuggestions: number;
  profileViews: number;
}

interface NetworkScreenProps {
  userAvatar?: string | null;
}

export default function NetworkScreen({ userAvatar }: NetworkScreenProps) {
  const theme = useCurrentTheme();
  const [activeTab, setActiveTab] = useState<'connections' | 'pending' | 'suggestions'>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Connection | null>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const networkStats: NetworkStats = {
    totalConnections: 847,
    pendingRequests: 12,
    newSuggestions: 23,
    profileViews: 45,
  };

  const connections: Connection[] = [
    {
      id: '1',
      name: 'John Doe',
      title: 'Software Engineer',
      company: 'Tech Solutions Inc.',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      mutualConnections: 15,
      isOnline: true,
      isPending: false,
      isSuggested: false,
      isConnected: true,
      location: 'San Francisco, CA',
      about: 'Passionate software engineer with 5+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies. Always eager to learn new technologies and contribute to innovative projects.',
      experience: [
        {
          id: 'exp1',
          title: 'Senior Software Engineer',
          company: 'Tech Solutions Inc.',
          duration: '2021 - Present',
          description: 'Leading development of scalable web applications using React and Node.js. Mentoring junior developers and implementing best practices.',
        },
        {
          id: 'exp2',
          title: 'Software Engineer',
          company: 'StartupXYZ',
          duration: '2019 - 2021',
          description: 'Developed and maintained multiple web applications. Collaborated with cross-functional teams to deliver high-quality products.',
        }
      ],
      education: [
        {
          id: 'edu1',
          degree: 'Bachelor of Science in Computer Science',
          school: 'Stanford University',
          year: '2019',
        }
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'Docker'],
    },
    {
      id: '2',
      name: 'Jane Smith',
      title: 'Product Manager',
      company: 'Digital Marketing Pro',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      mutualConnections: 8,
      isOnline: false,
      isPending: false,
      isSuggested: false,
      isConnected: true,
      location: 'New York, NY',
      about: 'Experienced product manager with a track record of launching successful digital products. Focused on user-centered design and data-driven decision making.',
      experience: [
        {
          id: 'exp3',
          title: 'Senior Product Manager',
          company: 'Digital Marketing Pro',
          duration: '2020 - Present',
          description: 'Leading product strategy and roadmap for digital marketing platform serving 10M+ users.',
        }
      ],
      education: [
        {
          id: 'edu2',
          degree: 'MBA in Business Administration',
          school: 'Harvard Business School',
          year: '2020',
        }
      ],
      skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'A/B Testing'],
    },
    {
      id: '3',
      name: 'Mike Johnson',
      title: 'UX Designer',
      company: 'Creative Studio',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      mutualConnections: 12,
      isOnline: true,
      isPending: false,
      isSuggested: false,
      isConnected: true,
      location: 'Austin, TX',
      about: 'Creative UX designer passionate about creating intuitive and beautiful user experiences. Specialized in mobile app design and user research.',
      experience: [
        {
          id: 'exp4',
          title: 'Senior UX Designer',
          company: 'Creative Studio',
          duration: '2019 - Present',
          description: 'Designing user experiences for mobile and web applications. Leading design sprints and user research initiatives.',
        }
      ],
      education: [
        {
          id: 'edu3',
          degree: 'Bachelor of Design',
          school: 'Parsons School of Design',
          year: '2018',
        }
      ],
      skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping', 'Design Systems'],
    },
  ];

  const pendingRequests: Connection[] = [
    {
      id: '4',
      name: 'Sarah Wilson',
      title: 'Marketing Director',
      company: 'Global Marketing',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      mutualConnections: 6,
      isOnline: false,
      isPending: true,
      isSuggested: false,
      isConnected: false,
      location: 'Chicago, IL',
      about: 'Strategic marketing leader with expertise in digital marketing, brand development, and customer acquisition. Proven track record of driving growth through innovative marketing campaigns.',
      experience: [
        {
          id: 'exp5',
          title: 'Marketing Director',
          company: 'Global Marketing',
          duration: '2021 - Present',
          description: 'Leading marketing strategy for global brands. Managing team of 15 marketing professionals.',
        }
      ],
      education: [
        {
          id: 'edu4',
          degree: 'Master of Business Administration',
          school: 'Northwestern University',
          year: '2020',
        }
      ],
      skills: ['Digital Marketing', 'Brand Strategy', 'Customer Acquisition', 'Team Leadership', 'Analytics'],
    },
    {
      id: '5',
      name: 'Alex Brown',
      title: 'Data Scientist',
      company: 'Analytics Corp',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      mutualConnections: 9,
      isOnline: true,
      isPending: true,
      isSuggested: false,
      isConnected: false,
      location: 'Seattle, WA',
      about: 'Data scientist passionate about turning complex data into actionable insights. Specialized in machine learning, predictive analytics, and business intelligence.',
      experience: [
        {
          id: 'exp6',
          title: 'Senior Data Scientist',
          company: 'Analytics Corp',
          duration: '2020 - Present',
          description: 'Developing machine learning models for predictive analytics. Leading data science initiatives.',
        }
      ],
      education: [
        {
          id: 'edu5',
          degree: 'PhD in Statistics',
          school: 'University of Washington',
          year: '2019',
        }
      ],
      skills: ['Machine Learning', 'Python', 'R', 'SQL', 'Deep Learning', 'Statistics'],
    },
  ];

  const suggestions: Connection[] = [
    {
      id: '6',
      name: 'Emma Davis',
      title: 'Business Analyst',
      company: 'Strategy Partners',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      mutualConnections: 7,
      isOnline: false,
      isPending: false,
      isSuggested: true,
      isConnected: false,
      location: 'Boston, MA',
      about: 'Business analyst with strong analytical skills and experience in process improvement. Focused on data-driven decision making and strategic planning.',
      experience: [
        {
          id: 'exp7',
          title: 'Senior Business Analyst',
          company: 'Strategy Partners',
          duration: '2019 - Present',
          description: 'Analyzing business processes and recommending improvements. Working with stakeholders to implement solutions.',
        }
      ],
      education: [
        {
          id: 'edu6',
          degree: 'Bachelor of Science in Business Administration',
          school: 'Boston University',
          year: '2018',
        }
      ],
      skills: ['Business Analysis', 'Process Improvement', 'Data Analysis', 'Requirements Gathering', 'Stakeholder Management'],
    },
    {
      id: '7',
      name: 'Tom Wilson',
      title: 'Sales Manager',
      company: 'Revenue Solutions',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      mutualConnections: 11,
      isOnline: true,
      isPending: false,
      isSuggested: true,
      isConnected: false,
      location: 'Denver, CO',
      about: 'Experienced sales leader with a proven track record of exceeding targets and building high-performing sales teams. Specialized in B2B sales and account management.',
      experience: [
        {
          id: 'exp8',
          title: 'Sales Manager',
          company: 'Revenue Solutions',
          duration: '2020 - Present',
          description: 'Leading sales team of 12 representatives. Exceeding quarterly targets by 25%.',
        }
      ],
      education: [
        {
          id: 'edu7',
          degree: 'Bachelor of Science in Marketing',
          school: 'University of Colorado',
          year: '2017',
        }
      ],
      skills: ['B2B Sales', 'Account Management', 'Team Leadership', 'CRM', 'Negotiation'],
    },
    {
      id: '8',
      name: 'Lisa Chen',
      title: 'Operations Director',
      company: 'Efficiency Corp',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      mutualConnections: 4,
      isOnline: false,
      isPending: false,
      isSuggested: true,
      isConnected: false,
      location: 'Los Angeles, CA',
      about: 'Operations leader with expertise in process optimization and team management. Focused on improving efficiency and driving organizational success.',
      experience: [
        {
          id: 'exp9',
          title: 'Operations Director',
          company: 'Efficiency Corp',
          duration: '2018 - Present',
          description: 'Overseeing operations for 500+ employees. Implementing process improvements and cost reduction initiatives.',
        }
      ],
      education: [
        {
          id: 'edu8',
          degree: 'Master of Science in Operations Management',
          school: 'UCLA',
          year: '2017',
        }
      ],
      skills: ['Operations Management', 'Process Optimization', 'Team Leadership', 'Project Management', 'Lean Six Sigma'],
    },
  ];

  const getCurrentData = () => {
    const allData = [...connections, ...pendingRequests, ...suggestions];
    const filteredData = allData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'connections') {
        return matchesSearch && !item.isPending && !item.isSuggested;
      } else if (activeTab === 'pending') {
        return matchesSearch && item.isPending;
      } else if (activeTab === 'suggestions') {
        return matchesSearch && item.isSuggested;
      }
      return matchesSearch;
    });
    
    return filteredData;
  };

  const renderConnection = ({ item }: { item: Connection }) => (
    <TouchableOpacity
      style={[styles.connectionCard, { backgroundColor: theme.cardColor }]}
      onPress={() => {
        setSelectedProfile(item);
        setProfileModalVisible(true);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.connectionHeader}>
        <View style={styles.avatarContainer}>
          <Image source={item.avatar} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.connectionInfo}>
          <Text style={[styles.connectionName, { color: theme.textColor }]}>
            {item.name}
          </Text>
          <Text style={[styles.connectionTitle, { color: theme.textSecondaryColor }]}>
            {item.title} at {item.company}
          </Text>
          <Text style={[styles.mutualConnections, { color: theme.textTertiaryColor }]}>
            {item.mutualConnections} mutual connections
          </Text>
        </View>
        
        <View style={styles.connectionActions}>
          {item.isPending ? (
            <View style={styles.pendingActions}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.primaryColor }]}
                onPress={(e) => {
                  e.stopPropagation();
                  // Handle accept
                }}
              >
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
                onPress={(e) => {
                  e.stopPropagation();
                  // Handle ignore
                }}
              >
                <Text style={[styles.actionButtonText, { color: theme.textColor }]}>Ignore</Text>
              </TouchableOpacity>
            </View>
          ) : item.isSuggested ? (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.primaryColor }]}
              onPress={(e) => {
                e.stopPropagation();
                // Handle connect
              }}
            >
              <Text style={[styles.actionButtonText, { color: '#fff' }]}>Connect</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.messageButton}
              onPress={(e) => {
                e.stopPropagation();
                // Handle message
              }}
            >
              <MaterialCommunityIcons name="message-text-outline" size={20} color={theme.primaryColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStatsCard = (title: string, value: number, icon: string, color: string) => (
    <View style={[styles.statsCard, { backgroundColor: theme.cardColor }]}>
      <View style={[styles.statsIcon, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon as any} size={20} color="#fff" />
      </View>
      <View style={styles.statsContent}>
        <Text style={[styles.statsValue, { color: theme.textColor }]}>{value}</Text>
        <Text style={[styles.statsTitle, { color: theme.textSecondaryColor }]}>{title}</Text>
      </View>
    </View>
  );

  const renderTabButton = (tab: 'connections' | 'pending' | 'suggestions', label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { 
          backgroundColor: activeTab === tab ? theme.primaryColor : theme.surfaceColor,
          borderColor: theme.borderColor
        }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        { color: activeTab === tab ? '#fff' : theme.textColor }
      ]}>
        {label}
      </Text>
      {count > 0 && (
        <View style={[styles.tabBadge, { backgroundColor: activeTab === tab ? '#fff' : theme.primaryColor }]}>
          <Text style={[styles.tabBadgeText, { color: activeTab === tab ? theme.primaryColor : '#fff' }]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surfaceColor }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Image 
              source={userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg')} 
              style={[styles.profilePicture, { borderColor: theme.primaryColor }]} 
            />
            <Text style={[styles.headerTitle, { color: theme.textColor }]}>My Network</Text>
          </View>
          
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="magnify" size={24} color={theme.textColor} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: theme.inputBackgroundColor }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondaryColor} />
          <TextInput
            style={[styles.searchInput, { color: theme.textColor }]}
            placeholder="Search your network..."
            placeholderTextColor={theme.placeholderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Network Stats */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Network Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatsCard('Connections', networkStats.totalConnections, 'account-group', '#0077B5')}
            {renderStatsCard('Pending', networkStats.pendingRequests, 'clock-outline', '#FF6B35')}
            {renderStatsCard('Suggestions', networkStats.newSuggestions, 'account-plus', '#4CAF50')}
            {renderStatsCard('Profile Views', networkStats.profileViews, 'eye-outline', '#9C27B0')}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {renderTabButton('connections', 'Connections', connections.length)}
          {renderTabButton('pending', 'Pending', pendingRequests.length)}
          {renderTabButton('suggestions', 'Suggestions', suggestions.length)}
        </View>

        {/* Connections List */}
        <View style={styles.listSection}>
          <FlatList
            data={getCurrentData()}
            renderItem={renderConnection}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons 
                  name="account-group-outline" 
                  size={48} 
                  color={theme.textSecondaryColor} 
                />
                <Text style={[styles.emptyStateText, { color: theme.textSecondaryColor }]}>
                  {searchQuery ? 'No results found' : `No ${activeTab} yet`}
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => {
            setProfileModalVisible(false);
            setSelectedProfile(null);
          }}
          profile={selectedProfile}
        />
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
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statsCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabBadge: {
    marginLeft: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  listSection: {
    paddingHorizontal: 20,
  },
  connectionCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  connectionInfo: {
    flex: 1,
  },
  connectionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  connectionTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  mutualConnections: {
    fontSize: 12,
  },
  connectionActions: {
    marginLeft: 12,
  },
  pendingActions: {
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
}); 