import {
  BibleReferencePickerModalMethods,
  BibleReferencePickerModalProps,
  BibleReferencePickerNavigatorParamList,
} from './types';
import React, {
  createContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import BibleBookChaptersScreen from './BibleBookChaptersScreen';
import { BibleReference } from 'types/bible';
import BibleVersesScreen from './BibleVersesScreen';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Modal } from '@react-native-ajp-elements/ui';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type BibleReferenceContext = {
  dismiss: (bibleVerse?: BibleReference) => void;
};

export const BibleReferenceContext = createContext<BibleReferenceContext>({
  dismiss: () => {
    return;
  },
});

const Stack =
  createNativeStackNavigator<BibleReferencePickerNavigatorParamList>();

type BibleReferencePickerModal = BibleReferencePickerModalMethods;

const BibleReferencePickerModal = React.forwardRef<
  BibleReferencePickerModal,
  BibleReferencePickerModalProps
>((props, ref) => {
  const { onDismiss } = props;
  const innerRef = useRef<BottomSheetModalMethods>(null);

  const [bibleReference, setBibleReference] = useState({} as BibleReference);

  useImperativeHandle(ref, () => ({
    //  These functions exposed to the parent component through the ref.
    dismiss,
    present,
  }));

  const dismiss = (bibleReference?: BibleReference) => {
    bibleReference && setBibleReference(bibleReference);
    innerRef.current?.dismiss();
  };

  const present = () => {
    innerRef.current?.present();
  };

  return (
    <Modal ref={innerRef} onDismiss={() => onDismiss(bibleReference)}>
      <BibleReferenceContext.Provider value={{ dismiss }}>
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
      </BibleReferenceContext.Provider>
    </Modal>
  );
});

export { BibleReferencePickerModal };
