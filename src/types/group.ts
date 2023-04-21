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
  latestMessageSnippet?: {
    createdBy: string;
    createdAt: string;
    text: string;
    type: string;
    //List of group member ids that have read this message
    readBy: string[];
  };
};
