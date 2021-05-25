import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  useWindowDimensions,
  Animated,
  Image,
  Keyboard,
  ScrollView,
  PixelRatio,
} from 'react-native';
import { Button } from 'react-native-paper';
import Constants from 'expo-constants';
import { FormikHelpers, FormikProps } from 'formik';
import TopTabBar from '../../components/tabBars/TopTabBar';
import LoginForm from '../../components/forms/LoginForm';
import RegisterForm from '../../components/forms/RegisterForm';
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm';
import CustomHeader from '../../components/headers/CustomHeader';
import { getPercentagerFromNumber, normalizeHeight } from '../../helpers/calculation';
import { appLogo, jwtAsyncStorageKeyName } from '../../other/constants';
import { AxiosHelper } from '../../helpers/api';
import { checkAuthStatus, loginAccount } from '../../api/requests/authorization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_MODAL_HEIGHT = 305;
const REGISTER_MODAL_HEIGHT = 378;
const FORGOT_PASSWORD_MODAL_HEIGHT = 185;

const MODAL_ANIMATION_DURATION = 300;

const loginTabName = 'Вхід';
const registerTabName = 'Реєстрація';

const loginSubmitName = 'Увійти';
const registerSubmitName = 'Зареєструватися';
const forgotPassowrdSubmitName = 'Відправити код';

interface IProps {
  navigation: any;
}

