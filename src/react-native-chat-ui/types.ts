import * as React from 'react';

import {
  ColorValue,
  ImageStyle,
  ImageURISource,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { PreviewData } from '@flyerhq/react-native-link-preview';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MessageType {
  export type Any = Custom | File | Image | Text | Unsupported;

  export type DerivedMessage =
    | DerivedCustom
    | DerivedFile
    | DerivedImage
    | DerivedText
    | DerivedUnsupported;
  export type DerivedAny = DateHeader | DerivedMessage;

  export type PartialAny =
    | PartialCustom
    | PartialFile
    | PartialImage
    | PartialText;

  interface Base {
    author: User;
    createdAt?: number;
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
    roomId?: string;
    status?: 'delivered' | 'error' | 'seen' | 'sending' | 'sent';
    type: 'custom' | 'file' | 'image' | 'text' | 'unsupported';
    updatedAt?: number;
  }

  export interface DerivedMessageProps extends Base {
    nextMessageInGroup: boolean;
    // TODO: Check name?
    offset: number;
    showName: UsernameLocation;
    showStatus: boolean;
  }

  export interface DerivedCustom extends DerivedMessageProps, Custom {
    type: Custom['type'];
  }

  export interface DerivedFile extends DerivedMessageProps, File {
    type: File['type'];
  }

  export interface DerivedImage extends DerivedMessageProps, Image {
    type: Image['type'];
  }

  export interface DerivedText extends DerivedMessageProps, Text {
    type: Text['type'];
  }

  export interface DerivedUnsupported extends DerivedMessageProps, Unsupported {
    type: Unsupported['type'];
  }

  export interface PartialCustom extends Base {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
    type: 'custom';
  }

  export interface Custom extends Base, PartialCustom {
    type: 'custom';
  }

  export interface PartialFile {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
    mimeType?: string;
    name: string;
    size: number;
    type: 'file';
    uri: string;
  }

  export interface File extends Base, PartialFile {
    type: 'file';
  }

  export interface PartialImage {
    height?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
    name: string;
    size: number;
    type: 'image';
    uri: string;
    width?: number;
  }

  export interface Image extends Base, PartialImage {
    type: 'image';
  }

  export interface PartialText {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
    previewData?: PreviewData;
    text: string;
    type: 'text';
  }

  export interface Text extends Base, PartialText {
    type: 'text';
  }

  export interface Unsupported extends Base {
    type: 'unsupported';
  }

  export interface DateHeader {
    id: string;
    text: string;
    type: 'dateHeader';
  }
}

export interface PreviewImage {
  id: string;
  uri: ImageURISource['uri'];
}

export interface Size {
  height: number;
  width: number;
}

export type UsernameLocation = 'none' | 'inside' | 'outside';

/** Base chat theme containing all required properties to make a theme.
 * Implement this interface if you want to create a custom theme. */
export interface Theme {
  avatar: ThemeAvatar;
  bubble: ThemeBubble;
  colors: ThemeColors;
  composer: ThemeComposer;
  date: ThemeDate;
  icons?: ThemeIcons;
  list: ThemeList;
  statusIcon: ThemeStatusIcon;
}

export interface ThemeAvatar {
  colors: ColorValue[];
  imageBackgroundColor: ColorValue;
  text: TextStyle;
}

export interface ThemeBubble {
  bodyTextLeft: TextStyle;
  bodyTextRight: TextStyle;
  captionTextLeft: TextStyle;
  captionTextRight: TextStyle;
  containerLeft: ViewStyle;
  containerRight: ViewStyle;
  contentLeftContainer: ViewStyle;
  contentRightContainer: ViewStyle;
  documentIconLeftColor: ColorValue;
  documentIconRightColor: ColorValue;
  fileLeftContainer: TextStyle;
  fileRightContainer: TextStyle;
  headerText: TextStyle;
  linkDescriptionTextLeft: TextStyle;
  linkDescriptionTextRight: TextStyle;
  linkTitleTextLeft: TextStyle;
  linkTitleTextRight: TextStyle;
  messageTextLeft: TextStyle;
  messageTextRight: TextStyle;
  textLeftContainer: TextStyle;
  textRightContainer: TextStyle;
}

export interface ThemeColors {
  error: ColorValue;
  primary: ColorValue;
  secondary: ColorValue;
}

export interface ThemeDate {
  text: TextStyle;
}

export interface ThemeIcons {
  attachmentButtonIcon?: () => React.ReactNode;
  deliveredIcon?: () => React.ReactNode;
  documentIcon?: () => React.ReactNode;
  errorIcon?: () => React.ReactNode;
  seenIcon?: () => React.ReactNode;
  sendButtonIcon?: () => React.ReactNode;
  sendingIcon?: () => React.ReactNode;
}

export interface ThemeComposer {
  activityIndicator: {
    color: ColorValue;
    size: number;
  };
  attachmentIcon: ImageStyle;
  container: ViewStyle | ViewStyle[];
  contentOffsetKeyboardOpened: number;
  inputStyle: TextStyle;
  sendIcon: ImageStyle;
  tabBarHeight: number;
}

export interface ThemeList {
  activityIndicator: {
    color: ColorValue;
    size: number;
  };
  container: ViewStyle | ViewStyle[];
  contentContainer: ViewStyle | ViewStyle[];
  emptyChatPlaceholderText: TextStyle;
}

export interface ThemeStatusIcon {
  activityIndicator: {
    color: ColorValue;
    size: number;
  };
  image: ImageStyle;
  imageError: ImageStyle;
}

export interface User {
  createdAt?: number;
  firstName?: string;
  id: string;
  imageUrl?: ImageURISource['uri'];
  avatarColor?: ColorValue;
  lastName?: string;
  lastSeen?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  role?: 'admin' | 'agent' | 'moderator' | 'user';
  updatedAt?: number;
}
