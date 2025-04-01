
// API functions for user operations

export interface Profile {
  _id?: string;
  username: string;
  profile_photo?: string;
  description?: string;
}

// Function to get user profile by username
export const getUserProfile = async (username: string): Promise<Profile> => {
  // This would normally be a fetch request to your API
  // For now, simulating API response with a timeout
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Check if username exists (simulating API logic)
      if (username.toLowerCase() === 'unknown') {
        reject(new Error('User not found'));
        return;
      }
      
      // Return dummy profile data
      resolve({
        _id: `user_${Math.random().toString(36).substring(2, 9)}`,
        username: username,
        profile_photo: '',
        description: `This is ${username}'s profile.`
      });
    }, 500);
  });
};

// Function to follow a user
export const followUser = async (username: string): Promise<boolean> => {
  // This would normally be a fetch request to your API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API response
      if (Math.random() > 0.1) { // 90% success rate
        resolve(true);
      } else {
        reject(new Error('Failed to follow user'));
      }
    }, 500);
  });
};

// Function to unfollow a user
export const unfollowUser = async (username: string): Promise<boolean> => {
  // This would normally be a fetch request to your API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate API response
      if (Math.random() > 0.1) { // 90% success rate
        resolve(true);
      } else {
        reject(new Error('Failed to unfollow user'));
      }
    }, 500);
  });
};

// Function to get users you are following
export const getFollowing = async (): Promise<string[]> => {
  // This would normally be a fetch request to your API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return dummy following data
      resolve(['user1', 'user2', 'user3']);
    }, 300);
  });
};

// Function to get users who follow you
export const getFollowers = async (): Promise<string[]> => {
  // This would normally be a fetch request to your API
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return dummy followers data
      resolve(['user2', 'user4', 'user5']);
    }, 300);
  });
};
