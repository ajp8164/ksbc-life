export type Group = {
  id?: string;
  createdBy: string;
  createdAt?: number;
  updatedAt?: number;
  name: string;
  type: 'public' | 'private';
  members: string[];
  leaders: string[];
  photoUrl: string;
  avatar: {
    color: string;
    title: string;
  };
  isTyping?: { [key in string]: string }[];
};
