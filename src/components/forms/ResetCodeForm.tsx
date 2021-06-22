import React, { forwardRef, RefObject, useState, useImperativeHandle } from 'react';
import { StyleSheet, View, GestureResponderEvent, TextInput as RNTextInput } from 'react-native';
import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import { IconButton } from 'react-native-paper';
import { useFormik } from 'formik';
import TextInput from '../inputs/TextInput';
import { FORM_ICON_SIZE } from '../../other/constants';
import { loginSchema, resetCodeSchema } from '../../other/formValidationSchemas';

interface IProps {
  onSubmit: (values: { code: string }) => void | Promise<void>;
}

const ResetCodeForm = forwardRef((props: IProps, ref: any) => {
  const { onSubmit } = props;

  const focusTextInput = (_event: GestureResponderEvent, textInputRef: RefObject<RNTextInput>) =>
    textInputRef.current?.focus();

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: resetCodeSchema,
    onSubmit,
  });

  useImperativeHandle(ref, () => ({
    ...formik,
  }));

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Код"
        placeholderTextColor="#3a2c3a"
        label="Код"
        {...(formik.touched.code &&
          formik.errors.code && { subLabel: formik.errors.code, hasError: true })}
        selectionColor="#3a2c3a"
        left={
          <MaterialIcon
            name="vpn-key"
            size={FORM_ICON_SIZE}
            color="#f7623c"
            style={styles.textInputLeft}
          />
        }
        value={formik.values.code}
        onChangeText={formik.handleChange('code')}
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
    color: '#f7623c',
  },
  lastTextInputSubLabelWrapper: {
    position: 'absolute',
    width: '90%',
    top: '99.8%',
  },
});

export default ResetCodeForm;
