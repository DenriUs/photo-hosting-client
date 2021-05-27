import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomModal from './CustomModal';
import { MODAL_ICON_ERROR_COLOR, MODAL_ICON_SIZE } from '../../other/constants';

interface IProps {
  isVisible: boolean;
  text?: string;
  onBackdropPress?: () => void;
  onCloseButtonPress?: () => void;
}

const ErrorModal = (props: IProps) => {
  const { isVisible, text, onBackdropPress, onCloseButtonPress } = props;

  return (
    <CustomModal
      isVisible={isVisible}
      top={
        <MaterialIcons
          name='warning'
          color={MODAL_ICON_ERROR_COLOR}
          size={MODAL_ICON_SIZE}
          style={style.icon}
        />
      }
      title='Помилка!'
      animationIn='bounceIn'
      animationOut='fadeOut'
      {...text && { text }}
      {...onBackdropPress && { onBackdropPress }}
      {...onCloseButtonPress && { onCloseButtonPress }}
      titleStyle={style.title}
    />
  );
};

const style = StyleSheet.create({
  title: {
    color: '#d45d44',
  },
  icon: {
    paddingTop: 20,
    paddingBottom: 5,
  },
});

export default ErrorModal;
