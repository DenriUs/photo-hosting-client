import React, { forwardRef, RefObject, useImperativeHandle } from 'react';
import { StyleSheet, View, GestureResponderEvent, TextInput as RNTextInput } from 'react-native';
import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import { useFormik } from 'formik';
import TextInput from '../inputs/TextInput';
import { FORM_ICON_SIZE } from '../../other/constants';
import { frogotPasswordSchema } from '../../other/formValidationSchemas';

interface IProps {
  onSubmit: () => void
}

const ForgotPasswordForm = forwardRef((props: IProps, ref: any) => {
  const { onSubmit } = props;

  const focusTextInput = (
    _event: GestureResponderEvent,
    textInputRef: RefObject<RNTextInput>
  ) => textInputRef.current?.focus();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: frogotPasswordSchema,
    onSubmit,
  });

  useImperativeHandle(ref, () => ({
    ...formik,
  }));

  return (
    <View style={styles.form}>
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
    </View>
  );
});

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
  textInputSubLabel: {
    fontSize: 12.5,
    color: '#ff302b',
  },
});

export default ForgotPasswordForm;
