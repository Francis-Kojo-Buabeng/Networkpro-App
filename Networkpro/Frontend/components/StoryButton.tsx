import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';
import StoryCreationScreen from '../app/microfrontends/story/StoryCreationScreen';
import UserProfileModal from './UserProfileModal';

interface StoryButtonProps {
  story: {
    id: number;
    name: string;
    avatar: any;
    hasStory: boolean;
  };
  onPress?: () => void;
  isUserStory?: boolean;
}

export default function StoryButton({ story, onPress, isUserStory = false }: StoryButtonProps) {
  const theme = useCurrentTheme();
  const [showStoryCreation, setShowStoryCreation] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Mock user data for profile modal
  const getUserProfileData = () => ({
    name: story.name,
    avatar: story.avatar,
    title: 'Software Engineer',
    company: 'Tech Company',
    location: 'San Francisco, CA',
    bio: 'Passionate software engineer with experience in React Native, JavaScript, and mobile development. Always eager to learn new technologies and solve complex problems.',
    connections: 150,
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Company',
        duration: '2021 - Present',
      },
      {
        title: 'Software Engineer',
        company: 'Startup Inc',
        duration: '2019 - 2021',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        year: '2019',
      },
    ],
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Git'],
  });

  const handleStoryPress = () => {
    if (isUserStory) {
      // Open story creation screen
      setShowStoryCreation(true);
    } else if (story.hasStory) {
      // Handle viewing other user's story
      Alert.alert('View Story', `Viewing ${story.name}'s story...`);
    } else {
      // Show user profile when there's no story
      setShowProfileModal(true);
    }
    
    // Call custom onPress if provided
    if (onPress) {
      onPress();
    }
  };

  const handleStoryCreated = () => {
    setShowStoryCreation(false);
    // You can add logic here to refresh stories or update UI
  };

  return (
    <>
      <TouchableOpacity style={styles.storyItem} onPress={handleStoryPress}>
        <View style={[
          styles.storyAvatar, 
          { borderColor: story.hasStory ? '#1877F2' : theme.borderColor }
        ]}>
          <Image source={story.avatar} style={styles.avatar} />
          
          {/* Story indicator for active stories */}
          {story.hasStory && !isUserStory && (
            <View style={styles.storyIndicator} />
          )}
          
          {/* Add button for user's story */}
          {isUserStory && (
            <View style={styles.addStoryButton}>
              <MaterialCommunityIcons name="plus" size={16} color="#fff" />
            </View>
          )}
        </View>
        
        <Text style={[styles.storyName, { color: theme.textColor }]} numberOfLines={1}>
          {story.name}
        </Text>
      </TouchableOpacity>
      
      {/* Story Creation Screen */}
      <StoryCreationScreen
        visible={showStoryCreation}
        onClose={() => setShowStoryCreation(false)}
        onStoryCreated={handleStoryCreated}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={getUserProfileData()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  storyItem: {
    alignItems: 'center',
    marginRight: 5,
    width: 80,
  },
  storyAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  storyName: {
    fontSize: 12,
    textAlign: 'center',
  },
  storyIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1877F2',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
}); 