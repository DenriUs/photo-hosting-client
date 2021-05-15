import React, { RefObject } from 'react';
import {
  StyleSheet,
  View,
  GestureResponderEvent,
  TextInput as RNTextInput
} from 'react-native';
import TextInput from '../inputs/TextInput';
import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import { FORM_ICON_SIZE } from '../../other/constants';

const ForgotPasswordForm = () => {
  const focusTextInput = (
    _event: GestureResponderEvent, 
    textInputRef: RefObject<RNTextInput>,
  ) => textInputRef.current?.focus();

  return (
    <View style={styles.form}>
      <TextInput
        placeholder='Пошта'
        placeholderTextColor='#3a2c3a'
        label='Пошта'
        selectionColor='#3a2c3a'
        left={
          <MaterialIcon
            name='mail-outline'
            size={FORM_ICON_SIZE}
            color='#f7623c'
            style={styles.textInputLeft}
          />
        }
        wrapperOnLeftPress={focusTextInput}
        wrapperStyle={styles.textInputWrapper}
        labelWrapperStyle={styles.textInputLabelWrapper}
        labelStyle={styles.textInputLabel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 35,
  },
  textInputWrapper: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#3a2c3a',
  },
  textInputLeft: {
    marginLeft: 15,
  },
  textInputLabelWrapper: {
    width: '90%',
  },
  textInputLabel: {
    fontSize: 15,
    color: '#3a2c3a',
  },
});

export default ForgotPasswordForm;
