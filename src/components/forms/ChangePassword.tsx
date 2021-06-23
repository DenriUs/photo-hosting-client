import React, { forwardRef, RefObject, useState, useImperativeHandle } from 'react';
import { StyleSheet, View, GestureResponderEvent, TextInput as RNTextInput } from 'react-native';
import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import { useFormik } from 'formik';
import TextInput from '../inputs/TextInput';
import { FORM_ICON_SIZE } from '../../other/constants';
import { changePassword } from '../../other/formValidationSchemas';

interface IProps {
  onSubmit: (values: { oldPassword: string, newPassword: string }) => void | Promise<void>;
};

const ChangePasswordForm = forwardRef((props: IProps, ref: any) => {
  const [isOldPasswordHidden, setIsOldPasswordHidden] = useState(true);
  const [isNewPasswordHidden, setIsNewPasswordHidden] = useState(true);

  const { onSubmit } = props;

  const toggleOldPasswordVisibility = () => setIsOldPasswordHidden(!isOldPasswordHidden);
  const toggleNewPasswordVisibility = () => setIsNewPasswordHidden(!isNewPasswordHidden);

  const focusTextInput = (
    _event: GestureResponderEvent,
    textInputRef: RefObject<RNTextInput>
  ) => textInputRef.current?.focus();

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
    },
    validationSchema: changePassword,
    onSubmit,
  });

  useImperativeHandle(ref, () => ({
    ...formik,
  }));

  return (
    <View style={styles.form}>
      <TextInput
        placeholder='Пароль'
        placeholderTextColor='#3a2c3a'
        label='Новий пароль'
        {...(formik.touched.oldPassword
          && formik.errors.oldPassword && { subLabel: formik.errors.oldPassword, hasError: true })}
        selectionColor='#3a2c3a'
        secureTextEntry={isOldPasswordHidden}
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
            icon={!isNewPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
            size={FORM_ICON_SIZE}
            color='#3a2c3a'
            onPress={toggleOldPasswordVisibility}
            style={styles.textInputRight}
          />
        }
        value={formik.values.oldPassword}
        onChangeText={formik.handleChange('oldPassword')}
        wrapperOnLeftPress={focusTextInput}
        wrapperStyle={styles.textInputWrapper}
        labelWrapperStyle={styles.textInputLabelWrapper}
        labelStyle={styles.textInputLabel}
        subLabelWrapperStyle={styles.lastTextInputSubLabelWrapper}
        subLabelStyle={styles.textInputSubLabel}
      />
      <TextInput
        placeholder='Пароль'
        placeholderTextColor='#3a2c3a'
        label='Новий пароль'
        {...(formik.touched.newPassword
          && formik.errors.newPassword && { subLabel: formik.errors.newPassword, hasError: true })}
        selectionColor='#3a2c3a'
        secureTextEntry={isNewPasswordHidden}
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
            icon={!isNewPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
            size={FORM_ICON_SIZE}
            color='#3a2c3a'
            onPress={toggleNewPasswordVisibility}
            style={styles.textInputRight}
          />
        }
        value={formik.values.newPassword}
        onChangeText={formik.handleChange('newPassword')}
        wrapperOnLeftPress={focusTextInput}
        wrapperStyle={styles.textInputWrapper}
        labelWrapperStyle={styles.textInputLabelWrapper}
        labelStyle={styles.textInputLabel}
        subLabelWrapperStyle={styles.lastTextInputSubLabelWrapper}
        subLabelStyle={styles.textInputSubLabel}
      />
    </View>
  );
});

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
  textInputSubLabel: {
    fontSize: 12.5,
    color: '#f7623c',
  },
  lastTextInputSubLabelWrapper: {
    position: 'absolute',
    width: '90%',
    top: '99.8%',
  },
});

export default ChangePasswordForm;
