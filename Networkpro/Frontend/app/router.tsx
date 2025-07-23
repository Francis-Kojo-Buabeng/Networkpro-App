import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StoriesProvider } from '../contexts/StoriesContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ProfileNavigationProvider, useProfileNavigation } from '../contexts/ProfileNavigationContext';
import ProfileSetupScreen from './microfrontends/profile/ProfileSetupScreen';
import ProfileScreen from './microfrontends/profile/ProfileScreen';
import AppNavigator from './shell/AppNavigator';
import ForgotPasswordScreen from './shell/ForgotPasswordScreen';
import OnboardingScreen from './shell/OnboardingScreen';
import SignInScreen from './shell/SignInScreen';
import SignUpScreen from './shell/SignUpScreen';
import SplashScreen from './shell/SplashScreen';
import WelcomeScreen from './shell/WelcomeScreen';
import { fetchUserProfile } from '../services/userAPI';
import UserProfileScreen from './microfrontends/profile/UserProfileScreen';
import MyProfileScreen from './microfrontends/profile/MyProfileScreen';
import { PostsProvider } from './contexts/PostsContext';

export default function Router() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<any | null>(null);
  const router = useRouter();

  return (
    <ThemeProvider>
      <StoriesProvider>
        <ProfileNavigationProvider>
          <PostsProvider>
            <RouterContent 
              currentScreen={currentScreen}
              setCurrentScreen={setCurrentScreen}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              hasSeenOnboarding={hasSeenOnboarding}
              setHasSeenOnboarding={setHasSeenOnboarding}
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              isProfileComplete={isProfileComplete}
              setIsProfileComplete={setIsProfileComplete}
              userAvatar={userAvatar}
              setUserAvatar={setUserAvatar}
              isNavigating={isNavigating}
              setIsNavigating={setIsNavigating}
              router={router}
              createdProfile={createdProfile}
              setCreatedProfile={setCreatedProfile}
            />
          </PostsProvider>
        </ProfileNavigationProvider>
      </StoriesProvider>
    </ThemeProvider>
  );
}

