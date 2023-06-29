import { DateTime } from 'luxon';
import { Group } from 'types/group';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { updateGroup } from 'firebase/firestore';

export const updateGroupLatestMessageSnippet = (
  message: MessageType.Any,
  userProfile: UserProfile,
  group: Group,
) => {
  if (!userProfile?.id) return group;

  let text = '';
  switch (message.type) {
    case 'file':
      text = 'Attachment: File';
      break;
    case 'image':
      text = 'Attachment: Image';
      break;
    case 'text':
      text = message.text;
      break;
    case 'video':
      text = 'Attachment: Video';
      break;
  }

  // This snippet overwrites any previous snippet created by any other group
  // member. We only track the last message sent by anyone.
  group.latestMessageSnippet = {
    createdBy: userProfile.id,
    createdAt: DateTime.now().toISO() || '', // We don't need server time here
    text: text,
    type: message.type,
    readBy: [userProfile.id], // I've always read my own message
  };

  updateGroup(group);
};
