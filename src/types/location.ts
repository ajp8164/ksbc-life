import { StreetAddress } from 'types/common';

export type Location = {
  id?: string;
  name: string;
  address: StreetAddress;
  email: string;
  phone: string;
  photoUrl: string;
};