function RouterContent({
  currentScreen,
  setCurrentScreen,
  isLoading,
  setIsLoading,
  hasSeenOnboarding,
  setHasSeenOnboarding,
  isAuthenticated,
  setIsAuthenticated,
  isProfileComplete,
  setIsProfileComplete,
  userAvatar,
  setUserAvatar,
  isNavigating,
  setIsNavigating,
  router,
  createdProfile,
  setCreatedProfile
}: {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isProfileComplete: boolean;
  setIsProfileComplete: (complete: boolean) => void;
  userAvatar: string | null;
  setUserAvatar: (avatar: string | null) => void;
  isNavigating: boolean;
  setIsNavigating: (navigating: boolean) => void;
  router: any;
  createdProfile: any | null;
  setCreatedProfile: (profile: any | null) => void;
}) {
  const { showProfileScreen, selectedProfile, closeProfile, handleConnect, handleMessage } = useProfileNavigation();
  const [showJustCreatedProfile, setShowJustCreatedProfile] = useState(false);
  // Add a state to track the desired initial tab
  const [initialTab, setInitialTab] = useState<'Home' | 'Network'>('Home');

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Check if user has seen onboarding (in real app, this would be stored in AsyncStorage)
      // For now, we'll simulate that returning users have seen onboarding
      setCurrentScreen(hasSeenOnboarding ? 'welcome' : 'onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  // Navigation functions with proper state management and delays
  const navigateWithDelay = (screen: string) => {
    if (isNavigating) {
      console.log('Navigation already in progress, ignoring');
      return;
    }
    setIsNavigating(true);
    console.log('Navigating to:', screen);
    setCurrentScreen(screen);
    // Reset navigation flag after a short delay
    setTimeout(() => setIsNavigating(false), 100);
  };

  const goToOnboarding = () => navigateWithDelay('onboarding');
  const goToSignUp = () => navigateWithDelay('signup');
  const goToSignIn = () => navigateWithDelay('signin');
  const goToWelcome = () => navigateWithDelay('welcome');
  const goToMainApp = () => navigateWithDelay('main');
  const goToProfileSetup = () => navigateWithDelay('profilesetup');
  const goToForgotPassword = () => navigateWithDelay('forgotpassword');

  // Handle successful sign in
  const handleSignIn = async (profileComplete: boolean = false) => {
    console.log('Handling sign in, profile complete:', profileComplete);
    setIsAuthenticated(true);
    setIsProfileComplete(profileComplete);
    // Fetch real user profile from backend (replace '1' with actual userId)
    try {
      const userProfile = await fetchUserProfile('1');
      setCreatedProfile(userProfile);
    } catch (e) {
      console.error('Failed to fetch user profile:', e);
    }
    // If profile is complete, go to main app, otherwise go to profile setup
    navigateWithDelay(profileComplete ? 'main' : 'profilesetup');
  };

  // Handle successful sign up
  const handleSignUp = async () => {
    console.log('Handling sign up');
    setIsAuthenticated(true);
    setIsProfileComplete(false);
    // Fetch real user profile from backend (replace '1' with actual userId)
    try {
      const userProfile = await fetchUserProfile('1');
      setCreatedProfile(userProfile);
    } catch (e) {
      console.error('Failed to fetch user profile:', e);
    }
    navigateWithDelay('profilesetup');
  };

  // Update handleProfileComplete to accept createdProfile
  const handleProfileComplete = (avatarUri?: string | null, createdProfile?: any) => {
    console.log('Handling profile complete');
    setIsProfileComplete(true);
    if (avatarUri) {
      setUserAvatar(avatarUri);
    }
    if (createdProfile) {
      setCreatedProfile({ ...createdProfile, avatarUri });
      setShowJustCreatedProfile(true);
      setCurrentScreen('profileview');
    } else {
      navigateWithDelay('main');
    }
  };

  // Mock functions for password reset (replace with real implementation)
  const handleResetPassword = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    // In real app, this would call your backend API
  };

  if (isLoading || currentScreen === 'splash') {
    return <SplashScreen />;
  }

  // Handle profile screen display
  if (showProfileScreen && selectedProfile) {
    return (
      <UserProfileScreen
        profile={selectedProfile}
        onBack={() => {
          setInitialTab('Network');
          closeProfile();
        }}
        onConnect={() => handleConnect(selectedProfile.id)}
        onMessage={() => handleMessage(selectedProfile)}
      />
    );
  }

  if (showJustCreatedProfile && createdProfile && currentScreen === 'profileview') {
    // Map backend profile to ProfileScreen props
    const firstName = createdProfile.firstName || '';
    const lastName = createdProfile.lastName || '';
    const name = lastName ? `${firstName} ${lastName}` : firstName;
    const profile = {
      id: createdProfile.id?.toString() || '',
      name,
      title: createdProfile.headline || '',
      company: createdProfile.currentCompany || '',
      location: createdProfile.location || '',
      avatar: createdProfile.avatarUri ? { uri: createdProfile.avatarUri } : require('@/assets/images/Avator-Image.jpg'),
      headerImage: createdProfile.headerImage, // use headerImage from createdProfile
      about: createdProfile.summary || '',
      experience: createdProfile.workExperience || [],
      education: createdProfile.education || [],
      skills: createdProfile.skills || [],
      mutualConnections: 0,
      isConnected: false,
      profileViews: createdProfile.profileViews || 0,
      followers: createdProfile.followers || 0,
    };
    return (
      <MyProfileScreen
        profile={profile}
        onBack={() => {
          setShowJustCreatedProfile(false);
          setCurrentScreen('main');
        }}
        onProfileChange={updated => {
          setCreatedProfile((prev: any) => ({ ...prev, ...updated, headerImage: updated.headerImage }));
        }}
      />
    );
  }

  console.log('Current screen:', currentScreen);

  switch (currentScreen) {
    case 'onboarding':
      return (
        <OnboardingScreen
          onComplete={() => {
            console.log('Onboarding completed');
            setHasSeenOnboarding(true);
            navigateWithDelay('welcome');
          }}
          onSkip={() => {
            console.log('Onboarding skipped');
            setHasSeenOnboarding(true);
            navigateWithDelay('welcome');
          }}
        />
      );
    case 'welcome':
      return (
        <WelcomeScreen 
          onSignUp={goToSignUp} 
          onSignIn={goToSignIn} 
        />
      );
    case 'signup':
      return (
        <SignUpScreen 
          onContinue={handleSignUp} 
          onBack={goToWelcome} 
          onSignIn={goToSignIn} 
        />
      );
    case 'profilesetup':
      return (
        <ProfileSetupScreen 
          onContinue={handleProfileComplete} 
        />
      );
    case 'signin':
      return (
        <SignInScreen
          onSignIn={handleSignIn}
          onJoin={goToSignUp}
          onForgotPassword={goToForgotPassword}
          onBack={goToWelcome}
        />
      );
    case 'forgotpassword':
      return (
        <ForgotPasswordScreen
          onBack={goToSignIn}
          onResetPassword={handleResetPassword}
        />
      );
    case 'main':
      return <AppNavigator userAvatar={userAvatar} createdProfile={createdProfile} initialRouteName={initialTab} />;
    default:
      console.log('Default case, going to welcome');
      return <WelcomeScreen onSignUp={goToSignUp} onSignIn={goToSignIn} />;
  }
}

// Export navigation functions for use in components
export const useAppNavigation = () => {
  return {
    navigateToSignUp: () => {},
    navigateToMainApp: () => {},
    navigateToWelcome: () => {},
  };
}; 