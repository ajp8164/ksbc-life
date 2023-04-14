import { hash } from 'lib/hash';

export const getUserAvatarColor = (userId: string, colors: string[]) =>
  colors[hash(userId) % colors.length];

//  Returns user initials (can have only first letter of firstName/lastName or both)
export const getUserInitials = (firstName: string, lastName: string) =>
  `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`
    .toUpperCase()
    .trim();