const Authorization = (props: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [modalOffset, setModalOffset] = useState(0);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const { navigation } = props;

  const formikRef = useRef<FormikProps<{}>>(null);
  
  const { width, height } = useWindowDimensions();

  const modalWidth = width * 0.9;
  const distanceFromModalToStatusBar = getPercentagerFromNumber(height, 30);

  const fontScale = PixelRatio.getFontScale();

  const normalizedLoginHeight = normalizeHeight(LOGIN_MODAL_HEIGHT, fontScale);
  const normalizedRegisterHeight = normalizeHeight(REGISTER_MODAL_HEIGHT, fontScale);
  const normalizedForgotPasswordHeight = normalizeHeight(FORGOT_PASSWORD_MODAL_HEIGHT, fontScale);

  const modalHeight = useRef(
    new Animated.Value(currentTabIndex === 0 ? normalizedLoginHeight : normalizedRegisterHeight)
  ).current;

  const runModalHeightAnimation = (
    height: number,
    duration: number = MODAL_ANIMATION_DURATION,
  ) => {
    Animated.timing(modalHeight, {
      toValue: height,
      duration,
      useNativeDriver: false,
    }).start();
  };

  const onTabPress = (tabIndex: number) => {
    topTabBarLabels[tabIndex].name === loginTabName
      ? runModalHeightAnimation(normalizedLoginHeight)
      : runModalHeightAnimation(normalizedRegisterHeight);
    setCurrentTabIndex(tabIndex);
  };

  const onBackActionPress = () => {
    runModalHeightAnimation(normalizedLoginHeight);
    setIsForgotPassword(false);
  };

  const onForgoPasswordPress = () => {
    runModalHeightAnimation(normalizedForgotPasswordHeight);
    setIsForgotPassword(true);
  };

  const onLoginSubmit = async (
    values: {
      login: string;
      password: string;
    },
    formikHelpers: FormikHelpers<{
      login: string;
      password: string;
    }>,
  ) => {
    const { login, password } = values;
    const response = await loginAccount(login, password);
    if (response.error) {
      setErrorText(response.error);
      console.log(errorText);
      return;
    }
    setErrorText('');
    formikHelpers.resetForm();
    navigation.navigate('Main');
  }

  const onRegisterSubmit = () => {
    console.log('register submitted!');
  };

  const onForgotPasswordSubmit = () => {
    console.log('forgot password submitted!');
  };

  const topTabBarLabels = [
    {
      name: loginTabName,
      component: <LoginForm ref={formikRef} onSubmit={onLoginSubmit} />
    },
    {
      name: registerTabName,
      component: <RegisterForm ref={formikRef} onSubmit={onRegisterSubmit} />
    },
  ];

  useEffect(() => {
    (async () => {
      await AxiosHelper.updateAxiosInstance();
      const response = await checkAuthStatus();
      setIsLoading(false);
      if (response.error) {
        return;
      }
      navigation.navigate('Main');
    })();

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      const scrollViewOffset = getPercentagerFromNumber(height, 7.2);
      const openedKeyboardScreenHeight =
        Constants.statusBarHeight +
        distanceFromModalToStatusBar +
        (modalHeight as any)._value +
        event.endCoordinates.height +
        scrollViewOffset;
      const calculatedOffset = height - openedKeyboardScreenHeight;
      setModalOffset(calculatedOffset < 0 ? calculatedOffset : 0);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setModalOffset(0)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return isLoading ? (
    <View style={[styles.flex, styles.loadingContainer]}>
      <StatusBar backgroundColor='#ffffff' barStyle='dark-content' />
    </View>
  ) : (
    <SafeAreaView style={styles.flex}>
      <StatusBar backgroundColor='#f5e0ce' barStyle='dark-content' />
      <View style={{ width, height, ...styles.backgroundContainer }}>
        <View style={styles.backroundHeaderContainer}>
          <Image source={appLogo} />
        </View>
        <View style={styles.backgroundBodyContainer}></View>
      </View>
      <View style={styles.flex}>
        <ScrollView
          keyboardShouldPersistTaps='always'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}>
          <View style={{ height: distanceFromModalToStatusBar + modalOffset }}></View>
          <Animated.View style={{ width: modalWidth, height: modalHeight, ...styles.modal }}>
            {!isForgotPassword ? (
              <>
                <TopTabBar
                  tabs={topTabBarLabels}
                  tabBarWidth={modalWidth}
                  onTabPress={onTabPress}
                  tabBarStyle={{ marginBottom: fontScale > 1 ? 0 : 12 }}
                />
                {topTabBarLabels[currentTabIndex].component}
              </>
            ) : (
              <>
                <CustomHeader
                  title='Відновлення паролю'
                  backActionIcon='chevron-left'
                  onBackActionPress={onBackActionPress}
                />
                <ForgotPasswordForm ref={formikRef} onSubmit={onForgotPasswordSubmit} />
              </>
            )}
            {topTabBarLabels[currentTabIndex].name === loginTabName && !isForgotPassword && (
              <View
                style={{
                  ...styles.forgotPasswordButtonWrapper,
                }}
              >
                <Button
                  uppercase={false}
                  compact={true}
                  color='#3a2c3a'
                  contentStyle={{ height: normalizeHeight(20, fontScale) }}
                  labelStyle={styles.forgotPasswordButtonLabel}
                  onPress={onForgoPasswordPress}
                  style={{ marginTop: 12 }}
                >
                  <Text>Забули пароль?</Text>
                </Button>
              </View>
            )}
          </Animated.View>
          <View style={styles.submitButtonWrapper}>
            <Button
              mode='contained'
              color='#3a2c3a'
              uppercase={false}
              onPress={() => formikRef.current && formikRef.current.submitForm()}
              labelStyle={styles.submitButtonLabel}
              style={styles.submitButton}>
              <Text>
                {isForgotPassword
                  ? forgotPassowrdSubmitName
                  : currentTabIndex === 0 ? loginSubmitName : registerSubmitName}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
  },
  backgroundContainer: {
    position: 'absolute',
    backgroundColor: '#f5e0ce',
  },
  backroundHeaderContainer: {
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundBodyContainer: {
    height: '65%',
    borderTopLeftRadius: 40,
    backgroundColor: '#ffffff',
  },
  scrollViewContainer: {
    alignItems: 'center',
  },
  modal: {
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#ffffff',
    elevation: 6,
  },
  forgotPasswordButtonWrapper: {
    position: 'relative',
    width: '90%',
    alignItems: 'flex-end',
    marginTop: 0,
  },
  forgotPasswordButtonLabel: {
    fontSize: 13.3,
    letterSpacing: 0,
  },
  submitButtonWrapper: {
    width: '65%',
    alignItems: 'center',
    top: -30,
    marginBottom: -15,
    borderWidth: 3,
    borderRadius: 26,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
    elevation: 6,
  },
  submitButtonLabel: {
    fontSize: 15,
    letterSpacing: 0.5,
    padding: 4,
  },
  submitButton: {
    width: '100%',
    borderRadius: 23,
  },
});

export default Authorization;
