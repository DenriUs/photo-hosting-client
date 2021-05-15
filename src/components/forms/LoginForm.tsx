import React, { RefObject, useState } from 'react';
import {
  StyleSheet,
  View,
  GestureResponderEvent,
  TextInput as RNTextInput
} from 'react-native';
import { IconButton } from 'react-native-paper';
import TextInput from '../inputs/TextInput';
import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import { FORM_ICON_SIZE } from '../../other/constants';

const LoginForm = () => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => setIsPasswordHidden(!isPasswordHidden);

  const focusTextInput = (
    _event: GestureResponderEvent, 
    textInputRef: RefObject<RNTextInput>,
  ) => textInputRef.current?.focus();

  return (
    <View style={styles.form}>
      <TextInput
        placeholder='Логін'
        placeholderTextColor='#3a2c3a'
        label='Логін'
        selectionColor='#3a2c3a'
        left={
          <MaterialIcon
            name='person-outline'
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
      <TextInput
        placeholder='Пароль'
        placeholderTextColor='#3a2c3a'
        label='Пароль'
        selectionColor='#3a2c3a'
        secureTextEntry={isPasswordHidden}
        left={
          <MaterialIcon
            name='lock-outline' 
            size={FORM_ICON_SIZE}
            color='#f7623c'
            style={styles.textInputLeft}
          />
        }
        right={
          <IconButton
            icon={!isPasswordHidden ? 'eye-outline' : 'eye-off-outline' }
            size={FORM_ICON_SIZE}
            color='#3a2c3a'
            onPress={togglePasswordVisibility}
            style={styles.textInputRight}
          />
        }
        wrapperOnLeftPress={focusTextInput}
        wrapperStyle={styles.lastTextInputWrapper}
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
  },
  textInputWrapper: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#3a2c3a',
  },
  lastTextInputWrapper: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#3a2c3a',
    marginBottom: 9,
  },
  textInputLeft: {
    marginLeft: 15,
  },
  textInputRight: {
    marginLeft: 0,
    marginRight: 12,
  },
  textInputLabelWrapper: {
    width: '90%',
  },
  textInputLabel: {
    fontSize: 15,
    color: '#3a2c3a',
  },
});

export default LoginForm;
