import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import SignUpScreen from './SignUpScreen';
import AppNavigator from './AppNavigator';

export default function Router() {
  const [screen, setScreen] = useState<'welcome' | 'signup' | 'main'>('welcome');

  // Navigation handlers
  const goToSignUp = () => setScreen('signup');
  const goToMain = () => setScreen('main');
  const goToWelcome = () => setScreen('welcome');

  if (screen === 'welcome') {
    return <WelcomeScreen onSignUp={goToSignUp} />;
  }
  if (screen === 'signup') {
    return <SignUpScreen onContinue={goToMain} onBack={goToWelcome} />;
  }
  return <AppNavigator />;
} 