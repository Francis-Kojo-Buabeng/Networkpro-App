import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
import CommentButton from '../../../components/CommentButton';
import LikeButton from '../../../components/LikeButton';
import NotificationModal from '../../../components/NotificationModal';
import ProfileModal from '../../../components/ProfileModal';
import SendButton from '../../../components/SendButton';
import ShareButton from '../../../components/ShareButton';
import StoryButton from '../../../components/StoryButton';
import StoryViewer from '../../../components/StoryViewer';
import VideoPlayer from '../../../components/VideoPlayer';
import { useStories } from '../../../contexts/StoriesContext';
import { useTabBarVisibility } from '../../../contexts/TabBarVisibilityContext';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import MeScreen from './MeScreen';
import Sidebar from './Sidebar';

const { width } = Dimensions.get('window');

// Type definitions
interface Story {
  id: number;
  name: string;
  avatar: any;
  hasStory: boolean;
}

interface Post {
  id: number;
  author: string;
  avatar: any;
  company: string;
  time: string;
  content: string;
  image?: any;
  video?: {
    uri: string;
    thumbnail: any;
    duration: string;
  };
  likes: number;
  comments: number;
  shares: number;
}

interface SuggestedConnection {
  id: number;
  name: string;
  title: string;
  company: string;
  avatar: any;
}

// Profile picture mapping by name
const getProfilePicture = (name: string) => {
  const profilePictures: { [key: string]: any } = {
    'John Doe': require('@/assets/images/profile-pictures/image-01.jpg'),
    'Jane Smith': require('@/assets/images/profile-pictures/image-02.webp'),
    'Mike Johnson': require('@/assets/images/profile-pictures/image-03.jpg'),
    'Sarah Wilson': require('@/assets/images/profile-pictures/image-04.jpeg'),
    'Alex Brown': require('@/assets/images/profile-pictures/image-05.avif'),
    'Emma Davis': require('@/assets/images/profile-pictures/image-06.webp'),
    'Tom Wilson': require('@/assets/images/profile-pictures/image-07.jpg'),
    'David Chen': require('@/assets/images/profile-pictures/image-01.jpg'),
    'Lisa Rodriguez': require('@/assets/images/profile-pictures/image-02.webp'),
  };
  
  return profilePictures[name] || require('@/assets/images/default-avator.jpg');
};

// Mock data
const posts: Post[] = [
  {
    id: 1,
    author: 'John Doe',
    avatar: getProfilePicture('John Doe'),
    company: 'Tech Solutions Inc.',
    time: '2h ago',
    content: 'Excited to share that I\'ve just completed a major project! The team worked incredibly hard and the results are amazing. #TechInnovation #TeamWork',
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    author: 'Jane Smith',
    avatar: getProfilePicture('Jane Smith'),
    company: 'Digital Marketing Pro',
    time: '4h ago',
    content: 'Just published a new article about the future of digital marketing. Check it out and let me know your thoughts!',
    likes: 15,
    comments: 12,
    shares: 5,
  },
  {
    id: 3,
    author: 'David Chen',
    avatar: getProfilePicture('David Chen'),
    company: 'CyberSec Solutions',
    time: '1h ago',
    content: 'Just finished implementing advanced threat detection systems for our clients. Cybersecurity is more critical than ever in today\'s digital landscape. Here\'s a glimpse of our latest security architecture. #Cybersecurity #ThreatDetection #DigitalSecurity',
    image: require('@/assets/images/post-pictures/cyber-security-image.jpg'),
    likes: 42,
    comments: 18,
    shares: 12,
  },
  {
    id: 4,
    author: 'Lisa Rodriguez',
    avatar: getProfilePicture('Lisa Rodriguez'),
    company: 'Creative Studios',
    time: '15m ago',
    content: '🎬 New tutorial alert! Just created this comprehensive guide on React Native state management. Learn how to properly handle state with hooks and context. Perfect for beginners and intermediate developers! #ReactNative #StateManagement #MobileDevelopment #CodingTutorial',
    video: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: require('@/assets/images/profile-pictures/image-03.jpg'),
      duration: '4:12',
    },
    likes: 35,
    comments: 22,
    shares: 14,
  },
  {
    id: 5,
    author: 'NetworkPro Team',
    avatar: require('@/assets/images/networkpro-logo.png'),
    company: 'NetworkPro App',
    time: '2h ago',
    content: '🎬 Discover the power of professional networking with NetworkPro! Watch how our app helps you build meaningful connections, discover job opportunities, and grow your career. From smart profile matching to real-time messaging, see how NetworkPro is revolutionizing professional networking. Experience the features that make networking effortless and effective. #NetworkPro #ProfessionalNetworking #CareerGrowth #SmartConnections',
    video: {
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: require('@/assets/images/networkpro-logo.png'),
      duration: '2:45',
    },
    likes: 89,
    comments: 45,
    shares: 67,
  },
];

