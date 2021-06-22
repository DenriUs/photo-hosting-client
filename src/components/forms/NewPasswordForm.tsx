import React, { forwardRef, RefObject, useImperativeHandle, useState } from 'react';
import { StyleSheet, View, GestureResponderEvent, TextInput as RNTextInput } from 'react-native';
import { MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import { useFormik } from 'formik';
import TextInput from '../inputs/TextInput';
import { FORM_ICON_SIZE } from '../../other/constants';
import { newPasswordSchema } from '../../other/formValidationSchemas';
import { IconButton } from 'react-native-paper';

interface IProps {
  onSubmit: (values: { newPassword: string }) => void | Promise<void>;
}

const NewPasswordForm = forwardRef((props: IProps, ref: any) => {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const { onSubmit } = props;

  const togglePasswordVisibility = () => setIsPasswordHidden(!isPasswordHidden);

  const focusTextInput = (_event: GestureResponderEvent, textInputRef: RefObject<RNTextInput>) =>
    textInputRef.current?.focus();

  const formik = useFormik({
    initialValues: {
      newPassword: '',
    },
    validationSchema: newPasswordSchema,
    onSubmit,
  });

  useImperativeHandle(ref, () => ({
    ...formik,
  }));

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Пароль"
        placeholderTextColor="#3a2c3a"
        label="Пароль"
        {...(formik.touched.newPassword &&
          formik.errors.newPassword && { subLabel: formik.errors.newPassword, hasError: true })}
        selectionColor="#3a2c3a"
        secureTextEntry={isPasswordHidden}
        left={
          <MaterialIcon
            name="vpn-key"
            size={FORM_ICON_SIZE}
            color="#f7623c"
            style={styles.textInputLeft}
          />
        }
        right={
          <IconButton
            icon={!isPasswordHidden ? 'eye-outline' : 'eye-off-outline'}
            size={FORM_ICON_SIZE}
            color="#3a2c3a"
            onPress={togglePasswordVisibility}
            style={styles.textInputRight}
          />
        }
        value={formik.values.newPassword}
        onChangeText={formik.handleChange('newPassword')}
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

export default NewPasswordForm;
