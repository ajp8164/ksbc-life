import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export enum UserRole {
  Owner = 'Owner',
  Admin = 'Administrator',
  User = 'User',
}

export type UserProfile = {
  id?: string;
  name: string;
  email: string;
  photoUrl: string;
  role: UserRole;
};

export type User = {
  credentials: FirebaseAuthTypes.User | null | undefined;
  profile: UserProfile | undefined;
};
