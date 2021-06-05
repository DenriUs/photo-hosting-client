import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomModal from './CustomModal';
import { MODAL_ICON_SIZE, MODAL_ICON_SUCCESS_COLOR } from '../../other/constants';

interface IProps {
  isVisible?: boolean;
  text?: string;
  onBackdropPress?: () => void;
  onCloseButtonPress?: () => void;
}

const SuccessModal = (props: IProps) => {
  const { isVisible, text, onBackdropPress, onCloseButtonPress } = props;

  return (
    <CustomModal
      isVisible={isVisible}
      top={
        <MaterialIcons
          name='check-circle'
          color={MODAL_ICON_SUCCESS_COLOR}
          size={MODAL_ICON_SIZE}
          style={style.icon} 
        />
      }
      title='Успіх!'
      {...text && { text }}
      animationIn='lightSpeedIn'
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
    color: '#ffa459',
  },
  icon: {
    paddingTop: 20,
    paddingBottom: 5,
  },
});

export default SuccessModal;
