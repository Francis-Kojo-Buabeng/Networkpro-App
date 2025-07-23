import React, { useState } from 'react';
import ProfileScreen, { ProfileLayout, ProfileScreenProps } from './ProfileScreen';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';

interface MyProfileScreenProps extends ProfileScreenProps {
  onProfileChange?: (profile: any) => void;
}

export default function MyProfileScreen(props: MyProfileScreenProps) {
  const theme = useCurrentTheme();
  const [bannerImage, setBannerImage] = useState<string | null>(props.profile.headerImage || null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [profile, setProfile] = useState(props.profile); // Local profile state for edits
  // In editProfile state, use firstName and lastName instead of name
  const [editProfile, setEditProfile] = useState({
    firstName: props.profile.firstName || '',
    lastName: props.profile.lastName || '',
    title: props.profile.title,
    company: props.profile.company,
    location: props.profile.location,
    about: props.profile.about,
  });

  // Handler for editing avatar
  const handleEditAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarImage(result.assets[0].uri);
    }
  };

  // Handler for saving profile edits
  const handleSaveEdit = async () => {
    const updatedProfile = {
      ...profile,
      firstName: editProfile.firstName,
      lastName: editProfile.lastName,
      name: editProfile.lastName ? `${editProfile.firstName} ${editProfile.lastName}` : editProfile.firstName,
      title: editProfile.title,
      company: editProfile.company,
      location: editProfile.location,
      about: editProfile.about,
      avatar: avatarImage ? { uri: avatarImage } : profile.avatar,
      headerImage: bannerImage || profile.headerImage,
    };
    setProfile(updatedProfile);
    if (props.onProfileChange) props.onProfileChange(updatedProfile);
    setEditModalVisible(false);
  };

  const handleBannerChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [3, 1], // Banner aspect ratio
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newBanner = result.assets[0].uri + '?' + Date.now();
      setBannerImage(newBanner);
      const updatedProfile = { ...profile, headerImage: newBanner };
      setProfile(updatedProfile);
      if (props.onProfileChange) props.onProfileChange(updatedProfile);
    }
  };

  return (
    <>
      <ProfileLayout
        key={bannerImage || profile.headerImage || 'default-banner'}
        {...props}
        profile={profile}
        theme={theme}
        bannerImage={profile.headerImage || bannerImage}
        onBannerChange={handleBannerChange}
        avatarImage={avatarImage}
        onAvatarChange={handleEditAvatar}
      >
        {/* Owner-specific Edit button */}
        <TouchableOpacity
          style={{ alignSelf: 'flex-end', marginBottom: 12, marginRight: 12, backgroundColor: theme.primaryColor, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 18 }}
          onPress={() => setEditModalVisible(true)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit Profile</Text>
        </TouchableOpacity>
      </ProfileLayout>
      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <View style={[styles.editModalContainer, { backgroundColor: theme.backgroundColor }]}> 
          <Text style={[styles.editTitle, { color: theme.textColor }]}>Edit Profile</Text>
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={editProfile.firstName}
            onChangeText={firstName => setEditProfile({ ...editProfile, firstName })}
            placeholder="First Name"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={editProfile.lastName}
            onChangeText={lastName => setEditProfile({ ...editProfile, lastName })}
            placeholder="Last Name (optional)"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={editProfile.title}
            onChangeText={title => setEditProfile({ ...editProfile, title })}
            placeholder="Headline/Title"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={editProfile.company}
            onChangeText={company => setEditProfile({ ...editProfile, company })}
            placeholder="Company"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={editProfile.location}
            onChangeText={location => setEditProfile({ ...editProfile, location })}
            placeholder="Location"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor, height: 80 }]} 
            value={editProfile.about}
            onChangeText={about => setEditProfile({ ...editProfile, about })}
            placeholder="About"
            placeholderTextColor={theme.placeholderColor}
            multiline
          />
          <TouchableOpacity
            style={{ marginTop: 12, alignItems: 'center' }}
            onPress={() => setEditModalVisible(false)}
          >
            <Text style={{ color: theme.textColor }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  editModalContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  editTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
  },
}); 