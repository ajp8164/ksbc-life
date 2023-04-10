import { UserProfile } from 'types/user';

export const createAuthor = (userProfile: UserProfile) => {
  return {
    id: userProfile.id || '',
    firstName: userProfile.name?.split(' ')[0] || userProfile.email[0],
    lastName: userProfile.name?.split(' ')[1] || '',
    imageUrl: userProfile.photoUrl || '',
    avatarColor: userProfile.avatar.color || '',
  };
};
