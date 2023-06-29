import { DateTime } from 'luxon';
import { Group } from 'types/group';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { UserProfile } from 'types/user';
import { updateGroup } from 'firebase/firestore';

export const updateGroupLatestMessageSnippet = (
  messages: MessageType.Any[],
  userProfile: UserProfile,
  group: Group,
) => {
  if (!userProfile?.id) return group;

  let text = '';
  const attachmentCount = {
    file: 0,
    image: 0,
    video: 0,
  };

  messages.forEach(message => {
    switch (message.type) {
      case 'file':
        attachmentCount.file++;
        break;
      case 'image':
        attachmentCount.image++;
        break;
      case 'text':
        text = message.text;
        break;
      case 'video':
        attachmentCount.video++;
        break;
    }
  });

  let multiple = false;
  if (text.length === 0) {
    if (attachmentCount.file > 0) {
      text = `${attachmentCount.file} File`;
      if (attachmentCount.file > 1) {
        text = `${text}s`;
        multiple = true;
      }
    }
    if (attachmentCount.image > 0) {
      if (text.length > 0) {
        text = `${text}, `;
      }
      text = `${text}${attachmentCount.image} Image`;
      if (attachmentCount.image > 1) {
        text = `${text}s`;
        multiple = true;
      }
    }
    if (attachmentCount.video > 0) {
      if (text.length > 0) {
        text = `${text}, `;
      }
      text = `${text}${attachmentCount.video} Video`;
      if (attachmentCount.video > 1) {
        text = `${text}s`;
        multiple = true;
      }
    }

    if (text.length > 0) {
      text = multiple ? `Attachments: ${text}` : `Attachment: ${text}`;
    }
  }

  // This snippet overwrites any previous snippet created by any other group
  // member. We only track the last message sent by anyone.
  group.latestMessageSnippet = {
    createdBy: userProfile.id,
    createdAt: DateTime.now().toISO() || '', // We don't need server time here
    text,
    type: 'text', //,message.type,
    readBy: [userProfile.id], // I've always read my own message
  };
  console.log(group.latestMessageSnippet);
  updateGroup(group);
};
