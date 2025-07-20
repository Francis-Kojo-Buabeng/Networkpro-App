import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ConnectionCardProps {
  item: any;
  theme: any;
  onPress: () => void;
  onAccept?: () => void;
  onIgnore?: () => void;
  onConnect?: () => void;
  onMessage?: () => void;
}

export default function ConnectionCard({ item, theme, onPress, onAccept, onIgnore, onConnect, onMessage }: ConnectionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.connectionCard,
        { backgroundColor: theme.cardColor, borderWidth: 1, borderColor: theme.borderColor, marginBottom: 12, shadowOpacity: 0.12, width: '48%' }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Dismiss X button */}
      <TouchableOpacity style={styles.dismissButton}>
        <MaterialCommunityIcons name="close" size={16} color={theme.textTertiaryColor} />
      </TouchableOpacity>

      {/* Profile Picture at Top Center */}
      <View style={styles.avatarContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
        {/* Open to work badge */}
        {item.isOpenToWork && (
          <View style={styles.openToWorkBadge}>
            <Text style={styles.openToWorkText}>#OPENTOWORK</Text>
          </View>
        )}
      </View>

      {/* Name with checkmark */}
      <View style={styles.nameRow}>
        <Text style={[styles.connectionName, { color: theme.textColor }]} numberOfLines={1}> 
          {item.name}
        </Text>
        <MaterialCommunityIcons name="check-circle" size={14} color={theme.primaryColor} />
      </View>

      {/* Title/Description */}
      <Text style={[styles.connectionTitle, { color: theme.textSecondaryColor }]} numberOfLines={2}> 
        {item.title}
      </Text>

      {/* Mutual Connections with small avatar */}
      <View style={styles.mutualConnectionsRow}>
        <Image source={item.avatar} style={styles.smallAvatar} />
        <Text style={[styles.mutualConnections, { color: theme.textTertiaryColor }]} numberOfLines={1}> 
          {item.mutualConnections} mutual connections
        </Text>
      </View>

      {/* Connect Button at Bottom */}
      <TouchableOpacity 
        style={[styles.connectButton, { borderColor: theme.primaryColor }]}
        onPress={(e) => { e.stopPropagation(); onConnect && onConnect(); }}
      >
        <Text style={[styles.connectButtonText, { color: theme.primaryColor }]}>Connect</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  connectionCard: {
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  openToWorkBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  openToWorkText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  connectionName: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  connectionTitle: {
    fontSize: 11,
    fontWeight: '400',
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: 14,
  },
  mutualConnectionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  smallAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  mutualConnections: {
    fontSize: 10,
  },
  connectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  connectButtonText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 