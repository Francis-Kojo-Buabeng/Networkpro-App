import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ConnectionCard from '../../../components/ConnectionCard';
import MessageModal from '../../../components/MessageModal';
import NetworkTabButton from '../../../components/NetworkTabButton';
import ProfileModal from '../../../components/ProfileModal';
import NotificationModal from '../../../components/NotificationModal';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import { useProfileNavigation } from '../../../contexts/ProfileNavigationContext';
import {
  NetworkSearchHeader
} from './components';

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
  const { openProfile } = useProfileNavigation();
  const [activeTab, setActiveTab] = useState<'connections' | 'pending' | 'suggestions'>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Connection | null>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);

  const [connections, setConnections] = useState<Connection[]>([
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
  ]);

  const [pendingRequests, setPendingRequests] = useState<Connection[]>([
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
  ]);

  const [suggestions, setSuggestions] = useState<Connection[]>([
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
  ]);

  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalConnections: 847,
    pendingRequests: 12,
    newSuggestions: 23,
    profileViews: 45,
  });

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

  const handleMessage = (connection: Connection) => {
    // Create a conversation object from the connection
    const conversation = {
      id: connection.id,
      contactName: connection.name,
      contactAvatar: connection.avatar,
      contactTitle: connection.title,
      contactCompany: connection.company,
      isOnline: connection.isOnline,
      messages: [
        {
          id: '1',
          sender: connection.name,
          senderAvatar: connection.avatar,
          content: `Hi! I'm ${connection.name}, ${connection.title} at ${connection.company}. Nice to connect with you!`,
          timestamp: 'Just now',
          isFromMe: false,
        }
      ]
    };
    
    setSelectedConversation(conversation);
    setMessageModalVisible(true);
  };

  const handleAccept = (connectionId: string) => {
    // Move from pending to connections
    const acceptedConnection = pendingRequests.find(conn => conn.id === connectionId);
    if (acceptedConnection) {
      const updatedConnection = { ...acceptedConnection, isPending: false, isConnected: true };
      
      setPendingRequests(prev => prev.filter(conn => conn.id !== connectionId));
      setConnections(prev => [...prev, updatedConnection]);
      
      // Update network stats
      setNetworkStats(prev => ({
        ...prev,
        totalConnections: prev.totalConnections + 1,
        pendingRequests: prev.pendingRequests - 1,
      }));
    }
  };

  const handleIgnore = (connectionId: string) => {
    // Remove from pending requests
    const ignoredConnection = pendingRequests.find(conn => conn.id === connectionId);
    if (ignoredConnection) {
      setPendingRequests(prev => prev.filter(conn => conn.id !== connectionId));
      
      // Update network stats
      setNetworkStats(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests - 1,
      }));
    }
  };

  const handleConnect = (connectionId: string) => {
    const updatedData = getCurrentData().map(connection =>
      connection.id === connectionId
        ? { ...connection, isConnected: true, isPending: false, isSuggested: false }
        : connection
    );

    if (activeTab === 'connections') {
      setConnections(updatedData);
    } else if (activeTab === 'pending') {
      setPendingRequests(updatedData);
    } else if (activeTab === 'suggestions') {
      setSuggestions(updatedData);
    }
  };

  const handleProfileCardPress = (connection: Connection) => {
    // Create profile data for the ProfileScreen
    const profileData = {
      id: connection.id,
      name: connection.name,
      title: connection.title,
      company: connection.company,
      location: connection.location || 'Location not specified',
      avatar: connection.avatar,
      about: connection.about || 'No about information available.',
      experience: connection.experience || [],
      education: connection.education || [],
      skills: connection.skills || [],
      mutualConnections: connection.mutualConnections,
      isConnected: connection.isConnected || false,
      isOnline: connection.isOnline,
      isPending: connection.isPending,
      isSuggested: connection.isSuggested,
    };
    
    openProfile(profileData);
  };

  const renderConnection = ({ item }: { item: Connection }) => (
    <ConnectionCard
      item={item}
      theme={theme}
      onPress={() => handleProfileCardPress(item)}
      onAccept={() => handleAccept(item.id)}
      onIgnore={() => handleIgnore(item.id)}
      onConnect={() => handleConnect(item.id)}
      onMessage={() => handleMessage(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <NetworkSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProfilePress={() => setProfileModalVisible(true)}
        onNotificationPress={() => setNotificationModalVisible(true)}
        userAvatar={userAvatar}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <NetworkTabButton label="Connections" count={connections.length} active={activeTab === 'connections'} onPress={() => setActiveTab('connections')} theme={theme} />
          <NetworkTabButton label="Pending" count={pendingRequests.length} active={activeTab === 'pending'} onPress={() => setActiveTab('pending')} theme={theme} />
          <NetworkTabButton label="Suggestions" count={suggestions.length} active={activeTab === 'suggestions'} onPress={() => setActiveTab('suggestions')} theme={theme} />
        </View>

        {/* Connections List */}
        <View style={styles.listSection}>
          <FlatList
            data={getCurrentData()}
            renderItem={renderConnection}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
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

      {/* Message Modal */}
      {selectedConversation && (
        <MessageModal
          visible={messageModalVisible}
          onClose={() => {
            setMessageModalVisible(false);
            setSelectedConversation(null);
          }}
          conversation={selectedConversation}
        />
      )}

      {/* Notification Modal */}
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
      />
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 12,
    marginLeft: 0,
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
    marginBottom: 0,
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
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
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
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
    fontSize: 13,
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
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
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
    minWidth: 0,
  },
  connectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  connectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  connectionCompany: {
    fontSize: 14,
    marginBottom: 2,
  },
  mutualConnections: {
    fontSize: 13,
    marginTop: 2,
  },
  connectionActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
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
  revealOverviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  revealOverviewText: {
    fontSize: 16,
    fontWeight: '600',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    gap: 4,
  },
}); 