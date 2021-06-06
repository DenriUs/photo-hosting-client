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
import { FormikProps } from 'formik';
import LottieView from 'lottie-react-native';
import TopTabBar from '../../components/tabBars/TopTabBar';
import LoginForm from '../../components/forms/LoginForm';
import RegisterForm from '../../components/forms/RegisterForm';
import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm';
import CustomHeader from '../../components/headers/CustomHeader';
import { getPercentagerFromNumber, normalizeHeight } from '../../helpers/calculation';
import { appLogo } from '../../other/constants';
import { checkAuthStatus, loginAccount } from '../../api/requests/authorization';
import SuccessModal from '../../components/modals/SuccessModal';
import ErrorModal from '../../components/modals/ErrorModal';
import { AxiosHelper } from '../../helpers/api';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { changeAuthModalState, cleanErrors } from '../../redux/slices/authSlice';
import { AuthModalStateConfig } from '../../other/types';

const LOGIN_MODAL_HEIGHT = 305;
const REGISTER_MODAL_HEIGHT = 378;
const FORGOT_PASSWORD_MODAL_HEIGHT = 185;

const MODAL_ANIMATION_DURATION = 250;

const loginTabName = 'Вхід';
const registerTabName = 'Реєстрація';

const loginSubmitName = 'Увійти';
const registerSubmitName = 'Зареєструватися';
const forgotPassowrdSubmitName = 'Відправити код';

const Authorization = () => {
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [modalOffset, setModalOffset] = useState(0);

  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const formikRef = useRef<FormikProps<{}>>(null);

  const { width, height } = useWindowDimensions();

  const modalWidth = width * 0.9;
  const distanceFromModalToStatusBar = getPercentagerFromNumber(height, 30);

  const fontScale = PixelRatio.getFontScale();

  const normalizedLoginHeight = normalizeHeight(LOGIN_MODAL_HEIGHT, fontScale);
  const normalizedRegisterHeight = normalizeHeight(REGISTER_MODAL_HEIGHT, fontScale);
  const normalizedForgotPasswordHeight = normalizeHeight(FORGOT_PASSWORD_MODAL_HEIGHT, fontScale);

  const modalHeight = useRef(
    new Animated.Value(
      authState.authModalState === 'LOGIN' ? normalizedLoginHeight : normalizedRegisterHeight
    )
  ).current;

  const onLoginSubmit = async (values: { login: string; password: string }) => {
    dispatch(loginAccount(values));
  };

  const onRegisterSubmit = () => {
    console.log('register submitted!');
  };

  const onForgotPasswordSubmit = () => {
    console.log('forgot password submitted!');
  };

  const onBackActionPress = () => {
    dispatch(changeAuthModalState('LOGIN'));
  };

  const onForgoPasswordPress = () => {
    dispatch(changeAuthModalState('FORGOT_PASSWORD'));
  };

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
  }

  const getTopTabBarConfigs = (): AuthModalStateConfig[] => {
    return authModalStateConfigs.filter(
      (config) => config.authModalState !== 'FORGOT_PASSWORD',
    );
  }

  const onTabPress = (tabIndex: number) => {
    dispatch(changeAuthModalState(getTopTabBarConfigs()[tabIndex].authModalState));
  };

  const runModalHeightAnimation = (height: number, duration: number = MODAL_ANIMATION_DURATION) => {
    Animated.timing(modalHeight, {
      toValue: height,
      duration,
      useNativeDriver: false,
    }).start();
  };

  const toggleSuccessModal = () => setIsSuccessModalVisible(!setIsSuccessModalVisible);

  useEffect(() => {
    (async () => {
      await AxiosHelper.updateAxiosInstance();
      dispatch(checkAuthStatus());
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

  useEffect(() => {
    if (authState.error.message) {
      setErrorText(authState.error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    const newModalHeight = getCurrentModalStateConfig()?.modalHeigh;
    if (newModalHeight) {
      runModalHeightAnimation(newModalHeight);
    }
  }, [authState.authModalState]);

  const renderTobTabBar = () => (
    <>
      <TopTabBar
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
        uppercase={false}
        compact={true}
        color='#3a2c3a'
        contentStyle={{ height: normalizeHeight(20, fontScale) }}
        labelStyle={styles.forgotPasswordButtonLabel}
        onPress={onForgoPasswordPress}
        style={styles.forgotPasswordButton}>
        <Text>Забули пароль?</Text>
      </Button>
    </View>
  );

  const renderSubmitButton = () => (
    <View style={styles.submitButtonWrapper}>
      <Button
        mode="contained"
        color="#3a2c3a"
        uppercase={false}
        onPress={() => {
          setIsSuccessModalVisible(true);
          formikRef.current && formikRef.current.submitForm();
        }}
        labelStyle={styles.submitButtonLabel}
        style={styles.submitButton}>
        <Text>
          {getCurrentModalStateConfig()?.submitName}
        </Text>
      </Button>
    </View>
  );

  if (authState.loading) {
    return (
      <View style={[styles.flex, styles.loadingContainer]}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <LottieView source={require('../../../assets/lottie/loading.json')} autoPlay loop />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.flex}>
      <StatusBar backgroundColor="#f5e0ce" barStyle="dark-content" />
      <SuccessModal
        isVisible={isSuccessModalVisible}
        text='Обліковий запис зареєстровано успішно.'
        onBackdropPress={toggleSuccessModal}
        onCloseButtonPress={toggleSuccessModal}
      />
      <ErrorModal
        isVisible={authState.error.isServerError}
        text='Нам дуже шкода, але сталася невідома помилка.'
        onBackdropPress={() => dispatch(cleanErrors())}
        onCloseButtonPress={() => dispatch(cleanErrors())}
      />
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
            {authState.authModalState !== 'FORGOT_PASSWORD' && renderTobTabBar()}
            {renderCurrentModalForm()}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
