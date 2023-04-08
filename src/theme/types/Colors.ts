import '@rneui/themed';

declare module '@rneui/themed' {
  export interface Colors {
    readonly avatarColors: string[];
    readonly cardBackground: string;
    readonly listItemBackgroundAlt: string;
    readonly shadowColor: string;
  }
}
