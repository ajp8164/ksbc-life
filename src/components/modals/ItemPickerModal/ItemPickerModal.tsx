import { AppTheme, useTheme } from 'theme';
import { ItemPickerModalMethods, ItemPickerModalProps } from './types';
import { Modal, Picker } from '@react-native-ajp-elements/ui';
import React, { useImperativeHandle, useRef } from 'react';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Text } from 'react-native';
import { makeStyles } from '@rneui/themed';

type ItemPickerModal = ItemPickerModalMethods;

const ItemPickerModal = React.forwardRef<ItemPickerModal, ItemPickerModalProps>(
  (props, ref) => {
    const { items, itemWidth, labels, onValueChange, placeholder, title } =
      props;
    const theme = useTheme();
    const s = useStyles(theme);

    const innerRef = useRef<BottomSheetModalMethods>(null);

    useImperativeHandle(ref, () => ({
      //  These functions exposed to the parent component through the ref.
      dismiss,
      present,
    }));

    const dismiss = () => {
      innerRef.current?.dismiss();
    };

    const present = () => {
      innerRef.current?.present();
    };

    const onChange = (
      _wheelIndex: number,
      value: string | string[] | Date,
      _index: number,
    ): void => {
      onValueChange(value as string);
    };

    return (
      <Modal ref={innerRef} snapPoints={[300]} modalParent={true}>
        {title && <Text style={s.title}>{title}</Text>}
        <Picker
          items={items}
          itemWidth={itemWidth}
          labels={labels}
          placeholder={placeholder}
          value={new Date()}
          onValueChange={onChange}
        />
      </Modal>
    );
  },
);

const useStyles = makeStyles((_theme, theme: AppTheme) => ({
  view: {
    paddingTop: 30,
  },
  title: {
    ...theme.styles.textLarge,
    textAlign: 'center',
    paddingTop: 15,
  },
}));

export { ItemPickerModal };
