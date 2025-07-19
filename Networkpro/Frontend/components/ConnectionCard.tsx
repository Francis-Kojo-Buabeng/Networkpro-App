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
        { backgroundColor: theme.cardColor, borderWidth: 1, borderColor: theme.borderColor, marginBottom: 18, shadowOpacity: 0.12 }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.connectionHeader}>
        <View style={styles.avatarContainer}>
          <Image source={item.avatar} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.connectionInfo}>
          <Text style={[styles.connectionName, { color: theme.textColor }]}> 
            {item.name}
          </Text>
          <Text style={[styles.connectionTitle, { color: theme.textSecondaryColor }]}> 
            {item.title}
          </Text>
          <Text style={[styles.connectionCompany, { color: theme.textTertiaryColor }]}> 
            {item.company}
          </Text>
          <Text style={[styles.mutualConnections, { color: theme.textTertiaryColor }]}> 
            {item.mutualConnections} mutual connections
          </Text>
        </View>
      </View>
      <View style={styles.connectionActionsRow}>
        {item.isPending ? (
          <View style={styles.pendingActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.primaryColor }]}
              onPress={(e) => { e.stopPropagation(); onAccept && onAccept(); }}
            >
              <Text style={[styles.actionButtonText, { color: '#fff' }]}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
              onPress={(e) => { e.stopPropagation(); onIgnore && onIgnore(); }}
            >
              <Text style={[styles.actionButtonText, { color: theme.textColor }]}>Ignore</Text>
            </TouchableOpacity>
          </View>
        ) : item.isSuggested ? (
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.primaryColor, minWidth: 100 }]}
            onPress={(e) => { e.stopPropagation(); onConnect && onConnect(); }}
          >
            <Text style={[styles.actionButtonText, { color: '#fff' }]}>Connect</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.messageButton, { backgroundColor: theme.surfaceColor, borderRadius: 16, borderWidth: 1, borderColor: theme.borderColor, paddingHorizontal: 16 }]}
            onPress={(e) => { e.stopPropagation(); onMessage && onMessage(); }}
          >
            <MaterialCommunityIcons name="message-text-outline" size={20} color={theme.primaryColor} />
            <Text style={[styles.actionButtonText, { color: theme.primaryColor, marginLeft: 6 }]}>Message</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  connectionCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
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
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  connectionInfo: {
    flex: 1,
    minWidth: 0,
  },
  connectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  connectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  connectionCompany: {
    fontSize: 14,
    marginBottom: 2,
  },
  mutualConnections: {
    fontSize: 13,
    marginTop: 2,
  },
  connectionActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
}); 