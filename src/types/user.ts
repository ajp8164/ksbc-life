import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export enum UserRole {
  Owner = 'Owner',
  Admin = 'Administrator',
  User = 'User',
}

export enum UserStatus {
  Active = 'Active',
  Disabled = 'Disabled',
}

export type UserProfile = {
  id?: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  avatar: {
    color: string;
    title: string;
  };
  role: UserRole;
  status: UserStatus;
  groups: string[];
  notifications: {
    badgeCount: number;
    pushTokens: string[];
  };
};

export type User = {
  credentials: FirebaseAuthTypes.User | null | undefined;
  profile: UserProfile | undefined;
};
