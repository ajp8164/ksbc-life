import { Group } from 'types/group';
import React from 'react';
import { UserProfile } from 'types/user';

export declare type ChatGroupComposer = ChatGroupComposerMethods;

declare const ChatGroupComposer: React.MemoExoticComponent<
  React.ForwardRefExoticComponent<
    ChatGroupComposerProps & React.RefAttributes<ChatGroupComposerMethods>
  >
>;

export interface ChatGroupComposerProps {
  myGroups?: Group[];
  myUserProfile: UserProfile;
  onComposerChanged: (group?: Group, userProfiles?: UserProfile[]) => void;
  visible: boolean;
}

export interface ChatGroupComposerMethods {
  createGroup: () => Promise<Group>;
  presentUserPicker: () => void;
}
