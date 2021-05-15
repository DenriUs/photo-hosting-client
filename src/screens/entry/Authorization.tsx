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
} from 'react-native';
import { Button } from 'react-native-paper';
import Constants from 'expo-constants';
import TopTabBar from '../../components/tabBars/TopTabBar';
import LoginForm from '../../components/forms/LoginForm';
import RegisterForm from '../../components/forms/RegisterForm';
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm';
import ForgotPasswordHeader from '../../components/headers/CustomHeader';
import { getPercentagerFromNumber } from '../../helpers/calculation';
import { appLogo } from '../../other/constants';

const LOGIN_MODAL_HEIGHT = 300;
const REGISTER_MODAL_HEIGHT = 360;
const FORGOT_PASSWORD_MODAL_HEIGHT = 190;

const MODAL_ANIMATION_DURATION = 300;

const loginTabName = 'Вхід';
const registerTabName = 'Реєстрація';
const submitForgotPasswordBtnName = 'Відправити код';

const topTabBarLabels = [
  { name: loginTabName, component: <LoginForm /> },
  { name: registerTabName, component: <RegisterForm /> },
];

const Authorization = () => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [modalOffset, setModalOffset] = useState(0);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const modalHeight = useRef(
    new Animated.Value(currentTabIndex === 0 ? LOGIN_MODAL_HEIGHT : REGISTER_MODAL_HEIGHT)
  ).current;

  const { width, height } = useWindowDimensions();

  const modalWidth = width * 0.9;
  const distanceFromModalToStatusBar = getPercentagerFromNumber(height, 30);

  const runLoginModalAnimation = (): void => {
    Animated.timing(modalHeight, {
        toValue: LOGIN_MODAL_HEIGHT,
        duration: MODAL_ANIMATION_DURATION,
        useNativeDriver: false,
      },
    ).start();
  }

  const runRegisteModalAnimation = (): void => {
    Animated.timing(modalHeight, {
        toValue: REGISTER_MODAL_HEIGHT,
        duration: MODAL_ANIMATION_DURATION,
        useNativeDriver: false,
      },
    ).start();
  }

  const runForgotModalAnimation = (): void => {
    Animated.timing(modalHeight, {
        toValue: FORGOT_PASSWORD_MODAL_HEIGHT,
        duration: MODAL_ANIMATION_DURATION,
        useNativeDriver: false,
      },
    ).start();
  }

  const onTabPress = (tabIndex: number): void => {
    topTabBarLabels[tabIndex].name === loginTabName
    ? runLoginModalAnimation()
    : runRegisteModalAnimation();
    setCurrentTabIndex(tabIndex);
  }

  const onBackActionPress = () => {
    runLoginModalAnimation();
    setIsForgotPassword(false);
  }

  const onForgoPasswordPress = () => {
    runForgotModalAnimation();
    setIsForgotPassword(true);
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        const scrollViewOffset = getPercentagerFromNumber(height, 7.2);
        const openedKeyboardScreenHeight = Constants.statusBarHeight +
        distanceFromModalToStatusBar +
        (modalHeight as any)._value +
        event.endCoordinates.height +
        scrollViewOffset;
        const calculatedOffset = height - openedKeyboardScreenHeight;
        setModalOffset(calculatedOffset < 0 ? calculatedOffset : 0);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setModalOffset(0),
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.flex}>
      <StatusBar backgroundColor='#f5e0ce' barStyle='dark-content' />
      <View style={{ width, height, ...styles.backgroundContainer }}>
        <View style={styles.backroundHeaderContainer}>
          <Image source={appLogo} />
        </View>
        <View style={styles.backgroundBodyContainer}>
        </View>
      </View>
      <View style={styles.flex}>
        <ScrollView
          keyboardShouldPersistTaps='always'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={{ height: distanceFromModalToStatusBar + modalOffset }}></View>
          <Animated.View style={{ width: modalWidth, height: modalHeight, ...styles.modal }}>
            {!isForgotPassword && (
              <TopTabBar
                labels={topTabBarLabels}
                tabBarWidth={modalWidth}
                onTabPress={onTabPress}
                tabBarStyle={styles.tabBar}
              />
            )}
            {!isForgotPassword ? (
              topTabBarLabels[currentTabIndex].component
            ) : (
              <>
                <ForgotPasswordHeader
                  title='Відновлення паролю'
                  backActionIcon='chevron-left'
                  onBackActionPress={onBackActionPress}
                />
                <ForgotPasswordForm />
              </>
            )}
            {topTabBarLabels[currentTabIndex].name === loginTabName && !isForgotPassword && (
              <View style={styles.forgotPasswordButtonWrapper}>
                <Button
                  uppercase={false}
                  compact={true}
                  color='#3a2c3a'
                  contentStyle={styles.forgotPasswordButtonContent}
                  labelStyle={styles.forgotPasswordButtonLabel}
                  onPress={onForgoPasswordPress}
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
              onPress={() => console.log('Submited!')}
              labelStyle={styles.submitButtonLabel}
              style={styles.submitButton}
            >
              <Text>
                {
                  isForgotPassword
                  ? submitForgotPasswordBtnName
                  : topTabBarLabels[currentTabIndex].name
                }
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
  tabBar: {
    marginBottom: 12,
  },
  forgotPasswordButtonWrapper: {
    width: '90%',
    alignItems: 'flex-end',
  },
  forgotPasswordButtonContent: {
    height: 20,
  },
  forgotPasswordButtonLabel: {
    fontSize: 13.3,
    letterSpacing: 0,
  },
  submitButtonWrapper: {
    width: '65%',
    alignItems: 'center',
    top: -30,
    marginBottom: -20,
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
