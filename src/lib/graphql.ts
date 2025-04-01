
import { gql } from '@apollo/client';

// Auth mutations
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $password: String!) {
    register(username: $username, password: $password)
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

// Profile queries and mutations
export const GET_USER_PROFILE = gql`
  query GetUserProfile($username: String!) {
    getUserProfile(username: $username) {
      _id
      username
      profile_photo
      description
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($profilePhoto: String, $description: String) {
    updateProfile(profile_photo: $profilePhoto, description: $description) {
      _id
      username
      profile_photo
      description
    }
  }
`;

// Follow queries and mutations
export const GET_FOLLOWERS = gql`
  query GetFollowers {
    getFollowers
  }
`;

export const GET_FOLLOWING = gql`
  query GetFollowing {
    getFollowing
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($target: String!) {
    followUser(target: $target)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($target: String!) {
    unfollowUser(target: $target)
  }
`;

// Post queries and mutations
export const GET_POSTS_FOR_FOLLOWERS = gql`
  query GetPostsForFollowers {
    getPostsForFollowers {
      _id
      imagePath
      description
      timestamp
      owner {
        _id
        username
        profile_photo
      }
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($imagePath: String!, $description: String) {
    createPost(imagePath: $imagePath, description: $description) {
      _id
      imagePath
      description
      timestamp
      owner {
        _id
        username
      }
    }
  }
`;

// Recommendations
export const GET_RECOMMENDATIONS = gql`
  query GetRecommendations {
    getRecommendations {
      _id
      username
      profile_photo
      description
    }
  }
`;
