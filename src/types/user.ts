import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export type UserProfile = {
  name: string;
  email: string;
  photoUrl: string;
  roles: UserRole[];
};

export type User = {
  credentials: FirebaseAuthTypes.User | null | undefined;
  profile: UserProfile | undefined;
};
