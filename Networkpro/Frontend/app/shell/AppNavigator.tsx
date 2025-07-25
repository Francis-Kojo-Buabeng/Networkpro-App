import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessagesScreen from '../microfrontends/messages/MessagesScreen';
// import ProfileScreen from '../microfrontends/profile/ProfileScreen'; // Temporarily commented out due to missing module
import NetworkScreen from '../microfrontends/network/NetworkScreen';
import JobsScreen from '../microfrontends/jobs/JobsScreen';
import PostScreen from '../microfrontends/post/PostScreen';
import HomeScreen from '../microfrontends/home/HomeScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../../contexts/ThemeContext';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTabBarVisibility } from '../../contexts/TabBarVisibilityContext';

const Tab = createBottomTabNavigator();

interface AppNavigatorProps {
  userAvatar?: string | null;
}

export default function AppNavigator({ userAvatar, createdProfile, initialRouteName = 'Home' }: { userAvatar?: string | null, createdProfile?: any, initialRouteName?: string }) {
  const theme = useCurrentTheme();
  const { tabBarTranslateY } = useTabBarVisibility();

  // Animated style for the tab bar
  const animatedTabBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarTranslateY.value }],
  }));

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          {
            backgroundColor: theme.surfaceColor,
            borderTopColor: theme.borderColor,
            borderTopWidth: 1,
            elevation: 8,
            shadowColor: theme.shadowColor,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          animatedTabBarStyle,
        ],
        tabBarActiveTintColor: theme.primaryColor,
        tabBarInactiveTintColor: theme.textSecondaryColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" color={color} size={size} />
          ),
        }}
      >
        {({ navigation }) => <HomeScreen userAvatar={userAvatar} createdProfile={createdProfile} navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Messages" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message-text" color={color} size={size} />
          ),
        }}
      >
        {() => <MessagesScreen userAvatar={userAvatar} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Network" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      >
        {() => <NetworkScreen userAvatar={userAvatar} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Post" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus-circle" color={color} size={size} />
          ),
        }}
      >
        {() => <PostScreen userAvatar={userAvatar} userProfile={createdProfile} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Jobs" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="briefcase" color={color} size={size} />
          ),
        }}
      >
        {() => <JobsScreen userAvatar={userAvatar} />}
      </Tab.Screen>
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
} 