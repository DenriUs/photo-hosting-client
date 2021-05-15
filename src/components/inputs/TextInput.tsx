import React, { RefObject, useRef } from 'react';
import {
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInput as RNTextInput,
  GestureResponderEvent,
} from 'react-native';
import { Title } from 'react-native-paper';

interface IProps {
  placeholder?: string;
  placeholderTextColor?: string;
  label?: string;
  value?: string;
  selectionColor?: string;
  left?: JSX.Element;
  right?: JSX.Element;
  wrapperOnLeftPress?: (
    event: GestureResponderEvent,
    textInputRef: RefObject<RNTextInput>,
  ) => void;
  wrapperOnRightPress?: (
    event: GestureResponderEvent,
    textInputRef: RefObject<RNTextInput>,
  ) => void;
  secureTextEntry?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  labelWrapperStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  onChangeText?: () => void;
}

const defaultPlaceholderTextColor = '#000000';
const defaultSelectionColor = '#000000';

const TextInput = (props: IProps) => {
  const {
    placeholder,
    placeholderTextColor,
    label,
    value,
    selectionColor,
    left,
    right,
    wrapperOnLeftPress,
    wrapperOnRightPress,
    secureTextEntry,
    wrapperStyle,
    style,
    labelWrapperStyle,
    labelStyle,
    onChangeText,
  } = props;

  const textInputRef = useRef<RNTextInput>(null);

  return (
    <>
      {label && (
        <View style={labelWrapperStyle}>
          <Title style={labelStyle}>{label}</Title>
        </View>
      )}
      <View
        style={[styles.textInputWrapper, wrapperStyle]}
      >
        {left && (
          <View
            {...wrapperOnLeftPress &&
              {
                onTouchEnd: (
                  event: GestureResponderEvent
                ) => wrapperOnLeftPress(event, textInputRef),
              }
            }
            style={styles.sideWrapper}
          >
            {left}
          </View>
        )}
        <RNTextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || defaultPlaceholderTextColor}
          selectionColor={selectionColor || defaultSelectionColor}
          value={value}
          secureTextEntry={secureTextEntry || false}
          {...onChangeText && onChangeText}
          ref={textInputRef}
          style={[styles.textInput, style]}
        />
        {right && (
          <View
            {...wrapperOnRightPress &&
              {
                onTouchEnd: (
                  event: GestureResponderEvent
                ) => wrapperOnRightPress(event, textInputRef),
              }
            }
            style={styles.sideWrapper}
          >
            {right}
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textInputWrapper: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 23,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    paddingLeft: 12,
    paddingRight: 10,
  },
  sideWrapper: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TextInput;
