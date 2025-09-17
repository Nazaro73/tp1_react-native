import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

// Composant ProfileCard
const ProfileCard: React.FC<{
  imageUrl: string;
  name: string;
  position: string;
  followersCount: number;
  isFollowing: boolean;
  onFollowPress: () => void;
}> = ({ imageUrl, name, position, followersCount, isFollowing, onFollowPress }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.profileImage} />
      
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.position}>{position}</Text>
      
      <Text style={styles.followersText}>
        {followersCount.toLocaleString()} followers
      </Text>
      
      <TouchableOpacity
        style={[
          styles.followButton,
          isFollowing ? styles.followingButton : styles.notFollowingButton
        ]}
        onPress={onFollowPress}
      >
        <Text
          style={[
            styles.followButtonText,
            isFollowing ? styles.followingButtonText : styles.notFollowingButtonText
          ]}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Écran principal TP1
export default function TP1ProfileCardScreen() {
  const [followersCount, setFollowersCount] = useState(1234);
  const [isFollowing, setIsFollowing] = useState(false);

  // useEffect pour augmenter automatiquement le nombre de followers
  useEffect(() => {
    const interval = setInterval(() => {
      setFollowersCount(prevCount => prevCount + Math.floor(Math.random() * 3) + 1);
    }, 5000); // Toutes les 5 secondes

    // Nettoyage du timer lors du démontage du composant
    return () => clearInterval(interval);
  }, []);

  const handleFollowPress = () => {
    setIsFollowing(prev => {
      const newFollowingState = !prev;
      // Ajuster le compteur en fonction de l'état
      setFollowersCount(prevCount => 
        newFollowingState ? prevCount + 1 : Math.max(0, prevCount - 1)
      );
      return newFollowingState;
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'TP1 - Profile Card',
          headerStyle: { backgroundColor: '#3b82f6' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TP1 - Profile Card Interactive</Text>
        <Text style={styles.headerSubtitle}>
          Démonstration des hooks useState et useEffect
        </Text>
      </View>
      
      <ProfileCard
        imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
        name="Alex Johnson"
        position="Senior React Native Developer"
        followersCount={followersCount}
        isFollowing={isFollowing}
        onFollowPress={handleFollowPress}
      />
      
      <View style={styles.info}>
        <Text style={styles.infoTitle}>🎯 Fonctionnalités démontrées</Text>
        <Text style={styles.infoItem}>• useState pour l'état du bouton et du compteur</Text>
        <Text style={styles.infoItem}>• useEffect avec timer et cleanup</Text>
        <Text style={styles.infoItem}>• Auto-increment des followers (5s)</Text>
        <Text style={styles.infoItem}>• Design moderne avec animations</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    margin: 20,
    marginTop: 40,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#e1e5e9',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  position: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  followersText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 20,
    textAlign: 'center',
  },
  followButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  notFollowingButton: {
    backgroundColor: '#3b82f6',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#6b7280',
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notFollowingButtonText: {
    color: 'white',
  },
  followingButtonText: {
    color: '#6b7280',
  },
  info: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
    paddingLeft: 8,
  },
});