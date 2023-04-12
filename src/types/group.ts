export type Group = {
  id: string;
  createdBy: string;
  createdAt?: number;
  name?: string;
  type: 'public' | 'private';
  members: string[];
  leaders: string[];
  updatedAt?: number;
};
