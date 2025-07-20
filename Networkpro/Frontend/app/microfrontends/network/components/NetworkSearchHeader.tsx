import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useCurrentTheme } from '../../../../contexts/ThemeContext';

interface NetworkSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onProfilePress: () => void;
  onNotificationPress: () => void;
  userAvatar?: string | null;
}

export default function NetworkSearchHeader({
  searchQuery,
  onSearchChange,
  onProfilePress,
  onNotificationPress,
  userAvatar,
}: NetworkSearchHeaderProps) {
  const theme = useCurrentTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.surfaceColor }]}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Image 
            source={userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg')} 
            style={[styles.profilePicture, { borderColor: theme.primaryColor }]} 
          />
          <View style={[styles.searchContainer, { backgroundColor: theme.inputBackgroundColor, width: 300, marginRight: 0 }]}> 
            <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondaryColor} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: theme.textColor, fontSize: 15 }]}
              placeholder="Search your network..."
              placeholderTextColor={theme.placeholderColor}
              value={searchQuery}
              onChangeText={onSearchChange}
            />
          </View>
          <TouchableOpacity style={{ marginLeft: 8 }} onPress={onNotificationPress}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={theme.textColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 