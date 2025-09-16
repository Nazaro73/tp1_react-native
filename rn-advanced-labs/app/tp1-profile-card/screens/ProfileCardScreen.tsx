import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileCard from '../components/ProfileCard';

const ProfileCardScreen: React.FC = () => {
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
      <ProfileCard
        imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
        name="Alex Johnson"
        position="Senior React Native Developer"
        followersCount={followersCount}
        isFollowing={isFollowing}
        onFollowPress={handleFollowPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ProfileCardScreen;