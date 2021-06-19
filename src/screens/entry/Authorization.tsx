import React, { useEffect, useRef } from 'react';
import {
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
import { FormikProps } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context'
import TopTabBar from '../../components/tabBars/TopTabBar';
import LoginForm from '../../components/forms/LoginForm';
import RegisterForm from '../../components/forms/RegisterForm';
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm';
import CustomHeader from '../../components/headers/CustomHeader';
import { getPercentageFromNumber, normalizeHeight } from '../../helpers/calculation';
import { appLogo } from '../../other/constants';
import { loginAccount, registerAccount } from '../../api/requests/authorization';
import SuccessModal from '../../components/modals/SuccessModal';
import ErrorModal from '../../components/modals/ErrorModal';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { AuthModalStateConfig } from '../../other/types';
import {
  changeAuthModalState,
  changeModalOffset,
  cleanUpLastResponseStatus
} from '../../redux/slices/authSlice';

const LOGIN_MODAL_HEIGHT = 305;
const REGISTER_MODAL_HEIGHT = 378;
const FORGOT_PASSWORD_MODAL_HEIGHT = 185;

const MODAL_ANIMATION_DURATION = 200;

const loginTabName = 'Вхід';
const registerTabName = 'Реєстрація';

const loginSubmitName = 'Увійти';
const registerSubmitName = 'Зареєструватися';
const forgotPassowrdSubmitName = 'Відправити код';

const Authorization = () => {
  const authState = useAppSelector((state) => state.auth);
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const formikRef = useRef<FormikProps<{}>>(null);
  const topTabBarRef = useRef<{ switchTab: (tabIndex: number) => void }>(null);

  const { width, height } = useWindowDimensions();

  const modalWidth = width * 0.9;
  const distanceFromModalToStatusBar = getPercentageFromNumber(height, 30);

  const fontScale = PixelRatio.getFontScale();

  const normalizedLoginHeight = normalizeHeight(LOGIN_MODAL_HEIGHT, fontScale);
  const normalizedRegisterHeight = normalizeHeight(REGISTER_MODAL_HEIGHT, fontScale);
  const normalizedForgotPasswordHeight = normalizeHeight(FORGOT_PASSWORD_MODAL_HEIGHT, fontScale);

  const modalHeight = useRef(
    new Animated.Value(
      authState.authModalState === 'LOGIN' ? normalizedLoginHeight : normalizedRegisterHeight
    )
  ).current;

  const onSubmitButtonPress = () => {
    formikRef.current && formikRef.current.submitForm();
  };

  const onLoginSubmit = async (values: { login: string, password: string }) => {
    dispatch(loginAccount(values));
  };

  const onRegisterSubmit = async (values: { login: string, email: string, password: string }) => {
    dispatch(registerAccount(values));
  };

  const onForgotPasswordSubmit = async (values: { email: string }) => {
    // dispatch(loginAccount(values));
  };

  const onBackActionPress = () => {
    dispatch(cleanUpLastResponseStatus());
    dispatch(changeAuthModalState('LOGIN'));
  };

  const onForgoPasswordPress = () => {
    dispatch(cleanUpLastResponseStatus());
    dispatch(changeAuthModalState('FORGOT_PASSWORD'));
  };

  const closeSuccessModal = () => {
    dispatch(cleanUpLastResponseStatus());
    dispatch(changeAuthModalState('LOGIN'));
    topTabBarRef.current?.switchTab(0);
  }

  const authModalStateConfigs: AuthModalStateConfig[] = [
    {
      authModalState: 'LOGIN',
      tabName: loginTabName,
      submitName: loginSubmitName,
      modalHeigh: normalizedLoginHeight,
      render: <LoginForm ref={formikRef} onSubmit={onLoginSubmit} />,
    },
    {
      authModalState: 'REGISTER',
      tabName: registerTabName,
      submitName: registerSubmitName,
      modalHeigh: normalizedRegisterHeight,
      render: <RegisterForm ref={formikRef} onSubmit={onRegisterSubmit} />,
    },
    {
      authModalState: 'FORGOT_PASSWORD',
      submitName: forgotPassowrdSubmitName,
      modalHeigh: normalizedForgotPasswordHeight,
      render: (
        <>
          <CustomHeader
            title='Відновлення паролю'
            backActionIcon='chevron-left'
            onBackActionPress={onBackActionPress}
          />
          <ForgotPasswordForm ref={formikRef} onSubmit={onForgotPasswordSubmit} />
        </>
      )
    },
  ];

  const getCurrentModalStateConfig = (): AuthModalStateConfig | undefined => {
    return authModalStateConfigs.find(
      (config) => config.authModalState === authState.authModalState,
    );
  };

  const getTopTabBarConfigs = (): AuthModalStateConfig[] => {
    return authModalStateConfigs.filter(
      (config) => config.authModalState !== 'FORGOT_PASSWORD',
    );
  };

  const onTabPress = (tabIndex: number) => {
    dispatch(cleanUpLastResponseStatus());
    dispatch(changeAuthModalState(getTopTabBarConfigs()[tabIndex].authModalState));
  };

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

  useEffect(() => {
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');
    
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      const scrollViewOffset = getPercentageFromNumber(height, 7.2);
      const openedKeyboardScreenHeight =
        Constants.statusBarHeight +
        distanceFromModalToStatusBar +
        (modalHeight as any)._value +
        event.endCoordinates.height +
        scrollViewOffset;
      const calculatedOffset = height - openedKeyboardScreenHeight;
      dispatch(changeModalOffset((calculatedOffset < 0 ? calculatedOffset : 0)));
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      dispatch(changeModalOffset(0));
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    const newModalHeight = getCurrentModalStateConfig()?.modalHeigh;
    if (!newModalHeight) return;
    runModalHeightAnimation(newModalHeight);
  }, [authState.authModalState]);

  const renderTobTabBar = () => (
    <>
      <TopTabBar
        ref={topTabBarRef}
        tabs={getTopTabBarConfigs()}
        tabBarWidth={modalWidth}
        onTabPress={onTabPress}
        tabBarStyle={{ marginBottom: fontScale > 1 ? 0 : 12 }}
      />
    </>
  );

  const renderCurrentModalForm = () => getCurrentModalStateConfig()?.render;

  const renderForgotPasswordButton = () => (
    <View
      style={{
        ...styles.forgotPasswordButtonWrapper,
      }}>
      <Button
        compact={true}
        color='#3a2c3a'
        uppercase={false}
        disabled={authState.api.loading}
        contentStyle={{ height: normalizeHeight(20, fontScale) }}
        labelStyle={styles.forgotPasswordButtonLabel}
        onPress={onForgoPasswordPress}
        style={styles.forgotPasswordButton}
      >
        <Text>Забули пароль?</Text>
      </Button>
    </View>
  );

  const renderSubmitButton = () => (
    <View style={styles.submitButtonWrapper}>
      <Button
        mode='contained'
        color='#3a2c3a'
        uppercase={false}
        disabled={authState.api.loading}
        loading={authState.api.loading}
        onPress={onSubmitButtonPress}
        labelStyle={styles.submitButtonLabel}
        style={styles.submitButton}
      >
        <Text>
          {getCurrentModalStateConfig()?.submitName}
        </Text>
      </Button>
    </View>
  );

  return (
    <SafeAreaView style={styles.flex}>
      <StatusBar translucent />
      <SuccessModal
        isVisible={!!authState.api.lastResponseStatus.success.message}
        text={authState.api.lastResponseStatus.success.message}
        onBackdropPress={closeSuccessModal}
        onCloseButtonPress={closeSuccessModal}
      />
      <ErrorModal
        isVisible={authState.api.lastResponseStatus.error.isServerError}
        text='Нам дуже шкода, але сталася невідома помилка.'
        onBackdropPress={() => dispatch(cleanUpLastResponseStatus())}
        onCloseButtonPress={() => dispatch(cleanUpLastResponseStatus())}
      />
      <View style={{ width, height, ...styles.backgroundContainer }}>
        <View style={[styles.backroundHeaderContainer, { marginTop: Constants.statusBarHeight }]}>
          <Image source={appLogo} style={styles.logo} />
          <View style={styles.logoTitleWrapper}>
            <Text style={styles.logoTitlePrefix}>re</Text>
            <Text style={styles.logoTitle}>Photo</Text>
          </View>
        </View>
        <View style={styles.backgroundBodyContainer}></View>
      </View>
      <View style={styles.flex}>
        <ScrollView
          keyboardShouldPersistTaps='always'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}
        >
          <View style={{ height: distanceFromModalToStatusBar + authState.modalOffset }}></View>
          <Animated.View style={{ width: modalWidth, height: modalHeight, ...styles.modal }}>
            {authState.authModalState !== 'FORGOT_PASSWORD' && renderTobTabBar()}
            {renderCurrentModalForm()}
            {authState.api.lastResponseStatus.error.isRequestResult &&
              !authState.api.lastResponseStatus.error.isServerError &&
                !!authState.api.lastResponseStatus.error.message && (
                  <View style={{ width: '90%', alignSelf: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12.5, color: '#f7623c' }}>
                      {authState.api.lastResponseStatus.error.message}
                    </Text>
                  </View>
                )
            }
            {authState.authModalState === 'LOGIN' && renderForgotPasswordButton()}
          </Animated.View>
          {renderSubmitButton()}    
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
  logo: {
    width: '35%',
    height: 90,
    marginLeft: 8,
  },
  logoTitleWrapper: {
    flexDirection: 'row',
  },
  logoTitlePrefix: {
    fontSize: 45,
    color: '#3a2c3a',
  },
  logoTitle: {
    fontSize: 45,
    color: '#f7623c',
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
  forgotPasswordButton: {
    marginTop: 12,
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
