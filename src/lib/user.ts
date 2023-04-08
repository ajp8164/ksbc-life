export const hashCode = (text = '') => {
  let i,
    chr,
    hash = 0;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash << 5) - hash + chr;
    // eslint-disable-next-line no-bitwise
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

export const getUserAvatarColor = (userId: string, colors: string[]) =>
  colors[hashCode(userId) % colors.length];

//  Returns user initials (can have only first letter of firstName/lastName or both)
export const getUserInitials = (firstName: string, lastName: string) =>
  `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`
    .toUpperCase()
    .trim();
