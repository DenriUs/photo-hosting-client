import React, { forwardRef, RefObject, useState, useImperativeHandle } from 'react';
import { StyleSheet, View, GestureResponderEvent, TextInput as RNTextInput } from 'react-native';
import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import { useFormik } from 'formik';
import TextInput from '../inputs/TextInput';
import { FORM_ICON_SIZE } from '../../other/constants';
import { registerSchema } from '../../other/formValidationSchemas';

interface IProps {
  onSubmit: (values: { login: string, email: string, password: string }) => void | Promise<void>;
};

const RegisterForm = forwardRef((props: IProps, ref: any) => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const { onSubmit } = props;

  const togglePasswordVisibility = () => setIsPasswordHidden(!isPasswordHidden);

  const focusTextInput = (
    _event: GestureResponderEvent,
    textInputRef: RefObject<RNTextInput>
  ) => textInputRef.current?.focus();

  const formik = useFormik({
    initialValues: {
      login: '',
      email: '',
      password: '',
    },
    validationSchema: registerSchema,
    onSubmit,
  });

  useImperativeHandle(ref, () => ({
    ...formik,
  }));

  return (
    <View style={styles.form}>
      <TextInput
        placeholder='Логін'
        placeholderTextColor='#3a2c3a'
        label='Логін'
        {...(formik.touched.login
          && formik.errors.login && { subLabel: formik.errors.login, hasError: true })}
        selectionColor='#3a2c3a'
        left={
          <MaterialIcon
            name='person-outline'
            size={FORM_ICON_SIZE}
            color='#f7623c'
            style={styles.textInputLeft}
          />
        }
        value={formik.values.login}
        onChangeText={formik.handleChange('login')}
        wrapperOnLeftPress={focusTextInput}
        wrapperStyle={styles.textInputWrapper}
        labelWrapperStyle={styles.textInputLabelWrapper}
        labelStyle={styles.textInputLabel}
        subLabelWrapperStyle={styles.textInputLabelWrapper}
        subLabelStyle={styles.textInputSubLabel}
      />
      <TextInput
        placeholder='Пошта'
        placeholderTextColor='#3a2c3a'
        label='Пошта'
        {...(formik.touched.email
          && formik.errors.email && { subLabel: formik.errors.email, hasError: true })}
        selectionColor='#3a2c3a'
        left={
          <MaterialIcon
            name='mail-outline'
            size={FORM_ICON_SIZE}
            color='#f7623c'
            style={styles.textInputLeft}
          />
        }
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        wrapperOnLeftPress={focusTextInput}
        wrapperStyle={styles.textInputWrapper}
        labelWrapperStyle={styles.textInputLabelWrapper}
        labelStyle={styles.textInputLabel}
        subLabelWrapperStyle={styles.textInputLabelWrapper}
        subLabelStyle={styles.textInputSubLabel}
      />
      <TextInput
        placeholder='Пароль'
        placeholderTextColor='#3a2c3a'
        label='Пароль'
        {...(formik.touched.password
          && formik.errors.password && { subLabel: formik.errors.password, hasError: true })}
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
            icon={!isPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
            size={FORM_ICON_SIZE}
            color='#3a2c3a'
            onPress={togglePasswordVisibility}
            style={styles.textInputRight}
          />
        }
        onChangeText={formik.handleChange('password')}
        value={formik.values.password}
        wrapperOnLeftPress={focusTextInput}
        wrapperStyle={styles.textInputWrapper}
        labelWrapperStyle={styles.textInputLabelWrapper}
        labelStyle={styles.textInputLabel}
        subLabelWrapperStyle={styles.textInputLabelWrapper}
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
    color: '#ff302b',
  },
});

export default RegisterForm;
