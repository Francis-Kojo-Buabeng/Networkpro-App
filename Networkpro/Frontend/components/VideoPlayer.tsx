import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { useCurrentTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface VideoPlayerProps {
  visible: boolean;
  onClose: () => void;
  videoUri: string;
  thumbnail: any;
  title?: string;
}

export default function VideoPlayer({
  visible,
  onClose,
  videoUri,
  thumbnail,
  title,
}: VideoPlayerProps) {
  const theme = useCurrentTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<Video>(null);
  const playButtonOpacity = useRef(new Animated.Value(1)).current;

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        // Fade in play button
        Animated.timing(playButtonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        await videoRef.current.playAsync();
        // Fade out play button
        Animated.timing(playButtonOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleForward = async () => {
    if (videoRef.current && duration > 0) {
      const newPosition = Math.min(currentPosition + 10, duration);
      await videoRef.current.setPositionAsync(newPosition);
      setCurrentPosition(newPosition);
    }
  };

  const handleBackward = async () => {
    if (videoRef.current && currentPosition > 0) {
      const newPosition = Math.max(currentPosition - 10, 0);
      await videoRef.current.setPositionAsync(newPosition);
      setCurrentPosition(newPosition);
    }
  };

  const handleVideoLoad = (data: any) => {
    setIsLoading(false);
    setError(null);
    setDuration(data.duration || 0);
  };

  const handleVideoError = (error: string) => {
    setIsLoading(false);
    setError(error);
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.stopAsync();
    }
    setIsPlaying(false);
    setIsLoading(true);
    setError(null);
    setCurrentPosition(0);
    setDuration(0);
    // Reset play button opacity
    playButtonOpacity.setValue(1);
    onClose();
  };

  // Reset play button when modal opens
  React.useEffect(() => {
    if (visible) {
      playButtonOpacity.setValue(1);
      setCurrentPosition(0);
      setDuration(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
    >
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          {title && (
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          )}
          <View style={{ width: 24 }} />
        </View>

        {/* Video Container */}
        <View style={styles.videoContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="video-off" size={48} color="#666" />
              <Text style={styles.errorText}>
                Unable to load video
              </Text>
              <Text style={styles.errorSubtext}>
                {error}
              </Text>
            </View>
          ) : (
            <>
              {/* Video Player */}
              <Video
                ref={videoRef}
                source={{ uri: videoUri }}
                style={styles.video}
                useNativeControls={false}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                shouldPlay={false}
                onLoad={handleVideoLoad}
                onError={(error) => {
                  console.log('Video error:', error);
                  handleVideoError('Video failed to load');
                }}
                onPlaybackStatusUpdate={(status) => {
                  if (status.isLoaded) {
                    setIsLoading(false);
                  }
                }}
              />

              {/* Loading Overlay */}
              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <MaterialCommunityIcons name="loading" size={32} color="#fff" />
                  <Text style={styles.loadingText}>Loading video...</Text>
                </View>
              )}

              {/* Play/Pause Button with Fade Animation */}
              {!isLoading && !error && (
                <Animated.View 
                  style={[
                    styles.playPauseButton,
                    { opacity: playButtonOpacity }
                  ]}
                >
                  <TouchableOpacity onPress={handlePlayPause}>
                    <MaterialCommunityIcons 
                      name={isPlaying ? "pause" : "play"} 
                      size={32} 
                      color="#fff" 
                    />
                  </TouchableOpacity>
                </Animated.View>
              )}

              {/* Forward/Backward Controls */}
              {!isLoading && !error && (
                <View style={styles.videoControls}>
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={handleBackward}
                  >
                    <MaterialCommunityIcons 
                      name="rewind-10" 
                      size={24} 
                      color="#fff" 
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.controlButton}
                    onPress={handleForward}
                  >
                    <MaterialCommunityIcons 
                      name="fast-forward-10" 
                      size={24} 
                      color="#fff" 
                    />
                  </TouchableOpacity>
                </View>
              )}

              {/* Fallback Thumbnail View */}
              {error && (
                <View style={styles.fallbackContainer}>
                  <Image source={thumbnail} style={styles.fallbackThumbnail} resizeMode="cover" />
                  <View style={styles.fallbackOverlay}>
                    <MaterialCommunityIcons name="play-circle" size={64} color="#fff" />
                    <Text style={styles.fallbackText}>Video Preview</Text>
                  </View>
                </View>
              )}

              {/* Video Info Overlay */}
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>
                  {title === "NetworkPro Advertisement" 
                    ? "NetworkPro - Your Professional Network, Amplified"
                    : "React Native State Management Tutorial"
                  }
                </Text>
                <Text style={styles.videoDescription}>
                  {title === "NetworkPro Advertisement"
                    ? "Smart profiles, intelligent connections, job opportunities, and real-time messaging"
                    : "Comprehensive guide on handling state with hooks and context"
                  }
                </Text>
                <View style={styles.videoStats}>
                  <Text style={styles.videoStatsText}>
                    {title === "NetworkPro Advertisement" ? "2:45 • NetworkPro Team" : "4:12 • Lisa Rodriguez"}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton}>
            <MaterialCommunityIcons name="thumb-up-outline" size={24} color="#fff" />
            <Text style={styles.controlText}>Like</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <MaterialCommunityIcons name="comment-outline" size={24} color="#fff" />
            <Text style={styles.controlText}>Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <MaterialCommunityIcons name="share-variant-outline" size={24} color="#fff" />
            <Text style={styles.controlText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <MaterialCommunityIcons name="send-outline" size={24} color="#fff" />
            <Text style={styles.controlText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  video: {
    width: width,
    height: height * 0.6,
  },
  thumbnail: {
    width: width,
    height: height * 0.6,
    position: 'absolute',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -32,
    marginTop: -32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorSubtext: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  controlText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  videoStats: {
    marginTop: 8,
  },
  videoStatsText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
  fallbackContainer: {
    width: width,
    height: height * 0.6,
    position: 'relative',
  },
  fallbackThumbnail: {
    width: '100%',
    height: '100%',
  },
  fallbackOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fallbackText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  videoControls: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
}); 