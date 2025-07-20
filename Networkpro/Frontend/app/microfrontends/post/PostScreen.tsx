import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import ProfileModal from '../../../components/ProfileModal';
import { useNavigation } from '@react-navigation/native';

interface PostScreenProps {
  userAvatar?: string | null;
}

export default function PostScreen({ userAvatar }: PostScreenProps) {
  const navigation = useNavigation();
  const [postText, setPostText] = useState('');
  const [selectedPrivacy, setSelectedPrivacy] = useState('Anyone');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const theme = useCurrentTheme();

  const handleClose = () => {
    navigation.navigate('Network' as never);
  };

  const handlePost = () => {
    if (postText.trim()) {
      Alert.alert('Success', 'Your post has been shared!');
      setPostText('');
      setSelectedMedia([]);
    } else {
      Alert.alert('Error', 'Please write something to post');
    }
  };

  const addMedia = (type: 'photo' | 'video' | 'document') => {
    Alert.alert('Media', `${type.charAt(0).toUpperCase() + type.slice(1)} attachment feature coming soon!`);
  };

  const renderPrivacyOption = (option: string) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.privacyOption,
        selectedPrivacy === option && { backgroundColor: theme.primaryColor }
      ]}
      onPress={() => setSelectedPrivacy(option)}
    >
      <Text style={[
        styles.privacyOptionText,
        { color: selectedPrivacy === option ? '#fff' : theme.textColor }
      ]}>
        {option}
      </Text>
    </TouchableOpacity>
  );

  const renderMediaOption = (icon: string, label: string, type: 'photo' | 'video' | 'document') => (
    <TouchableOpacity
      key={label}
      style={styles.mediaOption}
      onPress={() => addMedia(type)}
    >
      <MaterialCommunityIcons name={icon as any} size={20} color={theme.textSecondaryColor} />
      <Text style={[styles.mediaOptionText, { color: theme.textColor }]}>{label}</Text>
    </TouchableOpacity>
  );

  // Helper to build a mock profile object from user data
  const buildProfile = (user: any) => ({
    id: user.id?.toString() || '',
    name: user.name || 'John Doe',
    title: user.title || 'Professional',
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

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Create a post</Text>
          <TouchableOpacity 
            style={[
              styles.postButton,
              { backgroundColor: postText.trim() ? theme.primaryColor : '#ccc' }
            ]}
            onPress={handlePost}
            disabled={!postText.trim()}
          >
            <Text style={[styles.postButtonText, { color: postText.trim() ? '#fff' : theme.textSecondaryColor }]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.userSection}>
          <TouchableOpacity onPress={() => handleProfilePress({ name: 'John Doe', avatar: userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg') })}>
            <Image
              source={userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg')}
              style={styles.userAvatar}
            />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.textColor }]}>John Doe</Text>
            <TouchableOpacity style={styles.privacySelector}>
              <MaterialCommunityIcons name="earth" size={16} color={theme.textSecondaryColor} />
              <Text style={[styles.privacyText, { color: theme.textColor }]}>{selectedPrivacy}</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color={theme.textSecondaryColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Input */}
        <View style={styles.postInputContainer}>
          <TextInput
            style={[styles.postInput, { color: theme.textColor }]}
            placeholder="What do you want to talk about?"
            placeholderTextColor={theme.placeholderColor}
            value={postText}
            onChangeText={setPostText}
            multiline
            textAlignVertical="top"
            autoFocus
          />
        </View>

        {/* Privacy Options */}
        <View style={styles.privacySection}>
          <Text style={[styles.privacyTitle, { color: theme.textColor }]}>Who can see your post?</Text>
          <View style={styles.privacyOptions}>
            {renderPrivacyOption('Anyone')}
            {renderPrivacyOption('Connections')}
            {renderPrivacyOption('Connections only')}
          </View>
        </View>

        {/* Media Options */}
        <View style={[styles.mediaSection, { borderTopColor: theme.borderColor }]}>
          <Text style={[styles.mediaTitle, { color: theme.textColor }]}>Add to your post</Text>
          <View style={styles.mediaOptions}>
            {renderMediaOption('image', 'Photo', 'photo')}
            {renderMediaOption('video', 'Video', 'video')}
            {renderMediaOption('file-document', 'Document', 'document')}
            {renderMediaOption('calendar', 'Event', 'document')}
            {renderMediaOption('map-marker', 'Location', 'document')}
            {renderMediaOption('emoticon', 'Celebration', 'document')}
          </View>
        </View>

        {/* Recent Posts Preview */}
        <View style={styles.recentPostsSection}>
          <View style={styles.feedHeader}>
            <Text style={[styles.feedTitle, { color: theme.textColor }]}>Recent posts</Text>
            <TouchableOpacity style={[styles.sortButton, { borderColor: theme.borderColor }]}>
              <MaterialCommunityIcons name="sort" size={16} color={theme.textColor} />
              <Text style={[styles.sortText, { color: theme.textColor }]}>Top</Text>
            </TouchableOpacity>
          </View>

          {/* Sample Post */}
          <View style={[styles.postCard, { backgroundColor: theme.cardColor, borderColor: theme.borderColor }]}>
            <View style={styles.postHeader}>
              <TouchableOpacity onPress={() => handleProfilePress({ name: 'Jane Smith', avatar: require('@/assets/images/Avator-Image.jpg') })}>
                <Image
                  source={require('@/assets/images/Avator-Image.jpg')} 
                  style={styles.postAvatar} 
                />
              </TouchableOpacity>
              <View style={styles.postInfo}>
                <Text style={[styles.postName, { color: theme.textColor }]}>Jane Smith</Text>
                <Text style={[styles.postTime, { color: theme.textSecondaryColor }]}>1 day ago • <MaterialCommunityIcons name="earth" size={12} color={theme.textSecondaryColor} /></Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MaterialCommunityIcons name="dots-horizontal" size={20} color={theme.textSecondaryColor} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.postText, { color: theme.textColor }]}>
              Just completed an amazing networking event! The connections I made today will be invaluable for my career growth. Remember, your network is your net worth! 💼✨
            </Text>
            <View style={[styles.postActions, { borderTopColor: theme.borderColor }]}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="thumb-up-outline" size={16} color={theme.textSecondaryColor} />
                <Text style={[styles.actionText, { color: theme.textSecondaryColor }]}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="comment-outline" size={16} color={theme.textSecondaryColor} />
                <Text style={[styles.actionText, { color: theme.textSecondaryColor }]}>Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="share-variant-outline" size={16} color={theme.textSecondaryColor} />
                <Text style={[styles.actionText, { color: theme.textSecondaryColor }]}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="send" size={16} color={theme.textSecondaryColor} />
                <Text style={[styles.actionText, { color: theme.textSecondaryColor }]}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
    </View>
      </ScrollView>

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          profile={selectedProfile}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  privacySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 14,
    marginHorizontal: 4,
  },
  postInputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postInput: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 100,
  },
  privacySection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  privacyOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  privacyOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  privacyOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mediaSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  mediaOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mediaOptionText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  recentPostsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  sortText: {
    fontSize: 14,
    marginLeft: 4,
  },
  postCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  moreButton: {
    padding: 4,
  },
  postName: {
    fontSize: 16,
    fontWeight: '600',
  },
  postTime: {
    fontSize: 14,
    marginTop: 2,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
  },
}); 