const initialSuggestedConnections: SuggestedConnection[] = [
  { id: 1, name: 'Alex Brown', title: 'Software Engineer', company: 'Google', avatar: getProfilePicture('Alex Brown') },
  { id: 2, name: 'Emma Davis', title: 'Product Manager', company: 'Microsoft', avatar: getProfilePicture('Emma Davis') },
  { id: 3, name: 'Tom Wilson', title: 'UX Designer', company: 'Apple', avatar: getProfilePicture('Tom Wilson') },
  { id: 4, name: 'David Chen', title: 'Cybersecurity Specialist', company: 'CyberSec Solutions', avatar: getProfilePicture('David Chen') },
  { id: 5, name: 'Lisa Rodriguez', title: 'Content Creator', company: 'Creative Studios', avatar: getProfilePicture('Lisa Rodriguez') },
];

interface HomeScreenProps {
  userAvatar?: string | null;
}

export default function HomeScreen({ userAvatar }: HomeScreenProps) {
  const theme = useCurrentTheme();
  const { tabBarTranslateY } = useTabBarVisibility();
  const { stories } = useStories();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);
  const [suggestedConnections, setSuggestedConnections] = useState<SuggestedConnection[]>(initialSuggestedConnections);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [videoPlayerVisible, setVideoPlayerVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [meModalVisible, setMeModalVisible] = useState(false);

  // Helper to build a mock profile object from user data
  const buildProfile = (user: any) => ({
    id: user.id?.toString() || '',
    name: user.name || user.author || '',
    title: user.title || user.company || 'Professional',
    company: user.company || '',
    avatar: user.avatar,
    mutualConnections: 12,
    isOnline: true,
    isConnected: false,
    isPending: false,
    location: 'San Francisco, CA',
    about: 'Experienced professional passionate about networking and growth.',
    experience: [
      { id: '1', title: 'Senior Developer', company: user.company || 'Company', duration: '2 yrs', description: 'Worked on various projects.' }
    ],
    education: [
      { id: '1', degree: 'B.Sc. Computer Science', school: 'University', year: '2018' }
    ],
    skills: ['Networking', 'React Native', 'Leadership'],
  });

  const handleProfilePress = (user: any) => {
    setSelectedProfile(buildProfile(user));
    setProfileModalVisible(true);
  };

  const handleConnect = (id: number, name: string) => {
    setSuggestedConnections(prev => prev.filter(conn => conn.id !== id));
    Alert.alert('Connection Request Sent', `You have sent a connection request to ${name}.`);
  };

  const handleVideoPress = (video: any) => {
    setSelectedVideo(video);
    setVideoPlayerVisible(true);
  };

  // Update renderStory to use the expanded story model
  const renderStory = ({ item, index }: { item: any, index: number }) => (
    <StoryButton 
      story={item} 
      isUserStory={item.userName === 'Your Story'}
      onPress={() => {
        if (item.userName === 'Your Story') return;
        setSelectedStoryIndex(index);
        setStoryViewerVisible(true);
      }}
    />
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={[styles.post, { backgroundColor: theme.cardColor }]}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => handleProfilePress(item)}>
          <Image source={item.avatar} style={styles.postAvatar} />
        </TouchableOpacity>
        <View style={styles.postInfo}>
          <Text style={[styles.postAuthor, { color: theme.textColor }]}>{item.author}</Text>
          <Text style={[styles.postCompany, { color: theme.textSecondaryColor }]}>{item.company}</Text>
          <Text style={[styles.postTime, { color: theme.textTertiaryColor }]}>{item.time}</Text>
        </View>
        <TouchableOpacity style={styles.postOptions}>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color={theme.textSecondaryColor} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.postContent, { color: theme.textColor }]}>{item.content}</Text>
      
      {item.image && (
        <View style={styles.postImageContainer}>
          <Image source={item.image} style={styles.postImage} resizeMode="cover" />
        </View>
      )}
      
      {item.video && (
        <View style={styles.postVideoContainer}>
          <TouchableOpacity 
            style={styles.videoThumbnail}
            onPress={() => handleVideoPress(item.video)}
          >
            <Image source={item.video.thumbnail} style={styles.videoThumbnailImage} resizeMode="cover" />
            <View style={styles.videoOverlay}>
              <View style={styles.playButton}>
                <MaterialCommunityIcons name="play" size={24} color="#fff" />
              </View>
              <View style={styles.videoDuration}>
                <Text style={styles.videoDurationText}>{item.video.duration}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={[styles.postActions, { borderTopColor: theme.borderColor }]}>
        <LikeButton 
          initialLiked={false}
          initialLikeCount={item.likes}
          onLikeChange={(liked, count) => {
            console.log(`Post ${item.id}: ${liked ? 'Liked' : 'Unliked'}, Count: ${count}`);
          }}
          size="medium"
          showCount={true}
        />
        <CommentButton 
          postId={item.id}
          postAuthor={item.author}
          commentCount={item.comments}
          onPress={() => {
            console.log(`Opening comments for post ${item.id}`);
          }}
          showText={true}
        />
        <ShareButton 
          postId={item.id}
          postAuthor={item.author}
          postContent={item.content}
          shareCount={item.shares}
          onPress={() => {
            console.log(`Opening share options for post ${item.id}`);
          }}
          showText={true}
        />
        <SendButton 
          postId={item.id}
          postAuthor={item.author}
          postContent={item.content}
          sendCount={0}
          onPress={() => {
            console.log(`Opening send options for post ${item.id}`);
          }}
          showText={true}
        />
      </View>
    </View>
  );

  const renderSuggestedConnection = ({ item }: { item: SuggestedConnection }) => (
    <View style={[styles.suggestedConnection, { backgroundColor: theme.cardColor }]}>
      <TouchableOpacity onPress={() => handleProfilePress(item)}>
        <Image source={item.avatar} style={styles.suggestedAvatar} />
      </TouchableOpacity>
      <View style={styles.suggestedInfo}>
        <Text style={[styles.suggestedName, { color: theme.textColor }]}>{item.name}</Text>
        <Text style={[styles.suggestedTitle, { color: theme.textSecondaryColor }]}>{item.title}</Text>
        <Text style={[styles.suggestedCompany, { color: theme.textTertiaryColor }]}>{item.company}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.connectButton, { backgroundColor: theme.primaryColor }]} 
        onPress={() => handleConnect(item.id, item.name)}
      >
        <Text style={[styles.connectButtonText, { color: theme.textColor }]}>Connect</Text>
      </TouchableOpacity>
    </View>
  );

  // Track last scroll offset for direction
  let lastOffsetY = 0;
  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      if (offsetY > lastOffsetY + 10) {
        // Scrolling down, hide tab bar
        tabBarTranslateY.value = 100;
      } else if (offsetY < lastOffsetY - 10) {
        // Scrolling up, show tab bar
        tabBarTranslateY.value = 0;
      }
      lastOffsetY = offsetY;
    },
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}> 
      <Animated.ScrollView
        style={[styles.content, { backgroundColor: theme.backgroundColor }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
      {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surfaceColor }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.profileButton} onPress={() => setShowDashboard(true)}>
            <Image 
              source={userAvatar ? { uri: userAvatar } : require('@/assets/images/default-avator.jpg')} 
                style={[styles.profilePicture, { borderColor: theme.primaryColor }]} 
            />
            </TouchableOpacity>
            
                      <View style={[styles.searchContainer, { backgroundColor: theme.inputBackgroundColor }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondaryColor} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.textColor }]}
              placeholder="Search jobs, people..."
              placeholderTextColor={theme.placeholderColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setNotificationModalVisible(true)}
            >
              <MaterialCommunityIcons name="bell-outline" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Stories Section */}
        <View style={[styles.section, { marginTop: -8 }]}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Stories</Text>
          <FlatList
            data={stories}
            renderItem={({ item, index }) => renderStory({ item, index })}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContainer}
          />
        </View>



        {/* Feed Posts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Recent Posts</Text>
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Suggested Connections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>People you may know</Text>
          <FlatList
            data={suggestedConnections}
            renderItem={renderSuggestedConnection}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </Animated.ScrollView>
      
      {/* Sidebar Overlay */}
      {showDashboard && (
        <Sidebar
          userAvatar={userAvatar}
          onClose={() => setShowDashboard(false)}
          onMePress={() => setMeModalVisible(true)}
        />
      )}
      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          profile={selectedProfile}
        />
      )}
      {/* Notification Modal */}
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
      />
      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          visible={videoPlayerVisible}
          onClose={() => {
            setVideoPlayerVisible(false);
            setSelectedVideo(null);
          }}
          videoUri={selectedVideo.uri}
          thumbnail={selectedVideo.thumbnail}
          title={selectedVideo.uri.includes('ElephantsDream') ? "NetworkPro Advertisement" : "React Native Tutorial"}
        />
      )}
      {/* Story Viewer Modal */}
      <StoryViewer
        visible={storyViewerVisible}
        initialIndex={selectedStoryIndex}
        onClose={() => setStoryViewerVisible(false)}
      />
      {/* MeScreen Modal */}
      <Modal visible={meModalVisible} animationType="slide" onRequestClose={() => setMeModalVisible(false)}>
        <MeScreen userAvatar={userAvatar} userName="Your Name" />
        <TouchableOpacity style={{ position: 'absolute', top: 40, right: 24, zIndex: 100 }} onPress={() => setMeModalVisible(false)}>
          <MaterialCommunityIcons name="close" size={32} color="#222" />
        </TouchableOpacity>
      </Modal>
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
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    flex: 1,
    height: 40,
    marginHorizontal: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 17,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  storiesContainer: {
    paddingHorizontal: 16,
  },

  post: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5e5e5',
  },
  postCompany: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  postTime: {
    fontSize: 12,
    color: '#888',
  },
  postOptions: {
    padding: 4,
  },
  postContent: {
    fontSize: 16,
    color: '#e5e5e5',
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 5,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  postActionText: {
    marginLeft: 6,
    fontSize: 14,
  },
  suggestedConnection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestedAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  suggestedInfo: {
    flex: 1,
  },
  suggestedName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e5e5e5',
  },
  suggestedTitle: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  suggestedCompany: {
    fontSize: 12,
    color: '#888',
  },
  connectButton: {
    backgroundColor: '#1877F2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  postImageContainer: {
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  postVideoContainer: {
    marginBottom: 16,
  },
  videoThumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  videoThumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 4,
    borderRadius: 4,
  },
  videoDurationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 