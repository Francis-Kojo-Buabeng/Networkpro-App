import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ThemedLogo from '../../components/ThemedLogo';
import { useCurrentTheme, useTheme } from '../../contexts/ThemeContext';

interface SignUpScreenProps {
  onContinue: () => void;
  onBack: () => void;
  onSignIn: () => void;
}

export default function SignUpScreen({ onContinue, onBack, onSignIn }: SignUpScreenProps) {
  const theme = useCurrentTheme();
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const getBackendUrl = () => {
    // For all devices (Expo Go, emulator, web), use your PC's IP address
    return 'http://10.132.189.248:8090/api/v1/authentication/register';
  };

  const handleSignUp = async () => {
    console.log('handleSignUp called');
    setError(null);
    const url = getBackendUrl();
    console.log('Sign up URL:', url);
    if (!agreed) {
      setError('You must agree to the terms and privacy policy.');

      return;
    }
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {

      const response = await fetch(url, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Sign up failed.');
      }
      setLoading(false);
      onContinue();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Network request failed');
      console.log('Sign up error:', err);

    }
  };

  const handleBack = () => {
    console.log('SignUpScreen: handleBack called');
    onBack();
  };

  const handleSignIn = () => {
    console.log('SignUpScreen: handleSignIn called');
    onSignIn();
  };

  return (
    <View style={[styles.background, { backgroundColor: theme.backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.flexGrow}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <ScrollView
          contentContainerStyle={styles.centeredContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          >
        {/* App Icon */}
        <ThemedLogo style={styles.logo} resizeMode="contain" />
        {/* Title */}
        <Text style={[styles.title, { color: theme.textColor }]}>Sign up to{`\n`}NetworkPro</Text>
        {/* Email Input */}
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
          placeholder="Email address"
          placeholderTextColor={theme.placeholderColor}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {/* Password Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
            placeholder="Password"
            placeholderTextColor={theme.placeholderColor}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {/* Confirm Password Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
            placeholder="Confirm password"
            placeholderTextColor={theme.placeholderColor}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
            <Ionicons
              name={showConfirmPassword ? 'eye' : 'eye-off'}
              size={24}
              color="gray"
            />


          </TouchableOpacity>
        </View>
        {/* Terms and Privacy Policy */}
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setAgreed(!agreed)} style={[styles.checkbox, { borderColor: theme.textColor }]}>
            {agreed && <View style={[styles.checkboxChecked, { backgroundColor: theme.primaryColor }]} />}
          </TouchableOpacity>
          <Text style={[styles.checkboxText, { color: theme.textColor }]}>
            I agree to the{' '}
            <Text style={[styles.linkText, { color: theme.primaryColor }]}>Terms</Text> and{' '}
            <Text style={[styles.linkText, { color: theme.primaryColor }]}>Privacy Policy</Text>
          </Text>
        </View>
        {error && (
          <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
        )}
        {loading && (
          <Text style={{ color: theme.textColor, marginBottom: 12 }}>Signing up...</Text>
        )}
        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.signUpButton, { backgroundColor: theme.primaryColor }, !agreed && { opacity: 0.5 }]}
          onPress={handleSignUp}
          disabled={!agreed}
        >
          <Text style={[styles.signUpButtonText, { color: theme.textColor }]}>Sign up</Text>
        </TouchableOpacity>
        {/* Sign In Link */}
        <View style={styles.signInRow}>
          <Text style={[styles.signInText, { color: theme.textColor }]}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={[styles.signInLink, { color: theme.primaryColor }]}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </View>
);
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  flexGrow: {
    flex: 1,
  },
  centeredContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 60,
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 38,
  },
  input: {
    width: 320,
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 18,
    fontSize: 18,
    marginBottom: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 320,
    marginBottom: 18,
  },
  eyeButton: {
    padding: 8,
    marginLeft: -40,
    zIndex: 2,
  },
  eyeText: {
    fontSize: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'flex-start',
    marginLeft: 24,
    width: 320,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
  checkboxText: {
    fontSize: 14,
    flex: 1,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  signUpButton: {
    width: 320,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  signUpButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 16,
  },
  signInLink: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
}); 