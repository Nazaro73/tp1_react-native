import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ProfileCardProps {
  imageUrl: string;
  name: string;
  position: string;
  followersCount: number;
  isFollowing: boolean;
  onFollowPress: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  imageUrl,
  name,
  position,
  followersCount,
  isFollowing,
  onFollowPress,
}) => {
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

const styles = StyleSheet.create({
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
    minWidth: 280,
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
});

export default ProfileCard;