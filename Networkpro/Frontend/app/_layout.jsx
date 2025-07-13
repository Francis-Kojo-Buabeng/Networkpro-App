import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Router from './router';
import { TabBarVisibilityProvider } from '../contexts/TabBarVisibilityContext';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent />
      <TabBarVisibilityProvider>
        <Router />
      </TabBarVisibilityProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
