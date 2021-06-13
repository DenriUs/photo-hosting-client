import React, { useRef } from 'react';
import { StyleSheet, View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Button } from 'react-native-paper';
import { TopTabBarConfig } from '../../other/types';

interface IProps {
  tabs: TopTabBarConfig[];
  tabBarWidth: number;
  onTabPress?: (tabIndex: number) => void;
  tabBarStyle?: StyleProp<ViewStyle>;
  tabsWrapperStyle?: StyleProp<ViewStyle>;
  tabButtonStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
};

const INDICATOR_ANIMATION_DURATION = 100;

const tabBarIndicatorX = 40;

const TopTabBar = (props: IProps) => {
  const {
    tabs,
    tabBarWidth,
    onTabPress,
    tabBarStyle,
    tabsWrapperStyle,
    tabButtonStyle,
    labelStyle,
    indicatorStyle,
  } = props;

  const topTabBarRef = useRef<View>(null);

  const tabButtonWidth = tabBarWidth / tabs.length;
  const indicatorWidth = tabButtonWidth - tabBarIndicatorX * 2;

  const indicatorX = useSharedValue(tabBarIndicatorX);

  const indicatorLeftStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: withTiming(indicatorX.value, { duration: INDICATOR_ANIMATION_DURATION }),
      }]
    };
  });

  const switchTab = (tabIndex: number) => {
    indicatorX.value = tabBarIndicatorX + tabButtonWidth * tabIndex;
    onTabPress && onTabPress(tabIndex);
  };

  const renderedTabs = tabs.map((tab, index) => (
    <Button
      key={index}
      color="#3a2c3a"
      uppercase={false}
      onPress={() => switchTab(index)}
      labelStyle={[styles.tabButtonLabel, labelStyle]}
      style={[styles.tabButton, tabButtonStyle]}>
      <Text>{tab.tabName}</Text>
    </Button>
  ));

  return (
    <View ref={topTabBarRef} style={[styles.tabBar, tabBarStyle]}>
      <View style={[styles.tabWrapper, tabsWrapperStyle]}>{renderedTabs}</View>
      <View style={styles.indicatorWrapper}>
        <Animated.View
          style={[
            styles.indicator,
            { width: indicatorWidth },
            indicatorStyle,
            indicatorLeftStyle,
          ]}
        > 
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    width: '100%',
    alignItems: 'center',
  },
  indicatorWrapper: {
    width: '100%',
  },
  indicator: {
    borderWidth: 1,
    borderColor: '#f7623c',
  },
  tabWrapper: {
    flexDirection: 'row',
  },
  tabButtonLabel: {
    fontSize: 15,
    letterSpacing: 0,
  },
  tabButton: {
    flex: 1,
    borderRadius: -1,
  },
});

export default TopTabBar;
