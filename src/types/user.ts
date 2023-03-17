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
  email: string;
  photoUrl: string;
  role: UserRole;
  status: UserStatus;
};

export type User = {
  credentials: FirebaseAuthTypes.User | null | undefined;
  profile: UserProfile | undefined;
};
