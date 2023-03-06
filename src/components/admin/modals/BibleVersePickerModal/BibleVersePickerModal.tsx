import {
  BibleVerse,
  BibleVersePickerModalMethods,
  BibleVersePickerModalProps,
  BibleVersePickerNavigatorParamList,
} from './types';
import React, {
  createContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import BibleBookChaptersScreen from './BibleBookChaptersScreen';
import BibleVersesScreen from './BibleVersesScreen';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type BibleVerseContext = {
  dismiss: (bibleVerse?: BibleVerse) => void;
};

export const BibleVerseContext = createContext<BibleVerseContext>({
  dismiss: () => {
    return;
  },
});

const Stack = createNativeStackNavigator<BibleVersePickerNavigatorParamList>();

type BibleVersePickerModal = BibleVersePickerModalMethods;

const BibleVersePickerModal = React.forwardRef<
  BibleVersePickerModal,
  BibleVersePickerModalProps
>((props, ref) => {
  const { onDismiss } = props;
  const innerRef = useRef<BottomSheetModalMethods>(null);

  const [bibleVerse, setBibleVerse] = useState({} as BibleVerse);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = (bibleVerse?: BibleVerse) => {
    bibleVerse && setBibleVerse(bibleVerse);
    innerRef.current?.dismiss();
  };

  const present = () => {
    innerRef.current?.present();
  };

  return (
    <Modal ref={innerRef} onDismiss={() => onDismiss(bibleVerse)}>
      <BibleVerseContext.Provider value={{ dismiss }}>
        <NavigationContainer independent={true}>
          <Stack.Navigator screenOptions={{}}>
            <Stack.Screen
              name="BibleBookChaptersScreen"
              component={BibleBookChaptersScreen}
              options={{
                headerTitle: 'Books',
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="BibleVersesScreen"
              component={BibleVersesScreen}
              options={{
                headerTitle: 'Select Verse',
                headerBackTitle: 'Books',
                headerShadowVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BibleVerseContext.Provider>
    </Modal>
  );
});

export { BibleVersePickerModal };

// export function useBibleVerse() {
//   return useContext(BibleVerseContext);
// }
