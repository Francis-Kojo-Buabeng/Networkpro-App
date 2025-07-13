import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ThemeProvider } from '../contexts/ThemeContext';
import SplashScreen from './shell/SplashScreen';
import OnboardingScreen from './shell/OnboardingScreen';
import WelcomeScreen from './shell/WelcomeScreen';
import SignUpScreen from './shell/SignUpScreen';
import SignInScreen from './shell/SignInScreen';
import ForgotPasswordScreen from './shell/ForgotPasswordScreen';
import AppNavigator from './shell/AppNavigator';
import ProfileSetupScreen from './microfrontends/profile/ProfileSetupScreen';

export default function Router() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  return (
    <ThemeProvider>
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
      />
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
  router
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
}) {

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Check if user has seen onboarding (in real app, this would be stored in AsyncStorage)
      // For now, we'll simulate that returning users have seen onboarding
      setCurrentScreen(hasSeenOnboarding ? 'welcome' : 'onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasSeenOnboarding]);

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
  const handleSignIn = (profileComplete: boolean = false) => {
    console.log('Handling sign in, profile complete:', profileComplete);
    setIsAuthenticated(true);
    setIsProfileComplete(profileComplete);
    // If profile is complete, go to main app, otherwise go to profile setup
    navigateWithDelay(profileComplete ? 'main' : 'profilesetup');
  };

  // Handle successful sign up
  const handleSignUp = () => {
    console.log('Handling sign up');
    setIsAuthenticated(true);
    setIsProfileComplete(false);
    navigateWithDelay('profilesetup');
  };

  // Handle profile setup completion
  const handleProfileComplete = (avatarUri?: string | null) => {
    console.log('Handling profile complete');
    setIsProfileComplete(true);
    if (avatarUri) {
      setUserAvatar(avatarUri);
    }
    navigateWithDelay('main');
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
      return <AppNavigator userAvatar={userAvatar} />;
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