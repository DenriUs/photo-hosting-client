import React from 'react';
import { StyleSheet, View, Text, TextStyle, StyleProp } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Title } from 'react-native-paper';

interface IProps {
  isVisible?: boolean;
  animationIn?: any;
  animationOut?: any;
  top?: JSX.Element;
  title?: string;
  text?: string;
  onBackdropPress?: () => void;
  onCloseButtonPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomModal = (props: IProps) => {
  const {
    isVisible,
    animationIn,
    animationOut,
    top,
    title,
    text,
    onBackdropPress,
    onCloseButtonPress,
    titleStyle,
    textStyle,
  } = props;

  return (
    <Modal
      isVisible={isVisible}
      animationIn={animationIn}
      animationOut={animationOut}
      statusBarTranslucent
      backdropTransitionOutTiming={0}
      {...onBackdropPress && { onBackdropPress }}
      style={styles.modal}
    >
      <View style={styles.contentContainer}>
        {top}
        <Title style={titleStyle}>
          {title}
        </Title>
        <Text style={[styles.text, textStyle]}>
          {text}
        </Text>
        <Button
          color="#3a2c3a"
          uppercase={false}
          labelStyle={styles.closeButtonLabel}
          contentStyle={styles.closeButtonContent}
          {...onCloseButtonPress && { onPress: onCloseButtonPress }}
          style={styles.closeButton}
        >
          <Text>Закрити</Text>
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: '#ffffff',
  },
  text: {
    width: '80%',
    textAlign: 'center',
    color: '#3a2c3a',
    fontSize: 17,
    fontFamily: 'sans-serif-light',
  },
  closeButtonLabel: {
    fontSize: 16,
    letterSpacing: 0,
  },
  closeButtonContent: {
    padding: 2,
  },
  closeButton: {
    width: '100%',
    marginTop: 30,
    borderRadius: 7,
  },
});

export default CustomModal;
